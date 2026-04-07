(() => {
  const mount = document.getElementById('footer');
  if (!mount) return;

  const ensureFooterStylesheet = () => {
    const existing = document.querySelector('link[data-footer-css="true"]');
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/footer.css';
    link.setAttribute('data-footer-css', 'true');
    document.head.appendChild(link);
  };

  ensureFooterStylesheet();

  fetch('components/footer.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load footer component');
      }
      return response.text();
    })
    .then((html) => {
      mount.innerHTML = html;
    })
    .catch((error) => {
      console.error(error);
    });
})();
