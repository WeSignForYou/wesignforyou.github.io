/* ===========================
   WeSignForYou - Main Scripts
   =========================== */

// Navbar scroll effect
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click', () => {
  const isOpen = ham.classList.toggle('open');
  mob.classList.toggle('open');
  ham.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  mob.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Page dots & active nav tracking
const sections = document.querySelectorAll('.page,[id="reviews"]');
const dots = document.querySelectorAll('.page-dots .dot');
const navLinks = document.querySelectorAll('.nav-links a');

dots.forEach(d => d.addEventListener('click', () => {
  const target = document.getElementById(d.dataset.target);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => sectionObserver.observe(s));

// Reveal on scroll animations
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Reviews carousel
(function () {
  const slides = document.getElementById('carouselSlides');
  const dotsContainer = document.getElementById('carouselDots');
  const total = slides.children.length;
  let current = 0;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  const allDots = dotsContainer.querySelectorAll('.c-dot');

  function goTo(n) {
    current = n;
    slides.style.transform = 'translateX(-' + current * 100 + '%)';
    allDots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.querySelector('.carousel-arrow-left').addEventListener('click', () => {
    goTo(current > 0 ? current - 1 : total - 1);
  });
  document.querySelector('.carousel-arrow-right').addEventListener('click', () => {
    goTo(current < total - 1 ? current + 1 : 0);
  });

  // Auto-advance every 6 seconds
  setInterval(() => goTo(current < total - 1 ? current + 1 : 0), 6000);

  // Touch swipe support
  let startX = 0;
  slides.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  slides.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? goTo(current < total - 1 ? current + 1 : 0) : goTo(current > 0 ? current - 1 : total - 1);
    }
  });
})();
