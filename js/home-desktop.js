/* Migrated from the original desktop template. */

/* ================= data ================= */
const ASSETS = {
  bulldog:"/assets/shared/home/hero/bulldog.svg", teddy:"/assets/shared/home/hero/teddy.svg", stretch:"/assets/shared/home/hero/stretch.svg",
  banana:"/assets/shared/home/hero/banana.svg", zebra:"/assets/shared/home/hero/zebra.svg", frenchie:"/assets/shared/home/hero/frenchie.svg",
  bonehead:"/assets/shared/home/hero/bonehead.svg",
  image0:"/assets/shared/home/hero/image0.jpg", image1:"/assets/shared/home/hero/image1.jpg", image2:"/assets/shared/home/hero/image2.jpg",
  logo:"/assets/desktop/logo.svg",
  lb0:"/assets/shared/lookbook/images/lb0.jpg", lb1:"/assets/shared/lookbook/images/lb1.jpg", lb2:"/assets/shared/lookbook/images/lb2.jpg", lb3:"/assets/shared/lookbook/images/lb3.jpg", lb4:"/assets/shared/lookbook/images/lb4.jpg",
  lb5:"/assets/shared/lookbook/images/lb5.jpg", lb6:"/assets/shared/lookbook/images/lb6.jpg", lb7:"/assets/shared/lookbook/images/lb7.jpg", lb8:"/assets/shared/lookbook/images/lb8.jpg", lb9:"/assets/shared/lookbook/images/lb9.jpg", lb10:"/assets/shared/lookbook/images/lb10.jpg",
  mask1:"/assets/shared/lookbook/masks/mask1.svg", mask3:"/assets/shared/lookbook/masks/mask3.svg", mask5:"/assets/shared/lookbook/masks/mask5.svg", mask6:"/assets/shared/lookbook/masks/mask6.svg"
};

/* design-space element table (1440x900) */
const ELEMENTS = [
  {id:'bulldog',  x:248,y:171,w:189,h:163, hover:'shake',  fall:{start:.22,dur:.42,rot:-24,drift:-40}},
  {id:'teddy',    x:550,y:206,w:60, h:110, hover:'swing',  fall:{start:.34,dur:.42,rot: 38,drift: 25}},
  {id:'stretch',  x:676,y:179,w:256,h:126, hover:'shake',  fall:{start:.28,dur:.45,rot: 14,drift: 55}},
  {id:'photo2',   x:992,y:169,w:156,h:156, photo:'image2', fall:{start:.20,dur:.39,rot: 30,drift: 30}},
  {id:'banana',   x:288,y:428,w:113,h:81,  hover:'hop',    fall:{start:.31,dur:.39,rot:-40,drift:-30}},
  {id:'photo1',   x:497,y:392,w:156,h:156, photo:'image1', fall:{start:.36,dur:.39,rot:-22,drift:-20}},
  {id:'zebra',    x:964,y:358,w:239,h:215, hover:'shake',  fall:{start:.21,dur:.42,rot: 18,drift: 60}},
  {id:'frenchie', x:238,y:572,w:188,h:179, hover:'shake',  fall:{start:.39,dur:.39,rot:-14,drift:-45}},
  {id:'bonehead', x:526,y:622,w:121,h:111, hover:'wobble', fall:{start:.25,dur:.36,rot: 45,drift: 20}},
  {id:'photo0',   x:749,y:594,w:156,h:156, photo:'image0', fall:{start:.42,dur:.36,rot: 16,drift: 25}},
];

/* riders: fall from grid, land on the wordmark */
const RIDERS = [
  {id:'dachshund', gx:757, gy:428, gw:109, lx:440, ly:698, lw:130, lh:74, start:.42, dur:.38, arc:60},
  {id:'pig',       gx:1007,gy:666, gw:111, lx:1330,ly:670, lw:105, lh:72, start:.49, dur:.35, arc:120},
];

/* timeline — after the last landing there is a short hold, then the sticky
   stage releases and the whole scene (logo + riders) scrolls up naturally,
   with the philosophy section following from below */
const T = {
  wordRise:[.14,.39],
};

/* ================= build DOM ================= */
const stage = document.getElementById('stage');
const wordLayer = document.getElementById('wordLayer');

