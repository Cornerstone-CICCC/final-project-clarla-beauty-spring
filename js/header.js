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

  const initMobileMenu = () => {
    const hamburger = document.querySelector('#hamburger');
    const mobileMenu = document.querySelector('#mobileMenu');
    const closeMenu = document.querySelector('#closeMenu');
    const navOverlay = document.querySelector('#navOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!hamburger || !mobileMenu || !navOverlay) return;

    const closeMobileMenu = () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
      hamburger.classList.add('active');
      mobileMenu.classList.add('open');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (closeMenu) {
      closeMenu.addEventListener('click', closeMobileMenu);
    }

    navOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  };

  // ... inside your fetch block in header.js
  fetch('components/header.html')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load header');
      return response.text();
    })
    .then((html) => {
      mount.innerHTML = html;
      setCurrentNavLink();
      updateHeaderOnScroll();
      syncMountHeight();

      // 🔥 MOVE THIS HERE:
      initMobileMenu();
    })
    .catch((error) => console.error(error));

  // Remove the standalone initMobileMenu() call from the bottom of the file

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  window.addEventListener('resize', syncMountHeight);
})();
s;
