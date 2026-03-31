/**
 * ═══════════════════════════════════════════════════════════
 *  RIYA KUMARI — PORTFOLIO  |  script.js
 *  Vanilla JS — clean, efficient, well-commented
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. DOM REFERENCES
───────────────────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const backTop     = document.getElementById('back-top');
const yearEl      = document.getElementById('year');
const contactForm = document.getElementById('contact-form');
const formNotice  = document.getElementById('form-notice');
const submitBtn   = document.getElementById('submit-btn');

/* ─────────────────────────────────────────────────────────
   2. FOOTER YEAR — auto-update copyright year
───────────────────────────────────────────────────────── */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ─────────────────────────────────────────────────────────
   3. STICKY NAVBAR
   Adds .scrolled class after user scrolls past 60px,
   which triggers the glassmorphism background via CSS.
───────────────────────────────────────────────────────── */
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load in case page reloads mid-scroll

/* ─────────────────────────────────────────────────────────
   4. ACTIVE NAV LINK HIGHLIGHTING
   Uses IntersectionObserver to track which section is in
   the viewport and applies .active to the corresponding
   nav link.
───────────────────────────────────────────────────────── */
const sections  = document.querySelectorAll('main section[id]');
const navItems  = document.querySelectorAll('.nav-item');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active from all links
        navItems.forEach((link) => link.classList.remove('active'));
        // Add active to the matching link
        const activeLink = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    rootMargin: `-${getNavHeight()}px 0px -50% 0px`,
    threshold: 0,
  }
);
sections.forEach((section) => sectionObserver.observe(section));

/** Returns the navbar height in pixels (used for rootMargin offset). */
function getNavHeight() {
  return navbar ? navbar.offsetHeight : 68;
}

/* ─────────────────────────────────────────────────────────
   5. HAMBURGER MENU TOGGLE
   Toggles .open class on the hamburger button and nav
   list on mobile. Closes menu on outside click.
───────────────────────────────────────────────────────── */
if (hamburger && navLinks) {
  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  // Close menu on outside click / escape key
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
}
function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

/* ─────────────────────────────────────────────────────────
   6. SMOOTH SCROLL FOR ANCHOR LINKS
   Offsets the scroll position by the navbar height so
   headings are not hidden behind the sticky nav.
───────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const offset = target.getBoundingClientRect().top + window.scrollY - getNavHeight() - 16;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver to add .visible to elements
   with reveal classes, triggering CSS entry animations.
   Supports --delay CSS variable for staggered entrances.
───────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal — each element animates only once
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ─────────────────────────────────────────────────────────
   8. BACK-TO-TOP BUTTON
   Fades in/out based on scroll position and scrolls to
   the top when clicked.
───────────────────────────────────────────────────────── */
if (backTop) {
  window.addEventListener(
    'scroll',
    () => {
      backTop.classList.toggle('show', window.scrollY > 500);
    },
    { passive: true }
  );

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────
   9. CONTACT FORM
   Client-side validation + simulated submission feedback.
   In production, replace the simulate block with your
   preferred backend (e.g. Formspree, EmailJS, etc.).
───────────────────────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  // Clear previous notice
  setFormNotice('', '');

  const data = {
    name:    contactForm.name.value.trim(),
    email:   contactForm.email.value.trim(),
    subject: contactForm.subject.value.trim(),
    message: contactForm.message.value.trim(),
  };

  // ── Basic validation ──
  if (!data.name || !data.email || !data.subject || !data.message) {
    setFormNotice('Please fill in all fields.', 'error');
    return;
  }
  if (!isValidEmail(data.email)) {
    setFormNotice('Please enter a valid email address.', 'error');
    return;
  }

  // ── Loading state ──
  setSubmitState(true);

  try {
    /* ────────────────────────────────────────────────────
       PRODUCTION: Replace the block below with a real
       fetch to your form endpoint, e.g.:

       const res = await fetch('https://formspree.io/f/YOUR_ID', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
       if (!res.ok) throw new Error('Server error');
    ────────────────────────────────────────────────────── */
    await simulateSubmit();

    // ── Success ──
    setFormNotice('✓  Message sent! I\'ll get back to you soon.', 'success');
    contactForm.reset();
  } catch (err) {
    setFormNotice('Something went wrong. Please try again or email me directly.', 'error');
    console.error('Form submission error:', err);
  } finally {
    setSubmitState(false);
  }
}

/** Toggle button loading state. */
function setSubmitState(loading) {
  if (!submitBtn) return;
  if (loading) {
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending…';
    submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
  } else {
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Send Message';
    submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
  }
}

/** Display a notice message with optional 'error' type styling. */
function setFormNotice(message, type) {
  if (!formNotice) return;
  formNotice.textContent = message;
  formNotice.className   = 'form-notice' + (type === 'error' ? ' error' : '');
}

/** Simulate async form submission (remove in production). */
function simulateSubmit() {
  return new Promise((resolve) => setTimeout(resolve, 1400));
}

/** Simple email format validation. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─────────────────────────────────────────────────────────
   10. SKILL PILL HOVER EFFECT — subtle ripple
───────────────────────────────────────────────────────── */
document.querySelectorAll('.skill-pill').forEach((pill) => {
  pill.addEventListener('mouseenter', () => {
    pill.style.transform = 'scale(1.04)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});

/* ─────────────────────────────────────────────────────────
   11. HERO IMAGE — graceful fallback
   If profile.jpg fails to load, show styled initials.
───────────────────────────────────────────────────────── */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('error', () => {
    // Replace broken image with a styled placeholder div
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%; height: 100%;
      background: var(--clr-surface);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Montserrat', sans-serif;
      font-size: 5rem; font-weight: 900;
      color: var(--clr-accent-lt);
      border-radius: inherit;
    `;
    placeholder.textContent = 'RK';
    heroImg.replaceWith(placeholder);
  });
}

/* ─────────────────────────────────────────────────────────
   12. STAT COUNTER ANIMATION
   Animates the numeric stat values from 0 when they scroll
   into view, creating an engaging counting effect.
───────────────────────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
statNums.forEach((el) => counterObserver.observe(el));

/**
 * Counts up from 0 to the element's numeric value over ~1 second.
 * Preserves non-numeric suffixes like "+" or decimal notation.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const raw      = el.textContent.trim();           // e.g. "8.2" or "2+"
  const suffix   = raw.replace(/[\d.]/g, '');       // "+" or ""
  const target   = parseFloat(raw);
  const isFloat  = raw.includes('.');
  const duration = 1000; // ms
  const steps    = 40;
  const interval = duration / steps;
  let   current  = 0;

  const timer = setInterval(() => {
    current += target / steps;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
  }, interval);
}