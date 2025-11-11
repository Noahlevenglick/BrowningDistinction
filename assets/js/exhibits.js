/**
 * Browning Archive - Exhibits JavaScript
 * Digital exhibits showcase functionality
 */

(function() {
  'use strict';

  let exhibitsData = [];
  let filteredData = [];
  let currentFilter = 'all';

  // ==========================================
  // Load Exhibits Data
  // ==========================================
  async function loadExhibitsData() {
    try {
      const response = await fetch('data/exhibits.json');
      if (!response.ok) throw new Error('Failed to load exhibits data');

      exhibitsData = await response.json();
      filteredData = exhibitsData;

      hideLoading();
      renderExhibits();
    } catch (error) {
      console.error('Error loading exhibits:', error);
      showError('Failed to load exhibits. Please refresh the page.');
    }
  }

  // ==========================================
  // Render Exhibits
  // ==========================================
  function renderExhibits() {
    renderFeaturedExhibits();
    renderAllExhibits();
    checkEmptyState();
  }

  // ==========================================
  // Render Featured Exhibits
  // ==========================================
  function renderFeaturedExhibits() {
    const container = document.getElementById('featured-grid');
    if (!container) return;

    const featured = filteredData.filter(exhibit => exhibit.featured);

    if (featured.length === 0) {
      document.getElementById('featured-exhibits').style.display = 'none';
      return;
    }

    document.getElementById('featured-exhibits').style.display = 'block';

    container.innerHTML = featured.map(exhibit => `
      <article class="exhibit-card featured reveal">
        <img src="${exhibit.coverImage}"
             alt="${exhibit.title}"
             class="exhibit-cover"
             onerror="this.src='${BrowningArchive.Utils.createPlaceholder(exhibit.title, 400, 300)}'">
        <div class="exhibit-card-content">
          <span class="exhibit-badge">Featured</span>
          <h3 class="exhibit-title">${exhibit.title}</h3>
          <p class="exhibit-subtitle">${exhibit.subtitle}</p>
          <p class="exhibit-description">${exhibit.description}</p>

          ${exhibit.chapters && exhibit.chapters.length > 0 ? `
            <div class="exhibit-chapters">
              <h4>Inside This Exhibit:</h4>
              <ul class="chapter-list">
                ${exhibit.chapters.slice(0, 3).map(chapter => `
                  <li>${chapter.title}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="exhibit-meta">
            <span class="exhibit-decade">=Å ${exhibit.decade}</span>
            <span class="exhibit-count">=Ä ${exhibit.itemCount} items</span>
          </div>
          <a href="exhibits/${exhibit.id}/index.html" class="exhibit-link">
            <button class="btn btn-primary">Explore Exhibit</button>
          </a>
        </div>
      </article>
    `).join('');

    // Trigger scroll reveal animations
    initScrollReveal();
  }

  // ==========================================
  // Render All Exhibits
  // ==========================================
  function renderAllExhibits() {
    const container = document.getElementById('exhibits-grid');
    if (!container) return;

    const allExhibits = currentFilter === 'featured'
      ? filteredData.filter(e => e.featured)
      : filteredData;

    container.innerHTML = allExhibits.map(exhibit => `
      <article class="exhibit-card reveal">
        <img src="${exhibit.coverImage}"
             alt="${exhibit.title}"
             class="exhibit-cover"
             onerror="this.src='${BrowningArchive.Utils.createPlaceholder(exhibit.title, 400, 250)}'">
        <div class="exhibit-card-content">
          ${exhibit.featured ? '<span class="exhibit-badge">Featured</span>' : ''}
          <h3 class="exhibit-title">${exhibit.title}</h3>
          <p class="exhibit-subtitle">${exhibit.subtitle}</p>
          <p class="exhibit-description">${truncateText(exhibit.description, 150)}</p>

          <div class="exhibit-meta">
            <span class="exhibit-decade">=Å ${exhibit.decade}</span>
            <span class="exhibit-count">=Ä ${exhibit.itemCount} items</span>
          </div>
          <a href="exhibits/${exhibit.id}/index.html" class="exhibit-link">
            <button class="btn btn-secondary">View Exhibit</button>
          </a>
        </div>
      </article>
    `).join('');

    // Trigger scroll reveal animations
    initScrollReveal();
  }

  // ==========================================
  // Initialize Filters
  // ==========================================
  function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Apply filter
        const filter = this.dataset.filter;
        currentFilter = filter;
        applyFilter(filter);
      });
    });
  }

  // ==========================================
  // Apply Filter
  // ==========================================
  function applyFilter(filter) {
    if (filter === 'all') {
      filteredData = exhibitsData;
    } else if (filter === 'featured') {
      filteredData = exhibitsData.filter(exhibit => exhibit.featured);
    } else {
      filteredData = exhibitsData.filter(exhibit => exhibit.theme === filter);
    }

    renderExhibits();
  }

  // ==========================================
  // Reset Filters
  // ==========================================
  window.resetFilters = function() {
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
      allButton.click();
    }
  };

  // ==========================================
  // Check Empty State
  // ==========================================
  function checkEmptyState() {
    const emptyState = document.getElementById('empty-state');
    const featuredSection = document.getElementById('featured-exhibits');
    const allSection = document.getElementById('all-exhibits');

    if (filteredData.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (featuredSection) featuredSection.style.display = 'none';
      if (allSection) allSection.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (allSection) allSection.style.display = 'block';
    }
  }

  // ==========================================
  // Scroll Reveal for New Elements
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
  // Utility Functions
  // ==========================================
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  }

  function hideLoading() {
    const loading = document.getElementById('loading-state');
    if (loading) loading.style.display = 'none';
  }

  function showError(message) {
    const loading = document.getElementById('loading-state');
    if (loading) {
      loading.innerHTML = `
        <p style="color: var(--color-secondary); font-weight: 600;">  ${message}</p>
      `;
    }
  }

  // ==========================================
  // Initialize
  // ==========================================
  function init() {
    // Only run on exhibits page
    if (!document.getElementById('exhibits-grid')) return;

    loadExhibitsData();
    initializeFilters();
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
