# Twinstudio merged site

This project merges the existing desktop and mobile sites without modifying either source folder.

## Source folders (read-only references)

- `/Users/zilanwang/twinstudio branding_desktop/`
- `/Users/zilanwang/twinstudio branding_mobile/`

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Add or replace products

Desktop and mobile product cards share `data/products-data.js`.

1. Put each product image in the matching folder under `public/assets/products/`:
   `accessory`, `art`, `home`, `handcraft`, `apparel`, or `doggoods`.
2. Run:

```bash
npm run products:update
```

Existing product names, tags, IDs and shop links are preserved. A new descriptive
filename such as `accessory-magnet.png` becomes `MAGNET`. To provide the product
name and tag in the filename, use:

```text
home-09__NAP TIME__cushion.png
```

After syncing, edit `name`, `tag` or `url` in `data/products-data.js` if needed.
The next sync will preserve those edits.

Useful safety commands:

```bash
# Check whether product data needs updating without changing files
npm run products:check

# Also remove entries whose image files have been deleted
npm run products:update -- --prune
```

`coming_soon.png` and hidden system files are ignored.

## Ownership split

Desktop owner:

- `css/desktop.css`
- `js/home-desktop.js`
- `public/assets/desktop/`

Mobile owner:

- `css/mobile.css`
- `js/home-mobile.js`
- `public/assets/mobile/`

Shared pages and data (coordinate before editing):

- `index.html`
- `js/router.js`
- `js/collection.js`
- `js/story.js`
- `data/products-data.js`
- `public/assets/shared/`
- `public/assets/products/`

## Asset folders

- `public/assets/mobile/`: mobile-only title, slogan and logo artwork
- `public/assets/desktop/`: desktop-only title, slogan, menu panel and layout artwork
- `public/assets/shared/branding/`: branding used by both layouts, including the footer logo
- `public/assets/shared/navigation/`: shared menu controls
- `public/assets/shared/home/`: shared home illustrations and animation pieces
- `public/assets/shared/lookbook/`: shared Lookbook images, masks and Explore artwork
- `public/assets/shared/story/`: shared Story photos, illustrations and animation pieces
- `public/assets/shared/strips/`: shared scrolling-strip artwork
- `public/assets/shared/heroes/`: shared category hero images
- `public/assets/products/`: product-card images used by both layouts

When replacing an asset, keep its filename and folder if possible. If the path
changes, update every reference in `index.html`, `css/`, `js/` and `data/`.

## Routes

- Home: no hash
- Philosophy: `#philosophy`
- Lookbook: `#lookbook`
- Collection: `#collection`
- Detail: `#detail/art`, `#detail/home`, etc.
- Story: `#story`

## Important rules

- Do not edit `legacy/desktop-reference.html`; it is visual reference only.
- Do not restore product collage images as page content.
- Product cards must come from `data/products-data.js` and independent images.
- Story copy and images remain independent semantic elements.
- Production uses normal static assets, not a Base64 single-file build.
