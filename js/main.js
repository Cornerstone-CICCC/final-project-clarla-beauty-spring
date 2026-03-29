// ============================================
// BC BEAUTY - MAIN JAVASCRIPT
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // LOAD HEADER & FOOTER
  // ============================================
  
  // Load header
  fetch('includes/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      initHeader();
    })
    .catch(error => console.error('Error loading header:', error));
  
  // Load footer
  fetch('includes/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
  
  // ============================================
  // HEADER FUNCTIONALITY
  // ============================================
  
  function initHeader() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Mobile menu toggle
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
      });
      
      // Close menu when clicking nav links
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mainNav.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
    
    // Header scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
      const scrollPos = window.pageYOffset + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    window.addEventListener('scroll', updateActiveNav);
  }
  
  // ============================================
  // SMOOTH SCROLLING
  // ============================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (href === '#' || !href) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);
  
  // Observe elements with scroll-animate class
  const animateElements = document.querySelectorAll('.scroll-animate');
  animateElements.forEach(el => observer.observe(el));
  
  // Add scroll-animate class to sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    if (index > 0) { // Skip hero section
      section.classList.add('scroll-animate');
      observer.observe(section);
    }
  });
  
  // ============================================
  // CONTACT FORM TABS
  // ============================================
  
  const formTabs = document.querySelectorAll('.form-tab');
  
  formTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      formTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Here you can add logic to show/hide different form fields
      // based on whether "Services" or "Classes" tab is active
      const tabType = this.getAttribute('data-tab');
      console.log('Active tab:', tabType);
    });
  });
  
  // ============================================
  // FORM VALIDATION & SUBMISSION
  // ============================================
  
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const formObject = {};
      
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      
      console.log('Form submitted:', formObject);
      
      // Here you would typically send the data to a server
      // For now, we'll just show a success message
      
      // Validate form
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
          isValid = false;
          formGroup.classList.add('error');
          
          // Add error message if it doesn't exist
          if (!formGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            formGroup.appendChild(errorMsg);
          }
        } else {
          formGroup.classList.remove('error');
          const errorMsg = formGroup.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
      
      if (isValid) {
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
      }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        
        if (this.hasAttribute('required') && !this.value.trim()) {
          formGroup.classList.add('error');
          
          if (!formGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            formGroup.appendChild(errorMsg);
          }
        } else {
          formGroup.classList.remove('error');
          const errorMsg = formGroup.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
      
      input.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        
        if (this.value.trim()) {
          formGroup.classList.remove('error');
          const errorMsg = formGroup.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
    });
  }
  
  // ============================================
  // STATS COUNTER ANIMATION
  // ============================================
  
  function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        element.textContent = element.textContent.replace(/\d+/, target);
        clearInterval(timer);
      } else {
        element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
      }
    }, 16);
  }
  
  // Trigger counter animation when stats section is visible
  const statsNumbers = document.querySelectorAll('.stats__number');
  const statsSection = document.querySelector('.stats');
  
  if (statsSection && statsNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsNumbers.forEach((number, index) => {
            setTimeout(() => {
              animateCounter(number);
            }, index * 100);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }
  
  // ============================================
  // IMAGE LAZY LOADING (Fallback for older browsers)
  // ============================================
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // ============================================
  // PORTFOLIO IMAGE MODAL (Optional Enhancement)
  // ============================================
  
  // You can add a lightbox/modal for portfolio images here
  
  // ============================================
  // YEAR UPDATE IN FOOTER
  // ============================================
  
  setTimeout(() => {
    const copyrightYear = document.querySelector('.footer__copyright');
    if (copyrightYear) {
      const currentYear = new Date().getFullYear();
      copyrightYear.textContent = copyrightYear.textContent.replace('2024', currentYear);
    }
  }, 500);
  
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
