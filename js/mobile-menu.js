document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openMenu");
  const closeBtn = document.getElementById("closeMenu");
  const menu = document.getElementById("mobileMenu");
  const links = document.querySelectorAll(".mobile-nav-links a");

  if (!openBtn || !menu) return;

  // Open menu
  openBtn.addEventListener("click", () => {
    menu.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent scroll
  });

  // Close menu
  const closeMenu = () => {
    menu.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeMenu);

  // Close when clicking links
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
});