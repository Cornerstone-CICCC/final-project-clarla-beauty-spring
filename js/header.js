(() => {
  const mount = document.getElementById('navbar');
  if (!mount) return;

  const syncMountHeight = () => {
    const header = mount.querySelector('.header');
    if (!header) return;
    mount.style.height = `${header.offsetHeight}px`;
  };

  const updateHeaderOnScroll = () => {
    const header = mount.querySelector('.header');
    if (!header) return;

    const hero = document.querySelector('.hero');
    const triggerPoint = hero ? hero.offsetHeight / 2 : 80;
    const isScrolled = window.scrollY > triggerPoint;

    header.classList.toggle('scrolled', isScrolled);

    const desktopLogo = header.querySelector('.desktop-logo');
    if (desktopLogo) {
      desktopLogo.classList.toggle('scroll-logo', isScrolled);
    }

    syncMountHeight();
  };

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
      updateHeaderOnScroll();
      syncMountHeight();
    })
    .catch((error) => {
      console.error(error);
    });

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  window.addEventListener('resize', syncMountHeight);
})();
