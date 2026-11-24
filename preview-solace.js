(() => {
  "use strict";

  const menuButton = document.getElementById("sc-nav-toggle");
  const mobileMenu = document.getElementById("sc-mobile-nav");
  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    if (menuButton) menuButton.innerHTML = '<span aria-hidden="true">☰</span>';
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.innerHTML = isOpen
      ? '<span aria-hidden="true">✕</span>'
      : '<span aria-hidden="true">☰</span>';
  });

  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

  const featureRows = [...document.querySelectorAll(".sc-feature")];
  featureRows.forEach(row => {
    const button = row.querySelector("button");
    button?.addEventListener("click", () => {
      const shouldOpen = row.dataset.open !== "true";
      featureRows.forEach(item => {
        const open = item === row && shouldOpen;
        item.dataset.open = String(open);
        item.querySelector("button")?.setAttribute("aria-expanded", String(open));
      });
    });
  });

  const film = document.getElementById("sc-film");
  const filmButton = document.getElementById("sc-film-play");
  const filmThumb = film?.querySelector("img");
  if (filmThumb) {
    let fallback = 0;
    filmThumb.addEventListener("error", () => {
      if (fallback === 0) {
        filmThumb.src = "https://i.ytimg.com/vi/OkhdnBWKPgQ/sddefault.jpg";
        fallback++;
      } else if (fallback === 1) {
        filmThumb.src = "https://i.ytimg.com/vi/OkhdnBWKPgQ/hqdefault.jpg";
        fallback++;
      } else {
        filmThumb.style.display = "none";
      }
    });
  }

  filmButton?.addEventListener("click", () => {
    if (!film) return;
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/OkhdnBWKPgQ?autoplay=1&rel=0";
    frame.title = "Structura Road Click — SketchUp demonstration";
    frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    film.appendChild(frame);
    filmButton.remove();
  });

  const toReveal = document.querySelectorAll(".sc-reveal");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: .08 });
    toReveal.forEach(el => observer.observe(el));
  } else {
    toReveal.forEach(el => el.classList.add("is-visible"));
  }
})();