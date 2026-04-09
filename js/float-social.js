// ─────────────────────────────────────────────────────────
// FLOAT-SOCIAL — standalone toggle script
// Drop this anywhere before </body> or import as a module
// ─────────────────────────────────────────────────────────

(function () {
  function initFloatSocial() {
    var container = document.getElementById('float-social');
    var toggle = document.getElementById('float-social-toggle');

    if (!container || !toggle) return;

    toggle.addEventListener('click', function () {
      container.classList.toggle('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatSocial);
  } else {
    initFloatSocial();
  }
})();
