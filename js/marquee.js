export function setMarqueesPaused(paused) {
  document.querySelectorAll(".roll-track").forEach(track => {
    track.style.animationPlayState = paused ? "paused" : "running";
  });
}