for (const e of ELEMENTS){
  const d = document.createElement('div');
  d.className = 'el' + (e.photo ? ' photoEl' : ' hov-' + e.hover);
  d.style.cssText = `left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px;`;
  if (e.photo){
    d.innerHTML = `<div class="idle" style="width:100%;height:100%"><div class="hov photo" style="width:100%;height:100%;position:relative">
      <img src="${ASSETS[e.photo]}" alt=""><div class="tint"></div><div class="dim"></div></div></div>`;
  } else {
    d.innerHTML = `<div class="idle"><div class="hov"><img src="${ASSETS[e.id]}" alt=""></div></div>`;
  }
  d.style.animationDelay = (Math.random()*4)+'s';
  d.querySelector('.idle').style.animationDelay = (Math.random()*-5)+'s';
  stage.appendChild(d);
  e.node = d;
}

/* riders live inside wordLayer (design coords minus layer offset 0,642) */
for (const r of RIDERS){
  const n = document.getElementById('rider-'+r.id);
  n.style.cssText += `left:${r.lx}px;top:${r.ly-642}px;width:${r.lw}px;height:${r.lh}px;`;
  r.node = n;
}

/* header placement moved to js/menu.js (layoutSiteChrome) */

/* hand-drawn marquees: tileW = repeat period in design px (PNG is 2x) */
function buildRoll(id, src, tileW){
  const el = document.getElementById(id);
  if (!el) return;
  const M = Math.ceil(Math.max(innerWidth, 1600) / (tileW*0.7)) + 1;
  let half = '';
  for (let i=0;i<M;i++) half += `<img src="${src}" alt="">`;
  const dur = (tileW*M/70).toFixed(1);   /* ~70 design px / second */
  el.innerHTML = `<div class="roll-track" style="animation-duration:${dur}s">${half}${half}</div>`;
}
buildRoll('marquee',   "/assets/shared/strips/home-story-strip.svg", 1547);
buildRoll('lbMarquee', "/assets/shared/strips/lookbook-strip.svg", 1524);
buildRoll('footRoll',  "/assets/shared/strips/footer-strip.svg", 1732);
buildRoll('collRoll',  "/assets/shared/strips/category-strip.svg", 1464);
buildRoll('storyRoll1',"/assets/shared/strips/home-story-strip.svg", 1547);
buildRoll('storyRoll2',"/assets/shared/strips/home-story-strip.svg", 1547);

/* instagram photo marquee: 6 cards looping horizontally.
   margin-right (not flex gap) keeps the -50% loop seamless. */
{
  const insRoll = document.getElementById('insRoll');
  if (insRoll) {
    const INS = [
      "/assets/shared/story/instagram/story-ins-1.jpg",
      "/assets/shared/story/instagram/story-ins-2.jpg",
      "/assets/shared/story/instagram/story-ins-3.jpg",
      "/assets/shared/story/instagram/story-ins-4.jpg",
      "/assets/shared/story/instagram/story-ins-5.jpg",
      "/assets/shared/story/instagram/story-ins-6.jpg"
    ];
    const half = INS.map(s => `<img src="${s}" alt="">`).join('');
    const period = 6 * 277.2;
    insRoll.innerHTML = `<div class="roll-track" style="animation-duration:${(period/70).toFixed(1)}s">${half}${half}</div>`;
  }
}

/* lookbook grid — design coords 1440 x (137..1092) */
const LB_CELLS = [
  {i:0, x:0,   y:137, w:305, h:305}, {i:1, x:325, y:137, w:305, h:305, mask:'mask1'},
  {i:2, x:650, y:137, w:305, h:305}, {i:9, x:975, y:137, w:467, h:630},
  {i:3, x:0,   y:462, w:305, h:305, mask:'mask3'}, {i:4, x:325, y:462, w:305, h:305},
  {i:5, x:650, y:462, w:305, h:305, mask:'mask5'},
  {i:6, x:0,   y:787, w:305, h:305, mask:'mask6'}, {i:7, x:325, y:787, w:305, h:305},
  {i:8, x:650, y:787, w:305, h:305, explore:true}, {i:10,x:975, y:787, w:467, h:305},
];
const GRID_Y0 = 137, GRID_H = 955;
const lbGrid = document.getElementById('lbGrid');
lbGrid.style.aspectRatio = '1440 / ' + GRID_H;
LB_CELLS.forEach((c, order) => {
  const d = document.createElement('div');
  d.className = 'lb-cell' + (c.explore ? ' lb-explore' : '');
  d.style.cssText = `left:${c.x/1440*100}%;top:${(c.y-GRID_Y0)/GRID_H*100}%;`+
                    `width:${c.w/1440*100}%;height:${c.h/GRID_H*100}%;`+
                    `transition-delay:${(order%3)*90}ms;`;
  if (c.explore){
    d.innerHTML = `<img src="/assets/shared/lookbook/explore.svg" alt="Explore more — collection series">`;
    d.addEventListener('click', () => { location.hash = 'collection'; });
  } else {
    d.innerHTML = `<img class="ph" src="${ASSETS['lb'+c.i]}" alt="">`+
      (c.mask ? `<img class="lb-mask" src="${ASSETS[c.mask]}" alt="">` : '');
  }
  lbGrid.appendChild(d);
});
const lbObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('show'); lbObs.unobserve(e.target); }
}), {threshold:.18});
document.querySelectorAll('.lb-cell').forEach(c => lbObs.observe(c));

