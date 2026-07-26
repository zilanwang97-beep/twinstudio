import { navigate, onRouteChange, readRoute } from "./router.js";

const DESKTOP_MQ = "(min-width: 821px)";
const HEADER_LAYOUT = {
  logo: { x: 123, y: 56, w: 87 },
  burger: { x: 1276, y: 55, w: 51 },
  back: { x: 131, y: 60, w: 17 }
};

let bound = false;

function isDesktop() {
  return matchMedia(DESKTOP_MQ).matches;
}

function els() {
  return {
    header: document.querySelector("#site-header"),
    menu: document.querySelector("#site-menu"),
    burger: document.querySelector("#site-burger"),
    logo: document.querySelector("#site-logo"),
    back: document.querySelector("#site-back"),
    links: document.querySelector("#site-menu-links")
  };
}

function setOpen(open) {
  const { menu, burger } = els();
  if (!menu || !burger) return;
  document.body.classList.toggle("menu-open", open);
  menu.classList.toggle("is-open", open);
  menu.setAttribute("aria-hidden", open ? "false" : "true");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
  burger.setAttribute("aria-label", open ? "Close menu" : "Menu");
}

function closeMenu() {
  setOpen(false);
}

function toggleMenu() {
  setOpen(!document.body.classList.contains("menu-open"));
}

export function layoutSiteChrome() {
  const { logo, back, burger, menu, links } = els();
  if (!logo || !burger || !menu || !links) return;

  if (!isDesktop()) {
    for (const el of [logo, back, burger, menu, links]) {
      if (!el) continue;
      el.style.left = "";
      el.style.top = "";
      el.style.right = "";
      el.style.width = "";
      el.style.height = "";
      el.style.gap = "";
      el.style.fontSize = "";
    }
    return;
  }

  const vw = document.documentElement.clientWidth;
  const sH = Math.min(1.25, Math.max(0.8, vw / 1440));
  const L = HEADER_LAYOUT.logo;
  const B = HEADER_LAYOUT.burger;
  const R = HEADER_LAYOUT.back;

  logo.style.left = `${Math.max(18, (vw * L.x) / 1440)}px`;
  logo.style.top = `${L.y * sH}px`;
  logo.style.width = `${L.w * sH}px`;

  back.style.left = `${Math.max(18, (vw * R.x) / 1440)}px`;
  back.style.top = `${R.y * sH}px`;
  back.style.width = `${R.w * sH}px`;

  const bLeft = Math.min(vw - 35 * sH - 18, (vw * B.x) / 1440);
  burger.style.left = `${bLeft}px`;
  burger.style.top = `${B.y * sH}px`;
  burger.style.width = `${B.w * sH}px`;

  const hp = Math.min(330, Math.max(235, (vw * 300) / 1440));
  const k = hp / 300;
  menu.style.height = `${hp}px`;
  links.style.right = `${vw - bLeft - 35 * sH}px`;
  links.style.top = `${124 * k}px`;
  links.style.gap = `${24 * k}px`;
  links.style.fontSize = `${18 * k}px`;
}

export function syncHeaderForRoute(page = readRoute().page) {
  closeMenu();
  const { logo, back } = els();
  if (!logo || !back) return;

  const isDetail = page === "detail";
  logo.hidden = isDetail;
  back.hidden = !isDetail;
  document.body.classList.toggle("is-detail", isDetail);

  if (isDesktop()) layoutSiteChrome();
}

export function initMenu() {
  if (bound) return;
  const { header, menu, burger, logo, back, links } = els();
  if (!header || !menu || !burger) return;
  bound = true;

  burger.addEventListener("click", event => {
    event.stopPropagation();
    toggleMenu();
  });

  logo?.addEventListener("click", event => {
    /* hash navigation via href="#home"; also scroll desktop home to top */
    closeMenu();
    if (isDesktop() && (location.hash === "#home" || location.hash === "" || location.hash === "#")) {
      event.preventDefault();
      history.pushState("", "", `${location.pathname}#home`);
      dispatchEvent(new HashChangeEvent("hashchange"));
      scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  back?.addEventListener("click", () => {
    closeMenu();
    navigate("collection");
  });

  links?.addEventListener("click", event => {
    const anchor = event.target.closest("a");
    if (!anchor) return;
    closeMenu();
  });

  document.addEventListener("click", event => {
    if (!document.body.classList.contains("menu-open")) return;
    if (event.target.closest("#site-menu") || event.target.closest("#site-burger")) return;
    closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  addEventListener("resize", layoutSiteChrome);
  layoutSiteChrome();
  syncHeaderForRoute();

  onRouteChange(({ page }) => {
    syncHeaderForRoute(page);
  });
}
