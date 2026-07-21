export function initMenu() {
  const overlay = document.querySelector("#menu-overlay");
  if (!overlay) return;

  const close = () => overlay.classList.remove("open");

  document.addEventListener("click", event => {
    if (event.target.closest(".menu-toggle")) overlay.classList.add("open");
    if (event.target.closest("#menu-close") || event.target.closest(".menu-links a")) close();
    if (overlay.classList.contains("open") && !event.target.closest(".menu-overlay") && !event.target.closest(".menu-toggle")) close();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") close();
  });
}
