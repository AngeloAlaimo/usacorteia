// Corte IA: interruptor de lanzamiento.
// Cambia a true cuando la app esté publicada en el App Store: reactiva la compra web y las descargas.
window.APP_RELEASED = false;

if (!window.APP_RELEASED) {
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href*="apps.apple.com"],a[data-funnel]');
    if (a) e.preventDefault();
  }, true);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href*="apps.apple.com"],a[data-funnel]').forEach(a => {
      a.setAttribute("aria-disabled", "true");
      a.style.cursor = "default";
      if (a.classList.contains("btn")) { a.textContent = "Muy pronto en App Store"; a.style.opacity = ".7"; }
    });
  });
}
