const VALID_PAGES = new Set(["home", "philosophy", "lookbook", "collection", "detail", "story", "shop"]);

export function readRoute() {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return { page: "home", category: "" };
  const [page, category = ""] = raw.split("/");
  return VALID_PAGES.has(page) ? { page, category } : { page: "home", category: "" };
}

export function navigate(page, category = "") {
  location.hash = category ? `${page}/${category}` : page;
}

export function onRouteChange(callback) {
  const sync = () => callback(readRoute());
  addEventListener("hashchange", sync);
  sync();
  return () => removeEventListener("hashchange", sync);
}
