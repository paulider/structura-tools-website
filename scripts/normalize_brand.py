from pathlib import Path
import re
import sys

FINAL_LOGO = "/assets/structura-logo-final.png"
FINAL_FLOOR = "/assets/floor-wall-logo-current.png"
VERSION = "20260815-brand-final"
BUILD = "2026-08-15-structura-tools-final-brand"

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


def normalize_block_img(text: str, block_pattern: str, src: str) -> str:
    rx = re.compile(block_pattern, re.I | re.S)
    return rx.sub(lambda m: replace_first_img_src(m.group(0), src), text, count=1)


def normalize_page(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    # Normalize named legacy assets with or without a leading slash.
    for name in OLD_STRUCTURA:
        text = text.replace(f"/assets/{name}", FINAL_LOGO)
        text = text.replace(f"assets/{name}", FINAL_LOGO.lstrip("/"))
    for name in OLD_FLOOR:
        text = text.replace(f"/assets/{name}", FINAL_FLOOR)
        text = text.replace(f"assets/{name}", FINAL_FLOOR.lstrip("/"))

    text = text.replace("/assets/road-click.webp", "/assets/road-click-safe.png")
    text = text.replace("assets/road-click.webp", "assets/road-click-safe.png")
    text = text.replace("/assets/buildings.webp", "/assets/buildings-safe.png")
    text = text.replace("assets/buildings.webp", "assets/buildings-safe.png")
    text = text.replace("/assets/pau-cols-founder.webp", "/assets/pau-cols-final.jpg")
    text = text.replace("assets/pau-cols-founder.webp", "assets/pau-cols-final.jpg")

    # Header brand: force both the definitive logo and immutable brand name,
    # regardless of whether the old source was a file URL or a data URI.
    brand_rx = re.compile(
        r'<a\b[^>]*class=["\'][^"\']*\bbrand\b[^"\']*["\'][^>]*>.*?</a>',
        re.I | re.S,
    )
    def fix_brand(m):
        block = replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}")
        block = re.sub(r'(<span\b[^>]*>).*?(</span>)', r'\1STRUCTURA TOOLS\2', block, count=1, flags=re.I | re.S)
        return block
    text = brand_rx.sub(fix_brand, text, count=1)

    # Hero logo is also forced structurally, so embedded base64 images cannot survive.
    hero_img_rx = re.compile(r'<img\b[^>]*class=["\'][^"\']*\blanding-hero-logo\b[^"\']*["\'][^>]*>', re.I | re.S)
    text = hero_img_rx.sub(lambda m: replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}"), text, count=1)

    # Hero title: localized tagline in nested span remains localized; brand does not.
    text = re.sub(
        r'(<h1\b[^>]*class=["\'][^"\']*\blanding-title\b[^"\']*["\'][^>]*>).*?(<span\b)',
        r'\1STRUCTURA TOOLS\2',
        text,
        count=1,
        flags=re.I | re.S,
    )

    # Ecosystem brand card: force both logo and label.
    tile_rx = re.compile(r'<[^>]+class=["\'][^"\']*\bbrand-tile\b[^"\']*["\'][^>]*>.*?</(?:a|div)>', re.I | re.S)
    def fix_tile(m):
        block = replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}")
        block = re.sub(r'(<strong\b[^>]*>).*?(</strong>)', r'\1Structura Tools\2', block, count=1, flags=re.I | re.S)
        return block
    text = tile_rx.sub(fix_tile, text, count=1)

    # Footer logo if present.
    footer_img_rx = re.compile(r'<img\b[^>]*class=["\'][^"\']*\bfooter-logo\b[^"\']*["\'][^>]*>', re.I | re.S)
    text = footer_img_rx.sub(lambda m: replace_first_img_src(m.group(0), f"{FINAL_LOGO}?v={VERSION}"), text)

    # Favicon follows the same immutable master.
    icon_rx = re.compile(r'<link\b(?=[^>]*\brel=["\']icon["\'])[^>]*>', re.I | re.S)
    def fix_icon(m):
        block = m.group(0)
        if re.search(r'\bhref\s*=', block, re.I):
            return re.sub(r'(\bhref\s*=\s*)(["\']).*?\2', lambda x: f'{x.group(1)}"{FINAL_LOGO}?v={VERSION}"', block, count=1, flags=re.I | re.S)
        return block[:-1] + f' href="{FINAL_LOGO}?v={VERSION}">'
    text = icon_rx.sub(fix_icon, text, count=1)

    for old, new in TRANSLATED_BRAND.items():
        text = text.replace(old, new)

    text = re.sub(r'v=202608(?:13|14|15)-[0-9A-Za-z-]+', f'v={VERSION}', text)
    text = re.sub(r'content="2026-08-(?:14|15)-[^"]+"', f'content="{BUILD}"', text)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def verify_page(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    errors = []

    for name in OLD_STRUCTURA + OLD_FLOOR:
        if name in text:
            errors.append(f"{path}: legacy/broken asset remains: {name}")
    for phrase in FORBIDDEN_BRAND:
        if phrase in text:
            errors.append(f"{path}: translated brand remains: {phrase}")

    brand_match = re.search(r'<a\b[^>]*class=["\'][^"\']*\bbrand\b[^"\']*["\'][^>]*>.*?</a>', text, re.I | re.S)
    if brand_match:
        block = brand_match.group(0)
        if "structura-logo-final.png" not in block:
            errors.append(f"{path}: header brand does not use definitive logo")
        if not re.search(r'>\s*STRUCTURA TOOLS\s*</span>', block, re.I):
            errors.append(f"{path}: header brand name is not Structura Tools")

    if "landing-title" in text:
        title = re.search(r'<h1\b[^>]*class=["\'][^"\']*\blanding-title\b[^"\']*["\'][^>]*>(.*?)</h1>', text, re.I | re.S)
        if title and not re.match(r'\s*STRUCTURA TOOLS\s*<span\b', title.group(1), re.I | re.S):
            errors.append(f"{path}: hero brand name is not Structura Tools")
        hero_logo = re.search(r'<img\b[^>]*class=["\'][^"\']*\blanding-hero-logo\b[^"\']*["\'][^>]*>', text, re.I | re.S)
        if hero_logo and "structura-logo-final.png" not in hero_logo.group(0):
            errors.append(f"{path}: hero does not use definitive logo")

    return errors


def main():
    pages = sorted(Path('.').glob('*.html'))
    if not pages:
        raise SystemExit('No HTML pages found')

    changed = []
    for page in pages:
        if normalize_page(page):
            changed.append(str(page))

    errors = []
    for page in pages:
        errors.extend(verify_page(page))

    print(f"Processed {len(pages)} HTML pages; changed {len(changed)}")
    for page in changed:
        print(f"  updated {page}")

    if errors:
        print("Brand contract violations:", file=sys.stderr)
        for error in errors:
            print(f"  {error}", file=sys.stderr)
        raise SystemExit(1)

    print("Brand contract verified: Structura Tools is immutable across locales.")


if __name__ == '__main__':
    main()