/* OUR STORY button → story page */
document.getElementById('storyBtn').addEventListener('click', () => {
  location.hash = 'story';
});

/* ================= easing ================= */
const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
const easeOutCubic = t=>1-Math.pow(1-t,3);
const easeInQuad = t=>t*t;
const easeInOutCubic = t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
/* gravity fall with tiny bounce at end (for riders) */
function bounceFall(f){
  if (f < .78) return easeInQuad(f/.78);
  const b = (f-.78)/.22;
  return 1 - .055*Math.sin(Math.PI*b)*(1-b*0.4);
}

/* ================= scroll engine ================= */
let targetP = 0, p = -1;
const zone = document.getElementById('scrollzone');
const hint = document.getElementById('hint');
const philosophy = document.getElementById('philosophy');

/* responsive scales, recomputed on resize:
   sW — wordmark layer, fits viewport WIDTH (full bleed, never cropped)
   sG — hero grid / character scene, contain fit (never cropped)          */
let sW = 1, sG = 1, fallEnd = 1100;

function measure(){
  const vw = innerWidth, vh = innerHeight;
  sW = vw/1440;
  sG = Math.min(vw/1440, vh/900);
  stage.style.transform = `translate(-50%,-50%) scale(${sG})`;
  document.getElementById('charStage').style.transform = `translate(-50%,-50%) scale(${sG})`;

  /* riders live in the wordmark layer (scale sW) but must take off from
     their hero-grid spot (scale sG) — convert at runtime */
  const stageL = (vw - 1440*sG)/2, stageT = (vh - 900*sG)/2;
  const layerT = vh - 258*sW;
  /* free-fall must clear the viewport bottom on any aspect ratio */
  fallEnd = (vh - stageT)/sG + 260;
  for (const r of RIDERS){
    const gxV = stageL + (r.gx + r.gw/2)*sG;   /* visual grid position */
    const gyV = stageT + r.gy*sG;
    r.ox = gxV/sW - (r.lx + r.lw/2);           /* start offset in layer px */
    r.oy = (gyV - layerT)/sW - (r.ly - 642);   /* layer origin = design y 642 */
  }

  /* character walk start: keep the designed "peeking" sliver visible at any
     viewport width (stage margin grows on wide screens) */
  const mC = Math.max(0, (vw - 1440*sG)/2);
  for (const c of CHARS){
    if (c.el === 'chMilo') c.dx = -(674.5 + mC/sG);
    if (c.el === 'chBobo') c.dx =   629   + mC/sG;
  }
}
addEventListener('resize', () => { measure(); if (p>=0) render(p); });
/* first measure() runs after CHARS is defined below */

let lastY = 0, scrollDir = 1;   /* 1 = down, -1 = up */

function onScroll(){
  const max = zone.offsetHeight - innerHeight;
  targetP = clamp(scrollY / max, 0, 1);
  scrollDir = scrollY >= lastY ? 1 : -1;
  lastY = scrollY;
  /* philosophy reveal */
  const r = philosophy.getBoundingClientRect();
  if (r.top < innerHeight*.72) philosophy.classList.add('inview');
}
addEventListener('scroll', onScroll, {passive:true});
onScroll();

function seg(pv,[a,b]){ return clamp((pv-a)/(b-a),0,1); }

