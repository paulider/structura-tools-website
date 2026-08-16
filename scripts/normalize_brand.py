from pathlib import Path
import re
import sys

FINAL_LOGO = "/assets/structura-logo-final.png"
FINAL_FLOOR = "/assets/floor-wall-logo-current.png"
FINAL_PAU = "/assets/pau-cols-v4.jpg"
VERSION = "20260816-pau-v4"
BUILD = "2026-08-16-pau-v4"

OLD_STRUCTURA = [
    "structura-logo-official.webp",
    "structura-logo-current.png",
    "structura-logo-approved.jpg",
    "structura-logo-20260813.jpg",
    "structura-logo-20260813.png",
    "structura-logo-safe.png",
    "structura-logo-clean.png",
    "structura-logo.png",
]
OLD_FLOOR = [
    "floor-wall-logo-official.webp",
    "floor-wall-logo-safe.png",
    "floor-wall-icon.jpg",
]
OLD_PAU = [
    "pau-cols-founder.webp",
    "pau-cols-final.jpg",
    "pau-cols-clean.jpg",
    "pau-cols-mobile.jpg",
    "pau-cols-stable.jpg",
    "pau-cols-v2.jpg",
    "pau-cols.jpg",
]

TRANSLATED_BRAND = {
    "HERRAMIENTAS STRUCTURA": "STRUCTURA TOOLS",
    "Herramientas Structura": "Structura Tools",
    "Herramientas de estructura": "Structura Tools",
    "ESTRUCTURA": "STRUCTURA TOOLS",
    "EINES STRUCTURA": "STRUCTURA TOOLS",
    "Eines Structura": "Structura Tools",
    "OUTILS STRUCTURA": "STRUCTURA TOOLS",
    "Outils Structura": "Structura Tools",
    "STRUMENTI STRUCTURA": "STRUCTURA TOOLS",
    "Strumenti Structura": "Structura Tools",
}

FORBIDDEN_BRAND = [
    "HERRAMIENTAS STRUCTURA",
    "ESTRUCTURA",
    "EINES STRUCTURA",
    "OUTILS STRUCTURA",
    "STRUMENTI STRUCTURA",
]


def replace_first_img_src(block: str, src: str) -> str:
    pattern = re.compile(r'(<img\b[^>]*?\bsrc\s*=\s*)(["\']).*?\2', re.I | re.S)
    return pattern.sub(lambda m: f'{m.group(1)}"{src}"', block, count=1)


def replace_asset_names(text: str, names: list[str], canonical: str) -> str:
    for name in names:
        text = text.replace(f"/assets/{name}", canonical)
        text = text.replace(f"assets/{name}", canonical.lstrip("/"))
    return text


