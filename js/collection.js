import { CATEGORIES, PRODUCTS } from "/data/products-data.js";
import { navigate } from "./router.js";
import { t, tz, getLang } from "./i18n.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* ============================================================
   语言辅助
   规则：
   - 分类标题、分类描述、按钮、商品名 → 翻译
   - category.slogan（压在图片上的手写体大标语）→ 永远保留英文原文
   ============================================================ */

const isZh = () => getLang() === "zh";

/* 分类标题：优先数据里的 label_zh，其次字典 cat.<id>，最后回退英文 */
function catLabel(category) {
  if (!isZh()) return category.label;
  return category.label_zh || tz(`cat.${category.id}`) || category.label;
}

/* 分类描述：优先数据里的 blurb_zh，其次字典，最后回退英文 */
function catBlurb(category) {
  const en = category.blurb || "";
  if (!isZh()) return en;
  return category.blurb_zh || tz(`cat.${category.id}.blurb`) || en;
}

/* 商品名：优先 name_zh，回退英文 */
function productName(product) {
  if (!isZh()) return product.name;
  return product.name_zh || product.name;
}

/* 商品角标：按小写 tag 查字典，查不到保留原文 */
function productTag(product) {
  const raw = product.tag || "";
  if (!isZh()) return raw;
  return tz(`tag.${String(raw).toLowerCase().trim()}`) || raw;
}

/* 分类入口的无障碍标签 */
function catAriaLabel(category) {
  const label = catLabel(category);
  return isZh() ? `查看${label}系列` : `Explore ${label} collection`;
}

/* ============================================================
   渲染
   ============================================================ */

let currentCategoryId = null;
let listenersBound = false;

function renderSections() {
  const sections = $("#sections");
  if (!sections) return;

  sections.innerHTML = CATEGORIES.map(category => `
    <article class="section-card" id="section-${category.id}">
      <a
        class="section-visual"
        href="#detail/${category.id}"
        data-category="${category.id}"
        aria-label="${catAriaLabel(category)}"
      >
        <img src="${category.hero}" alt="${catLabel(category)}" loading="lazy">
        <div class="section-slogan marker">${category.slogan}</div>
      </a>
      <div class="section-panel">
        <h2 class="section-caption futura">${catLabel(category)}</h2>
        <p class="section-desc">${catBlurb(category)}</p>
        <button class="explore-btn" type="button" data-category="${category.id}">
          ${t("cta.explore")} <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>
    </article>
  `).join("");
}

function renderTabs() {
  const detailTabs = $("#detail-tabs");
  if (!detailTabs) return;

  detailTabs.innerHTML = CATEGORIES.map(category => `
    <button class="tab-btn" type="button" data-category="${category.id}">${catLabel(category)}</button>
  `).join("");

  /* 重绘后要把当前分类的高亮状态补回来 */
  if (currentCategoryId) {
    $$("#detail-tabs .tab-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.category === currentCategoryId);
    });
  }
}

export function initCollection() {
  renderSections();
  renderTabs();

  if (!listenersBound) {
    listenersBound = true;

    document.addEventListener("click", event => {
      const categoryControl = event.target.closest("[data-category]");
      if (categoryControl) navigate("detail", categoryControl.dataset.category);

      if (event.target.closest("#load-more-btn")) {
        $$("#product-grid .hidden-item").forEach(card => card.classList.remove("hidden-item"));
        const button = $("#load-more-btn");
        button.disabled = true;
        $(".label", button).textContent = t("detail.noMore");
      }
    });

    /* 切换语言后重绘所有动态内容 */
    document.addEventListener("i18n:change", () => {
      renderSections();
      renderTabs();
      if (currentCategoryId) renderDetail(currentCategoryId);
    });
  }
}

export function renderDetail(categoryId) {
  const category = CATEGORIES.find(item => item.id === categoryId) ?? CATEGORIES[0];
  const products = category.products;

  currentCategoryId = category.id;

  /* slogan 是压在图片上的手写体大标语，任何语言下都保留英文原文 */
  $("#detail-slogan-text").textContent = category.slogan;

  $("#detail-hero-img").src = category.hero;
  $("#detail-hero-img").alt = catLabel(category);
  $("#detail-caption-left").textContent = catLabel(category);

  $$("#detail-tabs .tab-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category.id);
  });

  $("#product-grid").innerHTML = products.map((product, index) => `
    <article class="product-card ${index >= 8 ? "hidden-item" : ""}">
      <span class="badge">${productTag(product)}</span>
      <div class="thumb">
        <img src="${product.image}" alt="${productName(product)}" loading="lazy">
      </div>
      <div class="product-meta">
        <h3 class="pname">${productName(product)}</h3>
      </div>
    </article>
  `).join("");

  const loadMore = $("#load-more-btn");
  loadMore.disabled = products.length <= 8;
  $(".label", loadMore).textContent = products.length <= 8
    ? t("detail.allItems")
    : t("detail.loadMore");
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