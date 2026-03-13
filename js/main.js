/**
 * Clear Water Wellness - Main JavaScript
 * Minimal Editorial Theme — Enhanced
 */

document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // CONFIGURATION
  // Backup plan: if Formspree is not configured or fails,
  // the form falls back to opening a pre-filled mailto link.
  // =============================================
  const CONFIG = {
    // Sign up at formspree.io, create a form, and paste the 8-char ID here.
    // Leave as 'YOUR_FORM_ID' to use the mailto fallback only.
    formspreeId: 'YOUR_FORM_ID',
    backupEmail: 'info@cwwellness.com',
  };

  // =============================================
  // PLATFORM DETECTION
  // =============================================
  const PlatformDetect = (function () {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';

    const isIOS = /iPhone|iPad|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/.test(ua);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const isMobile = isMobileUA || (isTouchDevice && isSmallScreen);
    const isTablet = isTouchDevice && !isMobileUA && window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;

    const root = document.documentElement;
    root.classList.add(isMobile ? 'is-mobile' : isTablet ? 'is-tablet' : 'is-desktop');
    root.classList.add('is-' + (isIOS ? 'ios' : isAndroid ? 'android' : 'other'));
    if (isTouchDevice) root.classList.add('is-touch');

    function update() {
      const nowSmall = window.matchMedia('(max-width: 768px)').matches;
      const nowMobile = isMobileUA || (isTouchDevice && nowSmall);
      const nowTablet = isTouchDevice && !isMobileUA && window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
      root.classList.toggle('is-mobile', nowMobile);
      root.classList.toggle('is-tablet', nowTablet);
      root.classList.toggle('is-desktop', !nowMobile && !nowTablet);
    }

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return { isMobile, isTablet, isIOS, isAndroid, isTouchDevice };
  })();

  window.CWW = window.CWW || {};
  window.CWW.platform = PlatformDetect;

  // =============================================
  // HEADER SCROLL BEHAVIOR
  // =============================================
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.pageYOffset > 50);
    }, { passive: true });
  }

  // =============================================
  // MOBILE NAVIGATION TOGGLE + FOCUS TRAP
  // =============================================
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');

  function openNav() {
    nav.classList.add('nav--open');
    navToggle.classList.add('nav__toggle--active');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    nav.classList.remove('nav--open');
    navToggle.classList.remove('nav__toggle--active');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    // Close all mobile dropdowns
    document.querySelectorAll('.nav__item').forEach(item => item.classList.remove('nav__item--open'));
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('nav--open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Focus trap inside mobile menu
    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('nav--open')) return;

      if (e.key === 'Escape') {
        closeNav();
        navToggle.focus();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = Array.from(nav.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  // Mobile dropdown toggles
  document.querySelectorAll('.nav__item').forEach(item => {
    const dropdownLink = item.querySelector('.nav__link--dropdown');
    if (!dropdownLink) return;

    dropdownLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        document.querySelectorAll('.nav__item').forEach(other => {
          if (other !== item) other.classList.remove('nav__item--open');
        });
        item.classList.toggle('nav__item--open');
      }
    });
  });

  // Close nav on dropdown link click
  document.querySelectorAll('.nav__dropdown-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close nav on non-dropdown link click
  document.querySelectorAll('.nav__link:not(.nav__link--dropdown)').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // =============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target && header) {
          const offset = target.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    });
  });

  // =============================================
  // BACK TO TOP BUTTON
  // =============================================
  document.querySelectorAll('.back-to-top').forEach(btn => {
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // =============================================
  // COUNT-UP ANIMATIONS FOR STATS
  // =============================================
  function animateCountUp(el, originalText) {
    const match = originalText.match(/^(\d+)/);
    if (!match) return;

    const end = parseInt(match[1], 10);
    const suffix = originalText.slice(match[1].length); // e.g. "+" from "5+"
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(end * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = originalText; // Restore exact original
      }
    }

    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        if (/^\d/.test(text)) {
          animateCountUp(el, text);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat__number').forEach(el => statObserver.observe(el));

  // =============================================
  // INLINE FORM VALIDATION
  // =============================================
  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errorEl = group.querySelector('.form-error');
    let isValid = true;
    let errorMsg = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMsg = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        isValid = false;
        errorMsg = 'Please enter a valid email address.';
      }
    }

    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid && field.value.trim() !== '');
    group.classList.toggle('has-error', !isValid);

    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.toggle('visible', !isValid);
    }

    return isValid;
  }

  // =============================================
  // CONTACT FORM — Formspree + mailto fallback
  // =============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    // Wire up per-field inline validation
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Validate all required fields before submitting
      let formIsValid = true;
      contactForm.querySelectorAll('input[required], textarea[required]').forEach(field => {
        if (!validateField(field)) formIsValid = false;
      });
      if (!formIsValid) return;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      const submitBtn = contactForm.querySelector('.form-submit');
      const successEl = contactForm.querySelector('.form-success');
      const fallbackEl = contactForm.querySelector('.form-fallback');

      const originalText = submitBtn.textContent;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Sending\u2026';

      let submitted = false;

      // Primary: Formspree
      const formId = CONFIG.formspreeId;
      if (formId && formId !== 'YOUR_FORM_ID') {
        try {
          const res = await fetch(`https://formspree.io/f/${formId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
          });
          if (res.ok) submitted = true;
        } catch (err) {
          console.warn('Formspree failed, using mailto fallback.', err);
        }
      }

      submitBtn.classList.remove('is-loading');
      submitBtn.textContent = originalText;

      if (submitted) {
        // Full success
        contactForm.reset();
        contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
        if (successEl) {
          successEl.classList.add('visible');
          setTimeout(() => successEl.classList.remove('visible'), 10000);
        }
      } else {
        // Backup plan: open pre-filled mailto link and show notice
        const subject = encodeURIComponent('New Appointment Request — Clear Water Wellness');
        const body = encodeURIComponent(
          `Name: ${data.name || ''}\n` +
          `Email: ${data.email || ''}\n` +
          `Phone: ${data.phone || 'N/A'}\n` +
          `Service: ${data.service || 'N/A'}\n` +
          `Availability: ${data.availability || 'N/A'}\n\n` +
          `Message:\n${data.message || ''}`
        );
        window.location.href = `mailto:${CONFIG.backupEmail}?subject=${subject}&body=${body}`;

        if (fallbackEl) {
          fallbackEl.classList.add('visible');
        }
      }
    });
  }

  // =============================================
  // INTERSECTION OBSERVER — SCROLL ANIMATIONS
  // Stagger capped at 0.6s so late cards don't feel abandoned
  // =============================================
  const animElements = document.querySelectorAll('.service-card, .team-card, .approach__item, .stat');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Inject animate-in style once
  const animStyle = document.createElement('style');
  animStyle.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(animStyle);

  animElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    const delay = Math.min(index * 0.1, 0.6); // cap stagger at 0.6s
    el.style.transition = `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`;
    scrollObserver.observe(el);
  });

  // =============================================
  // CURRENT PAGE HIGHLIGHT
  // =============================================
  (function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__link:not(.nav__link--dropdown)').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('nav__link--active');
      }
    });

    document.querySelectorAll('.nav__dropdown-link').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('nav__dropdown-link--active');
        const parentLink = link.closest('.nav__item')?.querySelector('.nav__link--dropdown');
        if (parentLink) parentLink.classList.add('nav__link--active');
      }
    });
  })();

  // =============================================
  // LAZY LOAD IMAGES
  // =============================================
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // =============================================
  // ACCESSIBILITY: KEYBOARD NAV INDICATOR
  // =============================================
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
  });
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // =============================================
  // PHONE NUMBER FORMATTING
  // =============================================
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length >= 6) {
        v = `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6, 10)}`;
      } else if (v.length >= 3) {
        v = `(${v.slice(0, 3)}) ${v.slice(3)}`;
      }
      e.target.value = v;
    });
  }

  // =============================================
  // CONSOLE MESSAGE
  // =============================================
  console.log('%c Clear Water Wellness ', 'background: #1a1a1a; color: #fff; padding: 10px 20px; font-size: 14px;');
  console.log('Making therapy less awkward since 2017');

});
