/**
 * Clear Water Wellness - Main JavaScript
 * Minimal Editorial Theme
 */

document.addEventListener('DOMContentLoaded', function() {

  // =============================================
  // PLATFORM DETECTION
  // =============================================
  const PlatformDetect = (function() {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';

    const isIOS = /iPhone|iPad|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/.test(ua);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const isMobile = isMobileUA || (isTouchDevice && isSmallScreen);
    const isTablet = isTouchDevice && !isMobileUA && window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
    const isDesktop = !isMobile && !isTablet;

    const os = isIOS ? 'ios' : isAndroid ? 'android' : 'other';

    // Apply CSS classes to the document element for easy styling hooks
    const root = document.documentElement;
    root.classList.add(isMobile ? 'is-mobile' : isTablet ? 'is-tablet' : 'is-desktop');
    root.classList.add('is-' + os);
    if (isTouchDevice) root.classList.add('is-touch');

    // Listen for orientation and resize changes to update detection
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

    return {
      isMobile: isMobile,
      isTablet: isTablet,
      isDesktop: isDesktop,
      isIOS: isIOS,
      isAndroid: isAndroid,
      isTouchDevice: isTouchDevice,
      os: os
    };
  })();

  // Expose platform info globally
  window.CWW = window.CWW || {};
  window.CWW.platform = PlatformDetect;

  // =============================================
  // HEADER SCROLL BEHAVIOR
  // =============================================
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScroll = currentScroll;
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // =============================================
  // MOBILE NAVIGATION TOGGLE
  // =============================================
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      nav.classList.toggle('nav--open');
      navToggle.classList.toggle('nav__toggle--active');
      document.body.classList.toggle('nav-open');
    });
  }
  
  // Mobile dropdown toggles
  const dropdownItems = document.querySelectorAll('.nav__item');
  
  dropdownItems.forEach(item => {
    const dropdownLink = item.querySelector('.nav__link--dropdown');
    const dropdown = item.querySelector('.nav__dropdown');
    
    if (dropdownLink && dropdown) {
      dropdownLink.addEventListener('click', function(e) {
        // Only handle on mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          
          // Close other dropdowns
          dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('nav__item--open');
            }
          });
          
          // Toggle this dropdown
          item.classList.toggle('nav__item--open');
        }
      });
    }
  });
  
  // Close mobile nav when clicking a dropdown link (not the toggle)
  const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('nav--open');
      navToggle.classList.remove('nav__toggle--active');
      document.body.classList.remove('nav-open');
      
      // Close all dropdowns
      dropdownItems.forEach(item => {
        item.classList.remove('nav__item--open');
      });
    });
  });
  
  // Close mobile nav when clicking non-dropdown links
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--dropdown)');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('nav--open');
      navToggle.classList.remove('nav__toggle--active');
      document.body.classList.remove('nav-open');
    });
  });
  
  // =============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerHeight = header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // =============================================
  // FORM HANDLING
  // =============================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simple validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // In production, you would send this to your server or a form service
      // For now, we'll just show a success message
      console.log('Form submitted:', data);
      
      // Show success message
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Request Submitted!';
      submitBtn.style.background = '#22c55e';
      
      // Reset form
      contactForm.reset();
      
      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    });
  }
  
  // =============================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // =============================================
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.service-card, .team-card, .approach__item, .stat');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  };
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
  
  animateOnScroll();
  
  // =============================================
  // CURRENT PAGE HIGHLIGHT
  // =============================================
  function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check direct nav links
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--dropdown)');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('nav__link--active');
      }
    });
    
    // Check dropdown links and highlight parent if match found
    const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');
    dropdownLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('nav__dropdown-link--active');
        // Also highlight the parent dropdown trigger
        const parentItem = link.closest('.nav__item');
        if (parentItem) {
          const parentLink = parentItem.querySelector('.nav__link--dropdown');
          if (parentLink) {
            parentLink.classList.add('nav__link--active');
          }
        }
      }
    });
  }
  
  highlightCurrentPage();
  
  // =============================================
  // LAZY LOAD IMAGES (if any are added)
  // =============================================
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
  
  // =============================================
  // ACCESSIBILITY: FOCUS MANAGEMENT
  // =============================================
  // Add visible focus styles when using keyboard
  document.body.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.body.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });
  
  // =============================================
  // PHONE NUMBER FORMATTING
  // =============================================
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length >= 6) {
        value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
      } else if (value.length >= 3) {
        value = `(${value.slice(0,3)}) ${value.slice(3)}`;
      }
      
      e.target.value = value;
    });
  }
  
  // =============================================
  // CONSOLE MESSAGE
  // =============================================
  console.log('%c Clear Water Wellness ', 'background: #1a1a1a; color: #fff; padding: 10px 20px; font-size: 14px;');
  console.log('Making therapy less awkward since 2017');
  
});
