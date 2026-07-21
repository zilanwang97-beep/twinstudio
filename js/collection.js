import { CATEGORIES, PRODUCTS } from "/data/products-data.js";
import { navigate } from "./router.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function initCollection() {
  const sections = $("#sections");
  const detailTabs = $("#detail-tabs");

  sections.innerHTML = CATEGORIES.map(category => `
    <article class="section-card" id="section-${category.id}">
      <div class="section-visual">
        <img src="${category.hero}" alt="${category.label}" loading="lazy">
        <div class="section-slogan marker">${category.slogan}</div>
      </div>
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

    if (event.target.closest("#detail-back-btn")) navigate("collection");

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
  const products = category.products.length ? category.products : PRODUCTS.art;

  $("#detail-slogan-text").textContent = category.slogan;
  $("#detail-hero-img").src = category.hero;
  $("#detail-hero-img").alt = category.label;
  $("#detail-caption-left").textContent = category.label;

  $$("#detail-tabs .tab-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category.id);
  });

  $("#product-grid").innerHTML = products.map((product, index) => `
    <article class="product-card ${index >= 4 ? "hidden-item" : ""}">
      <span class="badge">${category.label}</span>
      <a class="thumb" href="${product.url || "#"}" ${product.url ? "" : "aria-disabled=\"true\""}>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-meta">
        <h3 class="pname">${product.name}</h3>
        <p class="ptag">${product.tag}</p>
      </div>
    </article>
  `).join("");

  const loadMore = $("#load-more-btn");
  loadMore.disabled = products.length <= 4;
  $(".label", loadMore).textContent = products.length <= 4 ? "ALL ITEMS" : "LOAD MORE";
}

export function updateDetailScrim() {
  const detail = $("#view-detail");
  if (!detail.classList.contains("active")) return;
  const imageTop = $("#detail-image-wrap").getBoundingClientRect().top;
  const sloganBottom = $("#detail-slogan").getBoundingClientRect().bottom;
  $("#detail-hero").classList.toggle("overlapped", imageTop < sloganBottom);
}
