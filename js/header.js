(() => {
  const mount = document.getElementById('navbar');
  if (!mount) return;

  const setCurrentNavLink = () => {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const links = mount.querySelectorAll('.nav-links a[href]');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const hrefFile = href.split('/').pop().split('?')[0];
      if (hrefFile === currentFile) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  fetch('components/header.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load header component');
      }
      return response.text();
    })
    .then((html) => {
      mount.innerHTML = html;
      setCurrentNavLink();
    })
    .catch((error) => {
      console.error(error);
    });
})();
