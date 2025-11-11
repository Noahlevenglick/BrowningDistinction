/**
 * Browning Archive - Main JavaScript
 * Core functionality for site-wide features
 */

(function() {
  'use strict';

  // ==========================================
  // Mobile Navigation
  // ==========================================
  function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInside = mobileToggle.contains(event.target) || navMenu.contains(event.target);
        if (!isClickInside && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileToggle.classList.remove('active');
        }
      });

      // Close menu when clicking a link
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
          mobileToggle.classList.remove('active');
        });
      });
    }
  }

  // ==========================================
  // Header Show/Hide on Scroll
  // ==========================================
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= scrollThreshold) {
        header.classList.remove('hidden');
      } else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        // Scrolling down
        header.classList.add('hidden');
      } else {
        // Scrolling up
        header.classList.remove('hidden');
      }

      lastScroll = currentScroll;
    });
  }

  // ==========================================
  // Scroll Reveal Animations
  // ==========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealOnScroll = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(element => {
      revealOnScroll.observe(element);
    });
  }

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================
  // Active Navigation Link
  // ==========================================
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ==========================================
  // Lazy Loading Images
  // ==========================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    images.forEach(img => imageObserver.observe(img));
  }

  // ==========================================
  // Modal/Lightbox Base Functionality
  // ==========================================
  window.BrowningArchive = window.BrowningArchive || {};

  window.BrowningArchive.Modal = {
    open: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    closeOnOutsideClick: function(modalId, contentClass) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (!e.target.closest('.' + contentClass)) {
            BrowningArchive.Modal.close(modalId);
          }
        });
      }
    }
  };

  // ==========================================
  // Utility Functions
  // ==========================================
  window.BrowningArchive.Utils = {
    // Format date for display
    formatDate: function(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },

    // Debounce function for performance
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Get URL parameters
    getUrlParameter: function(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    // Create placeholder image
    createPlaceholder: function(text, width, height) {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23F5F5DC' width='${width}' height='${height}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='20' fill='%238B4513'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
    },

    // Handle image load errors
    handleImageError: function(img, placeholderText) {
      img.onerror = function() {
        this.src = BrowningArchive.Utils.createPlaceholder(placeholderText || 'Image', 400, 250);
      };
    }
  };

  // ==========================================
  // Search Functionality (Basic)
  // ==========================================
  function initSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      });
    }
  }

  // ==========================================
  // Back to Top Button
  // ==========================================
  function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '‘';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background-color: var(--color-secondary);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
      box-shadow: var(--shadow-md);
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // Accessibility: Skip to Main Content
  // ==========================================
  function initSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
    `;

    skipLink.addEventListener('focus', function() {
      this.style.top = '0';
    });

    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // ==========================================
  // Initialize All
  // ==========================================
  function init() {
    // Core functionality
    initMobileNav();
    initHeaderScroll();
    initScrollReveal();
    initSmoothScroll();
    setActiveNavLink();
    initLazyLoading();
    initSearch();
    initBackToTop();
    initSkipLink();

    // Log initialization
    console.log('Browning Archive initialized');
  }

  // ==========================================
  // Run on DOM Ready
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
