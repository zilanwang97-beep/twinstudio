import fs from 'node:fs';
import path from 'node:path';

const desktopRoot = '/Users/zilanwang/twinstudio branding_desktop';
const mobileRoot = '/Users/zilanwang/twinstudio branding_mobile';
const targetRoot = path.resolve(import.meta.dirname, '..');

const desktopTemplate = fs.readFileSync(path.join(desktopRoot, 'template.html'), 'utf8');
const mobileHtml = fs.readFileSync(path.join(mobileRoot, 'index.html'), 'utf8');
const mobileCss = fs.readFileSync(path.join(mobileRoot, 'styles.css'), 'utf8');

function between(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  if (from < 0 || to < 0) throw new Error(`Missing marker: ${start} / ${end}`);
  return source.slice(from + start.length, to);
}

function assetPath(token) {
  const assetDir = path.join(desktopRoot, 'assets');
  const match = fs.readdirSync(assetDir).find(file => path.parse(file).name === token);
  if (!match) throw new Error(`Missing desktop asset for @@${token}@@`);
  return `/assets/desktop/${match}`;
}

function replaceDesktopTokens(source) {
  return source.replace(/@@(\w+)@@/g, (_, token) => assetPath(token));
}

const desktopCss = replaceDesktopTokens(between(desktopTemplate, '<style>', '</style>'));
const desktopBodyStart = desktopTemplate.indexOf('<div id="menuPanel">');
const desktopBodyEnd = desktopTemplate.indexOf('<!-- ================= collection page');
const desktopHomeBody = replaceDesktopTokens(desktopTemplate.slice(desktopBodyStart, desktopBodyEnd));
const desktopFooter = replaceDesktopTokens(between(desktopTemplate, '<!-- ================= footer ================= -->', '<script>'));

let desktopScript = replaceDesktopTokens(between(desktopTemplate, '<script>', '</script>'));

// The merged app owns routing and shared inner pages. Keep only the desktop
// homepage, lookbook, menu, marquee and animation code from the original.
const footerCloneAt = desktopScript.indexOf('/* sub-pages reuse the footer');
const lookbookAt = desktopScript.indexOf('/* lookbook grid');
desktopScript = desktopScript.slice(0, footerCloneAt) + desktopScript.slice(lookbookAt);

const routingAt = desktopScript.indexOf('/* sub-page routing');
const easingAt = desktopScript.indexOf('/* ================= easing');
desktopScript = desktopScript.slice(0, routingAt) + desktopScript.slice(easingAt);

desktopScript = desktopScript.replace(
  /hLogo\.addEventListener\('click',[\s\S]*?\n\}\);/,
  `hLogo.addEventListener('click', () => {\n  history.pushState('', '', location.pathname);\n  dispatchEvent(new HashChangeEvent('hashchange'));\n  window.scrollTo({top:0, behavior:'smooth'});\n});`
);

desktopScript = desktopScript.replace(
  "  const el = document.getElementById(id);",
  "  const el = document.getElementById(id);\n  if (!el) return;"
);

desktopScript = desktopScript.replace(
  /\{\n  const INS = \[[\s\S]*?\n\}/,
  `{
  const insRoll = document.getElementById('insRoll');
  if (insRoll) {
    const INS = ["/assets/mobile/story-ins-1.png","/assets/mobile/story-ins-2.png","/assets/mobile/story-ins-3.png","/assets/mobile/story-ins-4.png","/assets/mobile/story-ins-5.png","/assets/mobile/story-ins-6.png"];
    const half = INS.map(s => \`<img src="\${s}" alt="">\`).join('');
    const period = 6 * 277.2;
    insRoll.innerHTML = \`<div class="roll-track" style="animation-duration:\${(period/70).toFixed(1)}s">\${half}\${half}</div>\`;
  }
}`
);

desktopScript = `/* Migrated from the original desktop template. */\n${desktopScript}`;

const mobileAppBody = between(mobileHtml, '<div class="app-frame" id="app-frame">', '</div>\n\n<script src="products-data.js">');
const normalizedMobileBody = mobileAppBody
  .replaceAll('src="images/', 'src="/assets/mobile/')
  .replace('id="detail-hero-img" src=""', 'id="detail-hero-img"')
  .replace(/story-ins-(\d)\.jpg" alt="Instagram story" onerror="[^"]+"/g, 'story-ins-$1.png" alt="Instagram story" loading="lazy"')
  .replaceAll("url('images/", "url('/assets/mobile/")
  .replaceAll('href="#" id="menu-link-story"', 'href="#story" id="menu-link-story"')
  .replaceAll('href="#" id="menu-link-collection"', 'href="#collection" id="menu-link-collection"')
  .replace('<a href="#" onclick="return false">LOOKBOOK</a>', '<a href="#lookbook">LOOKBOOK</a>');

const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#4c2b08">
  <meta name="description" content="Twinstudio — playful objects, thoughtful design.">
  <title>Twinstudio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/base.css">
  <link rel="stylesheet" href="/css/mobile.css">
  <link rel="stylesheet" href="/css/desktop.css">
  <link rel="stylesheet" href="/css/motion.css">
</head>
<body>
  <a class="skip-link" href="#collection">Skip to content</a>
  <div id="desktop-shell">
${desktopHomeBody}
    <div id="desktop-footer">${desktopFooter}</div>
  </div>

  <main class="app-frame" id="app-frame">
    <section id="view-mobile-home" class="view pending-view" aria-labelledby="mobile-home-title">
      <h1 id="mobile-home-title">Twinstudio mobile home is ready for design.</h1>
      <p>The shared Collection, Detail and Story pages are available now.</p>
      <a href="#collection">Open Collection</a>
    </section>
${normalizedMobileBody}
  </main>

  <script type="module" src="/js/app.js"></script>
</body>
</html>
`;

const normalizedMobileCss = mobileCss
  .replaceAll("url('fonts/", "url('/fonts/")
  .replaceAll("url('images/", "url('/assets/mobile/")
  .replace(/@media \(min-width:641px\)\{[\s\S]*?\n\}/, '');

fs.writeFileSync(path.join(targetRoot, 'index.html'), indexHtml);
fs.writeFileSync(path.join(targetRoot, 'css', 'desktop-source.css'), desktopCss);
fs.writeFileSync(path.join(targetRoot, 'css', 'mobile-source.css'), normalizedMobileCss);
fs.writeFileSync(path.join(targetRoot, 'js', 'home-desktop.js'), desktopScript);

console.log('Migrated source HTML, CSS and desktop animation without modifying originals.');
