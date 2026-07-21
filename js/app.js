import { initCollection, renderDetail, updateDetailScrim } from "./collection.js";
import { initMenu } from "./menu.js";
import { onRouteChange } from "./router.js";
import { initMobileHome } from "./home-mobile.js";
import { initStory } from "./story.js";

const desktopQuery = matchMedia("(min-width: 1024px)");
let desktopHomeLoaded = false;

function ensureDesktopHome() {
  if (!desktopHomeLoaded) {
    desktopHomeLoaded = true;
    import("./home-desktop.js");
  }
}

function showOnly(id) {
  document.querySelectorAll("#app-frame > .view").forEach(view => {
    view.classList.toggle("active", view.id === id);
  });
  document.querySelector("#app-frame")?.scrollTo({ top: 0 });
}

function showPending(page) {
  const pending = document.querySelector("#view-mobile-home");
  const title = pending.querySelector("h1");
  const copy = pending.querySelector("p");
  title.textContent = `Mobile ${page} is ready for design.`;
  copy.textContent = "Collection, Detail and Story are already shared across desktop and mobile.";
  showOnly("view-mobile-home");
}

function syncRoute({ page, category }) {
  document.body.dataset.route = page;

  if (page === "collection") showOnly("view-collection");
  if (page === "detail") {
    renderDetail(category);
    showOnly("view-detail");
    updateDetailScrim();
  }
  if (page === "story") showOnly("view-story");

  if (["home", "philosophy", "lookbook"].includes(page)) {
    if (desktopQuery.matches) {
      document.querySelectorAll("#app-frame > .view").forEach(view => view.classList.remove("active"));
      ensureDesktopHome();
      requestAnimationFrame(() => {
        const target = page === "home" ? null : document.getElementById(page);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        else scrollTo({ top: 0, behavior: "smooth" });
      });
    } else {
      showPending(page);
    }
  }
}

initCollection();
initMenu();
initMobileHome();
initStory();
document.querySelector("#app-frame")?.addEventListener("scroll", updateDetailScrim, { passive: true });
onRouteChange(syncRoute);

let wasDesktop = desktopQuery.matches;
desktopQuery.addEventListener("change", event => {
  if (event.matches !== wasDesktop) {
    wasDesktop = event.matches;
    location.reload();
  }
});
