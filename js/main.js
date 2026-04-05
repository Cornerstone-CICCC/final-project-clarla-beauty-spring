// ──────────────────────────────────────────────────────────
// Header: scroll class
// ──────────────────────────────────────────────────────────
const header = document.getElementById('header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
// ──────────────────────────────────────────────────────────
// Mobile menu
// ──────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

if (hamburger && mobileMenu && mobileClose) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileClose.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// ──────────────────────────────────────────────────────────
// Testimonials carousel
// ──────────────────────────────────────────────────────────
const testimonials = [
  { quote: "Carla is the best! She made me the night's brightest star! She stayed with me the whole wedding ensuring I always look perfect. 10/10 would recommend!", author: "Janny" },
  { quote: "Carla Beauty's makeup for my photoshoot was outstanding! Their expertise and attention to detail made me look perfect in every shot. Highly recommend!", author: "Ingrid" },
  { quote: "Carla Beauty's party makeup service was amazing! The makeup lasted all night, keeping me flawless until the end. Thank you, Carla for an unforgettable experience!", author: "Marcela" },
];

let currentTestimonial = 0;

const quoteEl  = document.querySelector('.testimonials__quote');
const authorEl = document.querySelector('.testimonials__author');

quoteEl.style.transition  = 'opacity 0.2s ease';
authorEl.style.transition = 'opacity 0.2s ease';

const showTestimonial = (idx) => {
  quoteEl.style.opacity  = '0';
  authorEl.style.opacity = '0';
  setTimeout(() => {
    quoteEl.textContent  = testimonials[idx].quote;
    authorEl.textContent = testimonials[idx].author;
    quoteEl.style.opacity  = '1';
    authorEl.style.opacity = '1';
  }, 200);
};

document.getElementById('prev-testimonial').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

document.getElementById('next-testimonial').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 6000);


// ──────────────────────────────────────────────────────────
// Contact form: date picker toggle
// ──────────────────────────────────────────────────────────
const dateRadios = document.querySelectorAll('input[name="date_type"]');
const datePickerInput = document.getElementById('event-date-picker');

dateRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    const val = (e.target).value;
    datePickerInput.style.display = val === 'date' ? 'block' : 'none';
  });
});

// ──────────────────────────────────────────────────────────
// Contact form submission
// ──────────────────────────────────────────────────────────
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.contact-form__btn');
  const orig = btn.textContent;
  btn.textContent = 'Sent!';
  btn.style.background = '#4caf50';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    form.reset();
  }, 3000);
});

// ──────────────────────────────────────────────────────────
// Intersection observer: fade-in animations
// ──────────────────────────────────────────────────────────
const fadeTargets = document.querySelectorAll(
  '.about__inner, .brands__logos, .star__text-wrap, .gallery, .testimonials__content, ' +
  '.services__inner, .classes__inner, .beauty-tips__grid, .contact__header, .contact-form'
);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      (entry.target).style.opacity = '1';
      (entry.target).style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => {
  (el).style.opacity = '0';
  (el).style.transform = 'translateY(24px)';
  (el).style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  io.observe(el);
});
