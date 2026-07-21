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

## Ownership split

Desktop owner:

- `css/desktop.css`
- `js/home-desktop.js`
- `public/assets/desktop/`
- `public/assets/lookbook/`

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
- `public/assets/products/`
- `public/assets/story/`

## Routes

- Home: no hash
- Philosophy: `#philosophy`
- Lookbook: `#lookbook`
- Collection: `#collection`
- Detail: `#detail/art`, `#detail/home`, etc.
- Story: `#story`

Mobile Home, Philosophy and Lookbook intentionally remain explicit placeholders until their approved designs are available.

## Important rules

- Do not edit `legacy/desktop-reference.html`; it is visual reference only.
- Do not restore product collage images as page content.
- Product cards must come from `data/products-data.js` and independent images.
- Story copy and images remain independent semantic elements.
- Production uses normal static assets, not a Base64 single-file build.