def normalize_page(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    text = replace_asset_names(text, OLD_STRUCTURA, FINAL_LOGO)
    text = replace_asset_names(text, OLD_FLOOR, FINAL_FLOOR)
    text = replace_asset_names(text, OLD_PAU, FINAL_PAU)

    text = text.replace("/assets/road-click.webp", "/assets/road-click-safe.png").replace(
        "assets/road-click.webp", "assets/road-click-safe.png"
    )
    text = text.replace("/assets/buildings.webp", "/assets/buildings-safe.png").replace(
        "assets/buildings.webp", "assets/buildings-safe.png"
    )

    brand_rx = re.compile(
        r'<a\b[^>]*class=["\'][^"\']*\bbrand\b[^"\']*["\'][^>]*>.*?</a>',
        re.I | re.S,
    )

    def fix_brand(m):
        block = replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}")
        if re.search(r'<span\b', block, re.I):
            block = re.sub(
                r'(<span\b[^>]*>).*?(</span>)',
                r'\1STRUCTURA TOOLS\2',
                block,
                count=1,
                flags=re.I | re.S,
            )
        elif re.search(r'<strong\b', block, re.I):
            block = re.sub(
                r'(<strong\b[^>]*>).*?(</strong>)',
                r'\1STRUCTURA TOOLS\2',
                block,
                count=1,
                flags=re.I | re.S,
            )
        else:
            block = re.sub(
                r'(</a>)',
                r'<span>STRUCTURA TOOLS</span>\1',
                block,
                count=1,
                flags=re.I,
            )
        return block

    text = brand_rx.sub(fix_brand, text, count=1)

    hero_img_rx = re.compile(
        r'<img\b[^>]*class=["\'][^"\']*\blanding-hero-logo\b[^"\']*["\'][^>]*>',
        re.I | re.S,
    )
    text = hero_img_rx.sub(
        lambda m: replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}"),
        text,
        count=1,
    )
    text = re.sub(
        r'(<h1\b[^>]*class=["\'][^"\']*\blanding-title\b[^"\']*["\'][^>]*>).*?(<span\b)',
        r'\1STRUCTURA TOOLS\2',
        text,
        count=1,
        flags=re.I | re.S,
    )

    tile_rx = re.compile(
        r'<[^>]+class=["\'][^"\']*\bbrand-tile\b[^"\']*["\'][^>]*>.*?</(?:a|div)>',
        re.I | re.S,
    )

    def fix_tile(m):
        block = replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}")
        return re.sub(
            r'(<strong\b[^>]*>).*?(</strong>)',
            r'\1Structura Tools\2',
            block,
            count=1,
            flags=re.I | re.S,
        )

    text = tile_rx.sub(fix_tile, text, count=1)

    footer_img_rx = re.compile(
        r'<img\b[^>]*class=["\'][^"\']*\bfooter-logo\b[^"\']*["\'][^>]*>',
        re.I | re.S,
    )
    text = footer_img_rx.sub(
        lambda m: replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}"), text
    )

    icon_rx = re.compile(
        r'<link\b(?=[^>]*\brel=["\']icon["\'])[^>]*>', re.I | re.S
    )

    def fix_icon(m):
        block = m.group(0)
        if re.search(r'\bhref\s*=', block, re.I):
            return re.sub(
                r'(\bhref\s*=\s*)(["\']).*?\2',
                lambda x: f'{x.group(1)}"{FINAL_LOGO}?v={VERSION}"',
                block,
                count=1,
                flags=re.I | re.S,
            )
        return block[:-1] + f' href="{FINAL_LOGO}?v={VERSION}">'

    text = icon_rx.sub(fix_icon, text, count=1)

    for old, new in TRANSLATED_BRAND.items():
        text = text.replace(old, new)

    text = re.sub(
        r'v=202608(?:13|14|15)-[0-9A-Za-z-]+', f'v={VERSION}', text
    )
    text = re.sub(
        r'content="2026-08-(?:14|15)-[^"]+"', f'content="{BUILD}"', text
    )

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def verify_page(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    errors = []

    for name in OLD_STRUCTURA + OLD_FLOOR + OLD_PAU:
        if name in text:
            errors.append(f"{path}: legacy/broken asset remains: {name}")

    for phrase in FORBIDDEN_BRAND:
        if phrase in text:
            errors.append(f"{path}: translated brand remains: {phrase}")

    brand_match = re.search(
        r'<a\b[^>]*class=["\'][^"\']*\bbrand\b[^"\']*["\'][^>]*>.*?</a>',
        text,
        re.I | re.S,
    )
    if brand_match:
        block = brand_match.group(0)
        if "structura-logo-final.png" not in block:
            errors.append(f"{path}: header brand does not use definitive logo")
        plain = re.sub(r'<[^>]+>', ' ', block)
        if not re.search(r'\bSTRUCTURA\s+TOOLS\b', plain, re.I):
            errors.append(f"{path}: header brand name is not Structura Tools")

    if "landing-title" in text:
        title = re.search(
            r'<h1\b[^>]*class=["\'][^"\']*\blanding-title\b[^"\']*["\'][^>]*>(.*?)</h1>',
            text,
            re.I | re.S,
        )
        if title and not re.match(
            r'\s*STRUCTURA TOOLS\s*<span\b', title.group(1), re.I | re.S
        ):
            errors.append(f"{path}: hero brand name is not Structura Tools")
        hero_logo = re.search(
            r'<img\b[^>]*class=["\'][^"\']*\blanding-hero-logo\b[^"\']*["\'][^>]*>',
            text,
            re.I | re.S,
        )
        if hero_logo and "structura-logo-final.png" not in hero_logo.group(0):
            errors.append(f"{path}: hero does not use definitive logo")

    if "Pau G.Cols" in text and "founder-v2-photo" in text:
        founder = re.search(
            r'<div\b[^>]*class=["\'][^"\']*\bfounder-v2-photo\b[^"\']*["\'][^>]*>.*?</div>',
            text,
            re.I | re.S,
        )
        if founder and "pau-cols-v4.jpg" not in founder.group(0):
            errors.append(f"{path}: founder portrait does not use verified mobile-safe asset")

    return errors


def main():
    pages = sorted(Path('.').glob('*.html'))
    if not pages:
        raise SystemExit('No HTML pages found')

    changed = [str(p) for p in pages if normalize_page(p)]
    errors = []
    for p in pages:
        errors.extend(verify_page(p))

    print(f"Processed {len(pages)} HTML pages; changed {len(changed)}")
    for p in changed:
        print(f"  updated {p}")

    if errors:
        print("Brand/asset contract violations:", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        raise SystemExit(1)

    print("Brand contract verified; Pau portrait uses verified mobile-safe v4 asset.")


if __name__ == '__main__':
    main()
