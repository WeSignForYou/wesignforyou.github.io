/* ===========================
   WeSignForYou - Main Scripts
   =========================== */

/* This script is shared by every page, so each block checks that the elements
   it needs are actually present before wiring anything up. */

// Footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Navbar scroll effect
const nav = document.getElementById('navbar');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Hamburger menu
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
if (ham && mob) {
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
}

// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    // Placeholder links (href="#") are not valid selectors — leave them alone.
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
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
  // Only the homepage has the reviews carousel — bail out everywhere else.
  if (!slides || !dotsContainer) return;
  const total = slides.children.length;
  let current = 0;

  // Create dots as real buttons so they are focusable and announced.
  // Click handlers are attached further down, once goTo/startAuto exist.
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to review ' + (i + 1) + ' of ' + total);
    dotsContainer.appendChild(dot);
  }
  const allDots = dotsContainer.querySelectorAll('.c-dot');

  const AUTO_ADVANCE_MS = 6000;
  let timer = null;

  function goTo(n) {
    current = n;
    slides.style.transform = 'translateX(-' + current * 100 + '%)';
    allDots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current < total - 1 ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : total - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, AUTO_ADVANCE_MS);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // Any manual navigation restarts the clock, so you always get a full
  // interval to read the slide you just chose.
  function manual(fn) {
    return () => { fn(); startAuto(); };
  }

  allDots.forEach((d, i) => d.addEventListener('click', manual(() => goTo(i))));
  document.querySelector('.carousel-arrow-left').addEventListener('click', manual(prev));
  document.querySelector('.carousel-arrow-right').addEventListener('click', manual(next));

  // Pause while the pointer is over the carousel, or while it is focused via
  // the keyboard, so it cannot advance mid-sentence while someone is reading.
  const wrapper = slides.closest('.carousel-wrapper') || slides;
  wrapper.addEventListener('mouseenter', stopAuto);
  wrapper.addEventListener('mouseleave', startAuto);
  wrapper.addEventListener('focusin', stopAuto);
  wrapper.addEventListener('focusout', startAuto);

  // Don't run the timer at all when the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  // Touch swipe support
  let startX = 0;
  slides.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  slides.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
      startAuto();
    }
  });

  // Respect the OS reduced-motion setting: no automatic movement at all.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduceMotion.matches) startAuto();
  reduceMotion.addEventListener('change', e => e.matches ? stopAuto() : startAuto());
})();
