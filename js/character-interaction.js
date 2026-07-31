import { createScene } from "./character-scene-rig.js";

const SCENE_URL = "/assets/shared/home/character/interactive/scene.svg";

let sceneMarkupPromise;

function loadSceneMarkup() {
  if (!sceneMarkupPromise) {
    sceneMarkupPromise = fetch(SCENE_URL).then(response => {
      if (!response.ok) throw new Error(`Unable to load character scene: ${response.status}`);
      return response.text();
    });
  }
  return sceneMarkupPromise;
}

export async function mountCharacterInteraction(container, { autoplay = false } = {}) {
  if (!container) return null;

  const markup = await loadSceneMarkup();
  if (!container.isConnected) return null;

  container.innerHTML = markup;
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("Character scene SVG is missing its root element.");

  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.classList.add("character-interaction-svg");
  svg.setAttribute("aria-label", "Interactive Milo and BoBo animation");

  const scene = createScene(svg);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplayEnabled = autoplay && !reducedMotion;
  let autoplayTimer = 0;
  let actionTimer = 0;
  let visible = false;

  const stage = container.parentElement;
  stage?.classList.remove("has-interacted", "has-shaken", "has-launched");
  const markShaken = () => stage?.classList.add("has-interacted", "has-shaken");
  const markLaunched = () => stage?.classList.add("has-interacted", "has-launched");
  const resetShaken = () => stage?.classList.remove("has-shaken");
  const resetLaunched = () => stage?.classList.remove("has-launched");
  svg.addEventListener("milo:shake", markShaken);
  svg.addEventListener("toy:launch", markLaunched);
  svg.addEventListener("milo:complete", resetShaken);
  svg.addEventListener("toy:complete", resetLaunched);

  function clearAutoplay() {
    clearTimeout(autoplayTimer);
    clearTimeout(actionTimer);
    autoplayTimer = 0;
    actionTimer = 0;
  }

  function runAutoplayCycle() {
    clearAutoplay();
    if (!autoplayEnabled || !visible) return;

    scene.shakeHead();
    actionTimer = window.setTimeout(() => {
      if (autoplayEnabled && visible) scene.launch();
    }, 1850);
    autoplayTimer = window.setTimeout(runAutoplayCycle, 6800);
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) runAutoplayCycle();
    else clearAutoplay();
  }, { threshold: .3 });
  observer.observe(container);

  return {
    svg,
    scene,
    setAutoplay(enabled) {
      autoplayEnabled = Boolean(enabled) && !reducedMotion;
      if (autoplayEnabled && visible) runAutoplayCycle();
      else clearAutoplay();
    },
    destroy() {
      clearAutoplay();
      observer.disconnect();
      svg.removeEventListener("milo:shake", markShaken);
      svg.removeEventListener("toy:launch", markLaunched);
      svg.removeEventListener("milo:complete", resetShaken);
      svg.removeEventListener("toy:complete", resetLaunched);
      scene.destroy();
      container.replaceChildren();
    },
  };
}
