const MOBILE_QUERY = "(max-width: 820.98px)";

let initialized = false;
let frameRequest = 0;
let characterObserver;
let lookbookFrame = 0;
let lookbookLastTime = 0;
let lookbookPauseUntil = 0;
let lookbookLoopWidth = 0;
let lookbookScroll;
let lookbookMaskTimers = [];

const pauseMobileLookbook = () => {
  lookbookPauseUntil = performance.now() + 2400;
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeInQuad = value => value * value;
const easeOutCubic = value => 1 - Math.pow(1 - value, 3);

function bounceFall(value) {
  if (value < .78) return easeInQuad(value / .78);
  const bounce = (value - .78) / .22;
  return 1 - .065 * Math.sin(Math.PI * bounce) * (1 - bounce * .35);
}

function renderMobileHero() {
  frameRequest = 0;

  const hero = document.querySelector("#mobile-home-hero");
  const wordmark = document.querySelector("#mobile-home-wordmark");
  if (!hero || !wordmark || !matchMedia(MOBILE_QUERY).matches) return;

  const rect = hero.getBoundingClientRect();
  const travel = Math.max(1, hero.offsetHeight - innerHeight);
  const progress = clamp(-rect.top / travel);

  /* The logo rises before the characters land, creating a real surface. */
  const wordmarkProgress = easeOutCubic(clamp((progress - .48) / .27));
  const wordmarkOffset = (1 - wordmarkProgress) * 120;
  wordmark.style.transform = `translateY(${wordmarkOffset}%)`;
  wordmark.classList.toggle("is-alive", wordmarkProgress > .98);

  const wordmarkHeight = wordmark.offsetHeight;
  const wordmarkTop = innerHeight - wordmarkHeight + wordmarkHeight * wordmarkOffset / 100;

  hero.querySelectorAll(".mobile-home-el").forEach(element => {
    const start = Number(element.dataset.fallStart || 0);
    const drift = Number(element.dataset.fallDrift || 0);
    const rotate = Number(element.dataset.fallRotate || 0);
    const rider = element.dataset.rider;
    const landEnd = .78;
    const landingProgress = clamp((progress - start) / Math.max(.01, landEnd - start));
    if (!rider) {
      const duration = Number(element.dataset.fallDuration || .68);
      const freeFallProgress = clamp((progress - start) / duration);
      const distance = innerHeight + element.offsetHeight + 24 - element.offsetTop;
      const x = easeOutCubic(freeFallProgress) * drift;
      const y = easeInQuad(freeFallProgress) * distance;
      element.classList.remove("is-landed");
      element.style.transform =
        `translate(${x}cqw, ${y}px) rotate(${rotate * freeFallProgress}deg)`;
      return;
    }

    const targetTop = rider === "dachshund"
      ? wordmarkTop + wordmarkHeight * -.10
      : wordmarkTop + wordmarkHeight * .56;
    const landing = bounceFall(landingProgress);
    const landingDistance = targetTop - element.offsetTop;
    const x = easeOutCubic(landingProgress) * drift;
    const y = landingDistance * landing;
    const landingRotation = rotate * Math.sin(Math.PI * landingProgress);

    element.classList.toggle(
      "is-landed",
      Boolean(rider) && landingProgress > .94
    );
    element.style.transform =
      `translate(${x}cqw, ${y}px) rotate(${landingRotation}deg)`;
  });
}

function requestMobileHeroRender() {
  if (!frameRequest) frameRequest = requestAnimationFrame(renderMobileHero);
}

function animateMobileLookbook(time) {
  if (!lookbookScroll || !matchMedia(MOBILE_QUERY).matches) return;
  const delta = Math.min(40, time - (lookbookLastTime || time));
  lookbookLastTime = time;

  if (time > lookbookPauseUntil && lookbookLoopWidth > 0) {
    lookbookScroll.scrollLeft += delta * .07;
    if (lookbookScroll.scrollLeft >= lookbookLoopWidth) {
      lookbookScroll.scrollLeft -= lookbookLoopWidth;
    }
  }

  lookbookFrame = requestAnimationFrame(animateMobileLookbook);
}

function scheduleMask(mask) {
  const currentlyHidden = mask.classList.contains("is-hidden");
  const delay = currentlyHidden
    ? 900 + Math.random() * 1700
    : 1800 + Math.random() * 3000;
  const timer = setTimeout(() => {
    mask.classList.toggle("is-hidden");
    scheduleMask(mask);
  }, delay);
  lookbookMaskTimers.push(timer);
}

function initMobileLookbook() {
  lookbookScroll = document.querySelector(".mobile-lookbook-scroll");
  const grid = lookbookScroll?.querySelector(".mobile-lookbook-grid");
  if (!lookbookScroll || !grid) return;

  if (!grid.dataset.loopReady) {
    const originals = [...grid.children];
    originals.forEach(cell => {
      const clone = cell.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      if (clone.matches("a")) clone.tabIndex = -1;
      grid.appendChild(clone);
    });
    grid.dataset.loopReady = "true";
    requestAnimationFrame(() => {
      const firstClone = grid.children[originals.length];
      lookbookLoopWidth = firstClone
        ? firstClone.offsetLeft - grid.children[0].offsetLeft
        : grid.scrollWidth / 2;
    });
  } else {
    lookbookLoopWidth = grid.scrollWidth / 2;
  }

  lookbookScroll.addEventListener("pointerdown", pauseMobileLookbook);
  lookbookScroll.addEventListener("wheel", pauseMobileLookbook, { passive: true });
  lookbookScroll.addEventListener("focusin", pauseMobileLookbook);

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    grid.querySelectorAll(".mobile-lookbook-mask").forEach(scheduleMask);
    lookbookLastTime = 0;
    lookbookFrame = requestAnimationFrame(animateMobileLookbook);
  }
}

export function initMobileHome() {
  if (initialized) return;
  initialized = true;

  addEventListener("scroll", requestMobileHeroRender, { passive: true });
  addEventListener("resize", requestMobileHeroRender);

  const characterScene = document.querySelector("#mobile-character-scene");
  if (characterScene) {
    characterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        characterScene.classList.add("is-visible");
        characterObserver?.unobserve(characterScene);
      });
    }, { threshold: .35 });
    characterObserver.observe(characterScene);
  }

  initMobileLookbook();
  requestMobileHeroRender();
}

export function destroyMobileHome() {
  removeEventListener("scroll", requestMobileHeroRender);
  removeEventListener("resize", requestMobileHeroRender);
  if (frameRequest) cancelAnimationFrame(frameRequest);
  if (lookbookFrame) cancelAnimationFrame(lookbookFrame);
  lookbookMaskTimers.forEach(clearTimeout);
  lookbookMaskTimers = [];
  lookbookScroll?.removeEventListener("pointerdown", pauseMobileLookbook);
  lookbookScroll?.removeEventListener("wheel", pauseMobileLookbook);
  lookbookScroll?.removeEventListener("focusin", pauseMobileLookbook);
  characterObserver?.disconnect();
  frameRequest = 0;
  lookbookFrame = 0;
  lookbookLastTime = 0;
  lookbookLoopWidth = 0;
  lookbookScroll = null;
  initialized = false;
}
