/* ============================================================
   Twinstudio — 轻量中英切换
   放置位置：js/i18n.js
   ============================================================ */

   const dict = {

    /* ========== ENGLISH ========== */
    en: {
      /* --- 导航 --- */
      'nav.story': 'STORY',
      'nav.lookbook': 'LOOKBOOK',
      'nav.collection': 'COLLECTION',
      'nav.shop': 'SHOP',
  
      /* --- 无障碍 / aria --- */
      'a11y.skip': 'Skip to content',
      'a11y.home': 'Twinstudio home',
      'a11y.back': 'Back to Collection',
      'a11y.menu': 'Menu',
      'a11y.lang': 'Switch language',
      'a11y.charPlay': 'Click Milo or the toy to play',
      'a11y.philosophySection': 'Our philosophy',
      'a11y.charSection': 'Meet Milo and BoBo',
      'a11y.lookbookSection': 'Lookbook',
      'a11y.lookbookSwipe': 'Swipe horizontally to explore the lookbook',
      'a11y.stores': 'Online stores',
      'a11y.taobao': 'Visit Twinstudio on Taobao',
      'a11y.etsy': 'Visit Twinstudio on Etsy',
      'a11y.ins': 'Twinstudio Instagram stories',
      'a11y.shopNow': 'Shop now',
      'a11y.ourStory': 'Our story',
  
      /* --- 首页 --- */
      'home.hint': 'scroll',
      'home.clickToy': 'CLICK THE TOY',
      'cta.ourStory': 'OUR STORY <span aria-hidden="true">→</span>',
  
      /* --- Collection --- */
      'cta.shopNow': 'SHOP NOW <span aria-hidden="true">→</span>',
  
      /* --- Shop --- */
      'shop.kicker': 'TWINSTUDIO ONLINE STORES',
      'shop.title': 'CHOOSE<br>YOUR SHOP',
      'shop.intro': 'Choose your preferred store to explore the latest Twinstudio collection.',
      'shop.taobaoMeta': 'CHINA STORE',
      'shop.etsyMeta': 'GLOBAL STORE',
      'shop.comingSoon': 'COMING SOON <span aria-hidden="true">→</span>',
      'shop.visitStore': 'VISIT STORE <span aria-hidden="true">→</span>',
  
      /* --- Detail --- */
      'detail.loadMore': 'LOAD MORE',
      'detail.noMore': 'NO MORE ITEMS',
      'detail.allItems': 'ALL ITEMS',
      'detail.cornerLabel': 'collection',
  
      /* --- Collection 卡片 --- */
      'cta.explore': 'EXPLORE',
  
      /* --- Story --- */
      'story.p1': 'In everyday life, we are always searching for small forms of protection.',
      'story.p2': 'A pet&rsquo;s gaze, a gentle lean by our side &mdash; these moments speak louder than words. They are like hidden amulets in our daily routines, quietly passing us luck, softness, and healing.',
      'story.p3': 'Twinstudio is a design brand that transforms this energy of pets into a shared lifestyle.',
      'story.p4': 'Through design, we capture these tender moments, giving shape to companionship, warmth, and healing&mdash;turning everyday objects into rituals of connection. Here, products are more than objects; they are vessels of emotion and symbols of the bond between pets and people.',
      'story.c1t': 'MADE TO SHARE',
      'story.c1p': 'From our home to yours, we hope our pieces become part of your everyday moments.',
      'story.c2t': 'INSPIRED BY LIFE',
      'story.c2p': 'Our products are inspired by our dogs and the little things that make them, and us, so happy.',
      'story.c3t': 'THOUGHTFUL BY DESIGN',
      'story.c3p': 'We care about the details, the materials, and the experience - because they deserve the best.',
  
      /* --- Footer（移动端 / 全大写） --- */
      'footer.tagline': 'For the moments we share.<br>Together we play,<br>together we heal.',
      'footer.shopCaps': 'SHOP',
      'footer.infoCaps': 'INFO',
      'footer.connectCaps': 'CONNECT',
      /* --- Footer（桌面端 / 首字母大写） --- */
      'footer.shop': 'Shop',
      'footer.info': 'Info',
      'footer.connect': 'Connect',
      /* --- Footer 链接 --- */
      'footer.taobao': 'Taobao',
      'footer.etsy': 'Etsy',
      'footer.story': 'Story',
      'footer.lookbook': 'Lookbook',
      'footer.collection': 'Collection',
      'footer.faq': 'FAQ',
      'footer.contact': 'Contact Us',
      'footer.instagram': 'Instagram',
      'footer.redbook': 'RedBook',
      'footer.tiktok': 'Tiktok',
      'footer.copy': '@ 2026, Twinstudio',
  
      /* --- Pending 页 --- */
      'pending.title': 'Mobile Lookbook is ready for design.',
      'pending.body': 'The Home, Collection, Detail and Story pages are available now.',
      'pending.back': 'Return home',
  
      /* --- 图片 alt --- */
      'alt.philosophy': "Some moments don't need to be bigger. They only need to be shared.",
      'alt.miloTitle': 'Meet Milo — Chief Curiosity Officer',
      'alt.miloPara': 'The kind of friend who finds joy in absolutely everything.',
      'alt.boboTitle': 'Meet BoBo — Professional Napper',
      'alt.boboPara': "Firm believer that life is better lying down — and somehow, he's always right.",
      'alt.explore': 'Explore more collection series',
      'alt.collectionTitle': 'Collection',
      'alt.collectionSlogan': '(Pet-human goods) Thoughtfully designed. Objects for moments we shared.',
      'alt.storyTitle': 'Our Story',
      'alt.storySlogan': 'For moments we share. Together we play, together we heal.',
  
      /* --- 分类名（供 collection.js 使用） --- */
      'cat.accessory': 'Accessory',
      'cat.art': 'Art',
      'cat.home': 'Home',
      'cat.handcraft': 'Handcraft',
      'cat.apparel': 'Apparel',
      'cat.doggoods': 'Dog Goods',
    },
  
    /* ========== 中文 ========== */
    zh: {
      /* --- 导航 --- */
      'nav.story': '故事',
      'nav.lookbook': '影集',
      'nav.collection': '系列',
      'nav.shop': '商店',
  
      /* --- 无障碍 / aria --- */
      'a11y.skip': '跳到主要内容',
      'a11y.home': 'Twinstudio 首页',
      'a11y.back': '返回系列',
      'a11y.menu': '菜单',
      'a11y.lang': '切换语言',
      'a11y.charPlay': '点击 Milo 或玩具开始互动',
      'a11y.philosophySection': '品牌理念',
      'a11y.charSection': '认识 Milo 和 BoBo',
      'a11y.lookbookSection': '影集',
      'a11y.lookbookSwipe': '左右滑动浏览影集',
      'a11y.stores': '线上商店',
      'a11y.taobao': '前往 Twinstudio 淘宝店',
      'a11y.etsy': '前往 Twinstudio Etsy 店',
      'a11y.ins': 'Twinstudio Instagram 动态',
      'a11y.shopNow': '立即选购',
      'a11y.ourStory': '我们的故事',
  
      /* --- 首页 --- */
      'home.hint': '向下滚动',
      'home.clickToy': '点击玩具',
      'cta.ourStory': '我们的故事 <span aria-hidden="true">→</span>',
  
      /* --- Collection --- */
      'cta.shopNow': '立即选购 <span aria-hidden="true">→</span>',
  
      /* --- Shop --- */
      'shop.kicker': 'TWINSTUDIO 线上商店',
      'shop.title': '选择<br>店铺',
      'shop.intro': '探索 Twinstudio 最新系列。',
      'shop.taobaoMeta': '中国大陆',
      'shop.etsyMeta': '海外发货',
      'shop.comingSoon': '前往淘宝搜索店铺“twinstudio" <span aria-hidden="true">→</span>',
      'shop.visitStore': '前往etsy商店 <span aria-hidden="true">→</span>',
  
      /* --- Detail --- */
      'detail.loadMore': '加载更多',
      'detail.noMore': '没有更多了',
      'detail.allItems': '全部商品',
      'detail.cornerLabel': '系列',
  
      /* --- Collection 卡片 --- */
      'cta.explore': '查看更多',
  
      /* --- 分类描述 ---
         下面这些对应 products-data.js 里每个分类的 blurb。
         没填的会自动保留英文原文，不会报错。 */
      'cat.accessory.blurb': '充满温度和古树的小物件，让生活充满惊喜。',
      'cat.art.blurb': '挂画与定制画作，定格温暖有趣的瞬间。',
      'cat.home.blurb': '属于毛孩儿和铲屎官的毛绒绒家居',
      'cat.handcraft.blurb': '纯手工制作的工艺品，让每一天都充满温暖和惊喜。',
      'cat.apparel.blurb': '生活态度也可以穿在身上。',
      'cat.doggoods.blurb': '用心为毛孩儿打造的产品',
  
      /* --- 商品角标（badge）---
         键名是小写的 tag 值。没匹配到的保留原文。 */
      'tag.new': '新品',
      'tag.hot': '热卖',
      'tag.sale': '特价',
      'tag.limited': '限量',
      'tag.restock': '补货',
      'tag.sold out': '售罄',
      'tag.soldout': '售罄',
  
      /* --- Story --- */
      'story.p1': '在日常生活里，我们总在寻找一些细小的庇护。',
      'story.p2': '宠物的一个眼神，一次轻轻的依偎——这些瞬间胜过千言万语。它们像藏在日常里的护身符，悄悄递来好运、柔软与治愈。',
      'story.p3': 'Twinstudio 是一个将这份来自宠物的能量，转化为人宠共享生活方式的设计品牌。',
      'story.p4': '我们用设计留住那些温柔的瞬间，为陪伴、温暖与治愈赋予形状，让日常物件成为彼此连接的仪式。在这里，产品不只是物件，更是情感的容器，是人与宠物之间羁绊的象征。',
      'story.c1t': '为分享而生',
      'story.c1p': '从我们的家到你的家，愿这些物件成为你日常的一部分。',
      'story.c2t': '灵感来自生活',
      'story.c2p': '我们的产品灵感来自两只狗狗，以及那些让它们和我们都快乐的小事。',
      'story.c3t': '用心设计',
      'story.c3p': '我们在意细节、材质与体验——因为它们值得最好的。',
  
      /* --- Footer --- */
      'footer.tagline': '致我们共享的每一刻。<br>一起玩，<br>一起被治愈。',
      'footer.shopCaps': '店铺',
      'footer.infoCaps': '关于',
      'footer.connectCaps': '联系',
      'footer.shop': '店铺',
      'footer.info': '关于',
      'footer.connect': '联系',
      'footer.taobao': '淘宝',
      'footer.etsy': 'Etsy',
      'footer.story': '品牌故事',
      'footer.lookbook': '精品合集',
      'footer.collection': '系列产品',
      'footer.faq': '常见问题',
      'footer.contact': '联系我们',
      'footer.instagram': 'Instagram',
      'footer.redbook': '小红书',
      'footer.tiktok': 'Tiktok',
      'footer.copy': '@ 2026, Twinstudio',
  
      /* --- Pending 页 --- */
      'pending.title': '移动端影集页面正在设计中。',
      'pending.body': '首页、系列、详情与故事页面现已上线。',
      'pending.back': '返回首页',
  
      /* --- 图片 alt --- */
      'alt.philosophy': '有些瞬间不必更盛大，只需要被分享。',
      'alt.miloTitle': '认识 Milo —— 首席好奇官',
      'alt.miloPara': '那种能在任何小事里找到快乐的朋友。',
      'alt.boboTitle': '认识 BoBo —— 专业躺平选手',
      'alt.boboPara': '他坚信躺着的人生更美好——而且总是他对。',
      'alt.explore': '探索更多系列',
      'alt.collectionTitle': '系列',
      'alt.collectionSlogan': '（人宠共享好物）用心设计，为我们共享的时刻而生。',
      'alt.storyTitle': '我们的故事',
      'alt.storySlogan': '致我们共享的每一刻。一起玩，一起被治愈。',
  
      /* --- 分类名 --- */
      'cat.accessory': '配饰',
      'cat.art': '艺术',
      'cat.home': '家居',
      'cat.handcraft': '手作',
      'cat.apparel': '服饰',
      'cat.doggoods': '宠物用品',
  
      /* ------------------------------------------------------------
         中文版图片资源（做好中文手写 SVG 后，取消注释并填路径即可）
         键名与 HTML 里的 data-i18n-src / data-i18n-srcset 对应。
         不填 = 保持英文原图，不会报错。
         ------------------------------------------------------------
      'img.philosophyDesktop':   '/assets/desktop/philosophy2-zh.jpg',
      'img.philosophyMobile':    '/assets/mobile/mobile-home-slogan-zh.png',
      'img.miloTitle':           '/assets/shared/home/character/text_milo_title_zh.svg',
      'img.miloPara':            '/assets/shared/home/character/text_milo_para_zh.svg',
      'img.boboTitle':           '/assets/shared/home/character/text_bobo_title_zh.svg',
      'img.boboPara':            '/assets/shared/home/character/text_bobo_para_zh.svg',
      'img.collectionTitleD':    '/assets/desktop/collection-title-zh.svg',
      'img.collectionTitleM':    '/assets/mobile/title-base-zh.png',
      'img.collectionSloganD':   '/assets/desktop/collection-slogan-zh.svg',
      'img.collectionSloganM':   '/assets/mobile/slogan-text-zh.png',
      'img.storyTitleD':         '/assets/desktop/story-title-zh.svg',
      'img.storyTitleM':         '/assets/mobile/mobile-story-title-zh.svg',
      'img.storySloganD':        '/assets/desktop/story-slogan-zh.svg',
      'img.storySloganM':        '/assets/mobile/mobile-story-slogan-zh.svg',
      'img.explore':             '/assets/shared/lookbook/explore-zh.svg',
      */
    },
  };
  
  const LANGS = ['en', 'zh'];
  const STORAGE_KEY = 'ts-lang';
  
  /* ---------- 读取当前语言 ---------- */
  export function getLang() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* 隐私模式 */ }
    if (LANGS.includes(saved)) return saved;
    return (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }
  
  /* ---------- 取单条文案（供 JS 渲染用，缺失时回退英文） ---------- */
  export function t(key, lang = getLang()) {
    return (dict[lang] && dict[lang][key]) || (dict.en && dict.en[key]) || '';
  }
  
  /* ---------- 严格取中文，没有就返回空字符串（不回退英文） ----------
     动态内容用这个：拿不到中文时保留数据里的原始英文，而不是显示别的东西。 */
  export function tz(key) {
    return (dict.zh && dict.zh[key]) || '';
  }
  
  /* ---------- 设置语言 ---------- */
  export function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* 忽略 */ }
    applyLang(lang);
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }
  
  /* ---------- 内部：媒体资源替换（可回退） ---------- */
  function swapMedia(el, attr, key, lang) {
    const memo = 'i18nOrig' + attr.replace(/[^a-z]/gi, '');
    if (el.dataset[memo] === undefined) {
      el.dataset[memo] = el.getAttribute(attr) || '';
    }
    const val = dict[lang] && dict[lang][key];
    el.setAttribute(attr, val || el.dataset[memo]);
  }
  
  /* ---------- 应用语言到整个 DOM ---------- */
  export function applyLang(lang = getLang()) {
    const table = dict[lang] || dict.en;
  
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.lang = lang;
  
    /* 纯文本 */
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = table[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
  
    /* 含 <br> / <span> 的富文本 */
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const v = table[el.dataset.i18nHtml];
      if (v !== undefined) el.innerHTML = v;
    });
  
    /* 属性：aria-label、alt、title 等；多个用 ; 分隔 */
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const idx = pair.indexOf(':');
        if (idx < 0) return;
        const attr = pair.slice(0, idx).trim();
        const key = pair.slice(idx + 1).trim();
        const v = table[key];
        if (v !== undefined) el.setAttribute(attr, v);
      });
    });
  
    /* 图片资源：<img data-i18n-src> */
    document.querySelectorAll('[data-i18n-src]').forEach((el) => {
      swapMedia(el, 'src', el.dataset.i18nSrc, lang);
    });
  
    /* 图片资源：<source data-i18n-srcset> */
    document.querySelectorAll('[data-i18n-srcset]').forEach((el) => {
      swapMedia(el, 'srcset', el.dataset.i18nSrcset, lang);
    });
  
    /* 切换按钮上显示的是「另一种语言」 */
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = lang === 'zh' ? 'EN' : '中';
      btn.setAttribute('aria-label', table['a11y.lang'] || 'Switch language');
    }
  }
  
  /* ---------- 把按钮贴到汉堡按钮左边 ----------
     header 里 logo 和汉堡是绝对定位的，没法靠 flex 排版，
     所以直接测量汉堡的实际位置，再把按钮 fixed 到它左侧。
     这样任何断点、任何窗口宽度都自动对齐。                     */
  const GAP = 16; // 按钮与汉堡之间的间距，想调远近改这个数字
  
  function positionToggle() {
    const btn = document.getElementById('lang-toggle');
    const anchor = document.getElementById('site-burger');
    if (!btn || !anchor) return;
  
    const r = anchor.getBoundingClientRect();
    if (!r.width || !r.height) return; // 汉堡被隐藏时不动
  
    const vw = document.documentElement.clientWidth;
    btn.style.top = (r.top + r.height / 2) + 'px';
    btn.style.right = Math.max(8, vw - r.left + GAP) + 'px';
    btn.setAttribute('data-placed', '');
  }
  
  let rafId = null;
  function schedulePosition() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      positionToggle();
    });
  }
  
  /* ---------- 初始化（挂按钮 + 首次应用） ---------- */
  export function initI18n() {
    applyLang();
  
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
  
    if (!btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLang(getLang() === 'zh' ? 'en' : 'zh');
      });
  
      window.addEventListener('resize', schedulePosition, { passive: true });
      window.addEventListener('scroll', schedulePosition, { passive: true });
      window.addEventListener('orientationchange', schedulePosition);
      window.addEventListener('hashchange', schedulePosition);
    }
  
    /* 立刻定位一次，再在字体 / 布局稳定后各补一次 */
    positionToggle();
    requestAnimationFrame(positionToggle);
    setTimeout(positionToggle, 300);
    setTimeout(positionToggle, 1200);
  
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(positionToggle).catch(() => {});
    }
  
    /* 汉堡尺寸/位置变化时自动跟随（比如断点切换） */
    const anchor = document.getElementById('site-burger');
    if (anchor && typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(schedulePosition).observe(anchor);
    }
  }