#!/usr/bin/env node

/**
 * Synchronize public/assets/products/* with data/products-data.js.
 *
 * Normal use:
 *   npm run products:update
 *
 * Preview without writing:
 *   npm run products:check
 *
 * Remove data entries whose image files no longer exist:
 *   npm run products:update -- --prune
 *
 * Existing id/name/tag/url values are preserved. New files may be named:
 *   accessory-magnet.png
 *   home-09__NAP TIME__cushion.png
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const PRODUCTS_ROOT = path.join(ROOT, "public", "assets", "products");
const DATA_FILE = path.join(ROOT, "data", "products-data.js");
const SHOULD_WRITE = !process.argv.includes("--check");
const SHOULD_PRUNE = process.argv.includes("--prune");

const CATEGORY_ORDER = [
  "accessory",
  "art",
  "home",
  "handcraft",
  "apparel",
  "doggoods"
];

const DEFAULT_TAGS = {
  accessory: "accessory",
  art: "print",
  home: "home goods",
  handcraft: "handcraft",
  apparel: "apparel",
  doggoods: "pet goods"
};

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"]);
const IGNORED_NAMES = new Set([".DS_Store", "Thumbs.db", "coming_soon.png"]);

const source = fs.readFileSync(DATA_FILE, "utf8");
const moduleUrl = `${pathToFileURL(DATA_FILE).href}?updated=${Date.now()}`;
const { PRODUCTS: existingProducts } = await import(moduleUrl);

function normalizeWebPath(value) {
  return value.replaceAll("\\", "/");
}

function titleFromFilename(filename, category) {
  const stem = path.parse(filename).name;
  const metadata = stem.split("__");

  if (metadata.length >= 2 && metadata[1].trim()) {
    return metadata[1].trim();
  }

  const cleaned = stem
    .replace(new RegExp(`^(?:${category}|product)[-_]?`, "i"), "")
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  return cleaned && !/^\d+$/.test(cleaned) ? cleaned.toUpperCase() : "PRODUCT NAME";
}

function tagFromFilename(filename, category) {
  const metadata = path.parse(filename).name.split("__");
  return metadata.length >= 3 && metadata[2].trim()
    ? metadata[2].trim()
    : DEFAULT_TAGS[category];
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function makeId(category, filename, usedIds) {
  const stem = path.parse(filename).name.split("__")[0];
  const number = stem.match(/(\d+)/)?.[1];
  const base = number
    ? `${category}-${number.padStart(2, "0")}`
    : `${category}-${slugify(stem.replace(new RegExp(`^${category}[-_]?`, "i"), "")) || "item"}`;

  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) id = `${base}-${suffix++}`;
  usedIds.add(id);
  return id;
}

function scanCategory(category, currentItems) {
  const directory = path.join(PRODUCTS_ROOT, category);
  fs.mkdirSync(directory, { recursive: true });

  const currentByImage = new Map(currentItems.map(item => [item.image, item]));
  const usedIds = new Set(currentItems.map(item => item.id));
  const foundImages = [];

  for (const filename of fs.readdirSync(directory).sort((a, b) => a.localeCompare(b, "en", { numeric: true }))) {
    if (IGNORED_NAMES.has(filename) || filename.startsWith(".")) continue;
    if (!IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase())) continue;

    const image = normalizeWebPath(`/assets/products/${category}/${filename}`);
    foundImages.push(image);
  }

  const foundSet = new Set(foundImages);
  const missing = currentItems.filter(item => !foundSet.has(item.image));
  const keptMissing = SHOULD_PRUNE ? [] : missing;

  const synced = foundImages.map(image => {
    const current = currentByImage.get(image);
    if (current) return current;

    const filename = path.basename(image);
    return {
      id: makeId(category, filename, usedIds),
      image,
      name: titleFromFilename(filename, category),
      tag: tagFromFilename(filename, category),
      url: ""
    };
  });

  return {
    items: [...synced, ...keptMissing],
    added: synced.filter(item => !currentByImage.has(item.image)),
    missing
  };
}

function serializeProducts(products) {
  const lines = ["export const PRODUCTS = {"];

  CATEGORY_ORDER.forEach((category, categoryIndex) => {
    const items = products[category];
    lines.push(`  ${category}: [`);
    items.forEach((item, index) => {
      const comma = index === items.length - 1 ? "" : ",";
      lines.push(
        `    { id:${JSON.stringify(item.id)}, image:${JSON.stringify(item.image)}, ` +
        `name:${JSON.stringify(item.name)}, tag:${JSON.stringify(item.tag)}, url:${JSON.stringify(item.url || "")} }${comma}`
      );
    });
    lines.push(`  ]${categoryIndex === CATEGORY_ORDER.length - 1 ? "" : ","}`);
  });

  lines.push("};", "");
  return lines.join("\n");
}

const nextProducts = {};
let totalAdded = 0;
let totalMissing = 0;

for (const category of CATEGORY_ORDER) {
  const result = scanCategory(category, existingProducts[category] || []);
  nextProducts[category] = result.items;
  totalAdded += result.added.length;
  totalMissing += result.missing.length;

  console.log(`${category.padEnd(10)} ${String(result.items.length).padStart(2)} products`);
  result.added.forEach(item => console.log(`  + ${item.image}`));
  result.missing.forEach(item => {
    const action = SHOULD_PRUNE ? "removed from data" : "kept in data; use --prune to remove";
    console.warn(`  ! missing file: ${item.image} (${action})`);
  });
}

const categoriesStart = source.indexOf("export const CATEGORIES");
if (categoriesStart < 0) {
  throw new Error("Could not find `export const CATEGORIES` in data/products-data.js");
}

const nextSource = `${serializeProducts(nextProducts)}${source.slice(categoriesStart)}`;
const changed = nextSource !== source;

if (SHOULD_WRITE && changed) {
  fs.writeFileSync(DATA_FILE, nextSource, "utf8");
  console.log(`\nUpdated ${path.relative(ROOT, DATA_FILE)}.`);
} else if (!SHOULD_WRITE && changed) {
  console.log("\nChanges found. Run `npm run products:update` to write them.");
} else {
  console.log("\nProduct data is already up to date.");
}

console.log(`Added: ${totalAdded}; missing files: ${totalMissing}.`);

if (!SHOULD_WRITE && changed) process.exitCode = 1;