function render(pv){
  /* hint */
  hint.style.opacity = pv > .02 ? 0 : '';

  /* wordmark rises from below, then simply stays put — the transition to
     the philosophy section is the natural scroll of the released stage */
  const rise = easeOutCubic(seg(pv,T.wordRise));
  const riseY = (1-rise)*300*sW;
  wordLayer.style.transform = `translateY(${riseY}px) scale(${sW})`;
  /* hands sway / paws knead once the wordmark has settled */
  wordLayer.classList.toggle('alive', rise >= .99);

  /* free elements */
  for (const e of ELEMENTS){
    const f = clamp((pv - e.fall.start)/e.fall.dur, 0, 1);
    if (f<=0){ e.node.style.transform=''; e.node.style.opacity=''; continue; }
    const g = easeInQuad(f);
    const dy = g * (fallEnd - e.y);       /* fall past the viewport bottom */
    const dx = easeOutCubic(f) * e.fall.drift;
    const rot = f * e.fall.rot;
    e.node.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
    if (e.photo === undefined) e.node.style.opacity = '';
  }

  /* riders */
  for (const r of RIDERS){
    const f = clamp((pv - r.start)/r.dur, 0, 1);
    const n = r.node;
    /* start offset computed in measure() (grid and wordmark layers scale
       independently now) */
    const ox = r.ox, oy = r.oy;
    if (f>=1){ n.classList.add('landed'); } else { n.classList.remove('landed'); }
    const fy = bounceFall(f);
    const fx = easeOutCubic(f);
    const arcY = -r.arc*Math.sin(Math.PI*clamp(f,0,1))* (r.arc?1:0) * (1-f*0.55);
    const x = ox*(1-fx);
    /* compensate the parent layer's rise translate so riders stay glued
       to the hero grid before/while falling */
    const y = oy*(1-fy) + (f<1 ? arcY*0.35 : 0) - (f<1 ? riseY/sW : 0);
    const rot = (1-f)*(r.id==='pig'?18:-26);
    n.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
  }
}

/* ---------- character walk-in ---------- */
const smooth = t => t*t*(3-2*t);
const CHARS = [
  {el:'chMilo',  dx:-674.5, dy:0,   a:.04, b:.72, walk:true},
  {el:'chBobo',  dx: 629,   dy:0,   a:.12, b:.78, walk:true},
  {el:'chPig',   dx: 198,   dy:0,   a:.45, b:.85},
  {el:'chTeddy', dx: 268,   dy:-40, a:.50, b:.88},
  {el:'chTMilo', dx: 260,   dy:0,   a:.15, b:.75},
  {el:'chTBobo', dx:-199,   dy:0,   a:.20, b:.80},
];
for (const c of CHARS) c.node = document.getElementById(c.el);
const paraMilo = document.getElementById('chPMilo');
const paraBobo = document.getElementById('chPBobo');

function renderChar(qv){
  for (const c of CHARS){
    const f = smooth(seg(qv, [c.a, c.b]));
    c.node.style.transform = `translate(${c.dx*(1-f)}px,${c.dy*(1-f)}px)`;
    if (c.walk){
      const moving = f > .001 && f < .999;
      c.node.classList.toggle('walking', moving);
      c.node.classList.toggle('settled', f >= .999);
    }
  }
  const showPara = qv > .82;
  paraMilo.style.opacity = showPara ? 1 : 0;
  paraBobo.style.opacity = showPara ? 1 : 0;
}
measure();       /* initial layout (needs CHARS + RIDERS defined) */
renderChar(0);   /* dogs wait outside the frame */

/* walk-in plays ONCE, time-driven, when the section first scrolls into view
   from above; arriving from below just shows the settled scene */
let charPlayed = false, charAnim = null;
function playCharacter(){
  charPlayed = true;
  const DUR = 2600, t0 = performance.now();
  (function step(now){
    const t = clamp((now - t0)/DUR, 0, 1);
    renderChar(t);
    if (t < 1) charAnim = requestAnimationFrame(step);
  })(t0);
}
const charObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || charPlayed) return;
  charObs.unobserve(e.target);
  if (scrollDir === 1) playCharacter();       /* came from the top: walk in */
  else { charPlayed = true; renderChar(1); }  /* came from below: already home */
}), {threshold:.45});
charObs.observe(document.getElementById('charZone'));

function loop(){
  if (Math.abs(targetP - p) > .0004){
    p = p<0 ? targetP : p + (targetP-p)*.14;
    render(p);
  }
  requestAnimationFrame(loop);
}
loop();
