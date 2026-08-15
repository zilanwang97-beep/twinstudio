import { CATEGORIES, PRODUCTS } from "/data/products-data.js";
import { navigate } from "./router.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function initCollection() {
  const sections = $("#sections");
  const detailTabs = $("#detail-tabs");

  sections.innerHTML = CATEGORIES.map(category => `
    <article class="section-card" id="section-${category.id}">
      <a
        class="section-visual"
        href="#detail/${category.id}"
        data-category="${category.id}"
        aria-label="Explore ${category.label} collection"
      >
        <img src="${category.hero}" alt="${category.label}" loading="lazy">
        <div class="section-slogan marker">${category.slogan}</div>
      </a>
      <div class="section-panel">
        <h2 class="section-caption futura">${category.label}</h2>
        <p class="section-desc">${category.blurb || ""}</p>
        <button class="explore-btn" type="button" data-category="${category.id}">
          EXPLORE <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>
    </article>
  `).join("");

  detailTabs.innerHTML = CATEGORIES.map(category => `
    <button class="tab-btn" type="button" data-category="${category.id}">${category.label}</button>
  `).join("");

  document.addEventListener("click", event => {
    const categoryControl = event.target.closest("[data-category]");
    if (categoryControl) navigate("detail", categoryControl.dataset.category);

    if (event.target.closest("#load-more-btn")) {
      $$("#product-grid .hidden-item").forEach(card => card.classList.remove("hidden-item"));
      const button = $("#load-more-btn");
      button.disabled = true;
      $(".label", button).textContent = "NO MORE ITEMS";
    }
  });
}

export function renderDetail(categoryId) {
  const category = CATEGORIES.find(item => item.id === categoryId) ?? CATEGORIES[0];
  const products = category.products;

  $("#detail-slogan-text").textContent = category.slogan;
  $("#detail-hero-img").src = category.hero;
  $("#detail-hero-img").alt = category.label;
  $("#detail-caption-left").textContent = category.label;

  $$("#detail-tabs .tab-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category.id);
  });

  $("#product-grid").innerHTML = products.map((product, index) => `
    <article class="product-card ${index >= 8 ? "hidden-item" : ""}">
      <span class="badge">${product.tag}</span>
      <div class="thumb">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-meta">
        <h3 class="pname">${product.name}</h3>
      </div>
    </article>
  `).join("");

  const loadMore = $("#load-more-btn");
  loadMore.disabled = products.length <= 8;
  $(".label", loadMore).textContent = products.length <= 8 ? "ALL ITEMS" : "LOAD MORE";
}

export function updateDetailScrim() {
  const detail = $("#view-detail");
  if (!detail.classList.contains("active")) return;
  const image = $("#detail-image-wrap");
  const slogan = $("#detail-slogan");
  const hero = $("#detail-hero");
  const imageTop = image.getBoundingClientRect().top;
  const sloganRect = slogan.getBoundingClientRect();
  const overlap = sloganRect.bottom - imageTop;

  if (matchMedia("(max-width: 820.98px)").matches) {
    const fadeDistance = Math.min(160, Math.max(96, sloganRect.height * 0.45));
    const progress = Math.min(1, Math.max(0, overlap / fadeDistance));
    hero.classList.remove("overlapped");
    image.style.setProperty("--detail-scrim-opacity", (progress * 0.45).toFixed(3));
    return;
  }

  image.style.removeProperty("--detail-scrim-opacity");
  hero.classList.toggle("overlapped", overlap > 0);
}
