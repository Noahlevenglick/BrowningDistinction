/**
 * Browning Archive - Timeline JavaScript
 * Interactive historical timeline functionality
 */

(function() {
  'use strict';

  // Timeline data and state
  let timelineData = [];
  let filteredData = [];
  let currentFilter = 'all';
  let currentDecade = null;

  // ==========================================
  // Load Timeline Data
  // ==========================================
  async function loadTimelineData() {
    try {
      const response = await fetch('data/timeline-events.json');
      if (!response.ok) throw new Error('Failed to load timeline data');

      timelineData = await response.json();
      filteredData = timelineData;

      hideLoading();
      initializeTimeline();
    } catch (error) {
      console.error('Error loading timeline:', error);
      showError('Failed to load timeline events. Please refresh the page.');
    }
  }

  // ==========================================
  // Initialize Timeline
  // ==========================================
  function initializeTimeline() {
    renderDecadeMarkers();
    renderTimelineEvents();
    initializeFilters();
    initializeModal();
    initializeNavigation();

    // Check if mobile view is needed
    handleResponsive();
    window.addEventListener('resize', BrowningArchive.Utils.debounce(handleResponsive, 250));
  }

  // ==========================================
  // Render Decade Markers
  // ==========================================
  function renderDecadeMarkers() {
    const container = document.getElementById('timeline-decades');
    if (!container) return;

    // Get unique decades from data
    const decades = [...new Set(timelineData.map(event => event.decade))].sort();

    container.innerHTML = decades.map(decade => `
      <div class="decade-marker" data-decade="${decade}">
        <div class="decade-dot"></div>
        <div class="decade-label">${decade}</div>
      </div>
    `).join('');

    // Add click handlers
    const markers = container.querySelectorAll('.decade-marker');
    markers.forEach(marker => {
      marker.addEventListener('click', function() {
        const decade = this.dataset.decade;
        filterByDecade(decade);
      });
    });
  }

  // ==========================================
  // Render Timeline Events
  // ==========================================
  function renderTimelineEvents() {
    const container = document.getElementById('timeline-events');
    if (!container) return;

    container.innerHTML = '';

    // Calculate positions for events
    const minYear = Math.min(...filteredData.map(e => e.year));
    const maxYear = Math.max(...filteredData.map(e => e.year));
    const yearRange = maxYear - minYear;
    const containerWidth = 1200; // Minimum width from CSS

    filteredData.forEach((event, index) => {
      const eventEl = createEventElement(event, index);

      // Calculate horizontal position
      const yearOffset = event.year - minYear;
      const leftPercent = (yearOffset / yearRange) * 100;
      eventEl.style.left = `calc(${leftPercent}% - 140px)`; // Center the 280px card

      container.appendChild(eventEl);

      // Trigger animation
      setTimeout(() => {
        eventEl.classList.add('visible');
      }, index * 100);
    });
  }

  // ==========================================
  // Create Event Element
  // ==========================================
  function createEventElement(event, index) {
    const eventEl = document.createElement('div');
    eventEl.className = `timeline-event ${index % 2 === 0 ? 'above' : 'below'}`;
    eventEl.dataset.eventId = event.id;
    eventEl.style.setProperty('--index', index);

    const firstImage = event.media && event.media.length > 0
      ? event.media[0].url
      : BrowningArchive.Utils.createPlaceholder(event.decade, 280, 150);

    eventEl.innerHTML = `
      <article class="event-card">
        <img src="${firstImage}"
             alt="${event.title}"
             class="event-image"
             onerror="this.src='${BrowningArchive.Utils.createPlaceholder(event.decade, 280, 150)}'">
        <div class="event-content">
          <p class="event-date">${BrowningArchive.Utils.formatDate(event.date)}</p>
          <h3 class="event-title">${event.title}</h3>
          <p class="event-description">${truncateText(event.description, 100)}</p>
          <div class="event-categories">
            ${event.categories.map(cat =>
              `<span class="category-tag">${formatCategory(cat)}</span>`
            ).join('')}
          </div>
        </div>
      </article>
    `;

    // Add click handler to open modal
    eventEl.addEventListener('click', () => openEventModal(event));

    return eventEl;
  }

  // ==========================================
  // Render Vertical Timeline (Mobile)
  // ==========================================
  function renderVerticalTimeline() {
    const container = document.getElementById('timeline-vertical');
    if (!container) return;

    container.innerHTML = filteredData.map((event, index) => {
      const firstImage = event.media && event.media.length > 0
        ? event.media[0].url
        : BrowningArchive.Utils.createPlaceholder(event.decade, 400, 200);

      return `
        <div class="timeline-event-vertical" data-event-id="${event.id}">
          <article class="event-card">
            <img src="${firstImage}"
                 alt="${event.title}"
                 class="event-image"
                 onerror="this.src='${BrowningArchive.Utils.createPlaceholder(event.decade, 400, 200)}'">
            <div class="event-content">
              <p class="event-date">${BrowningArchive.Utils.formatDate(event.date)}</p>
              <h3 class="event-title">${event.title}</h3>
              <p class="event-description">${truncateText(event.description, 150)}</p>
              <div class="event-categories">
                ${event.categories.map(cat =>
                  `<span class="category-tag">${formatCategory(cat)}</span>`
                ).join('')}
              </div>
            </div>
          </article>
        </div>
      `;
    }).join('');

    // Add click handlers
    const events = container.querySelectorAll('.timeline-event-vertical');
    events.forEach(eventEl => {
      eventEl.addEventListener('click', function() {
        const eventId = this.dataset.eventId;
        const event = timelineData.find(e => e.id === eventId);
        if (event) openEventModal(event);
      });
    });
  }

  // ==========================================
  // Filter Functions
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

  function applyFilter(filter) {
    if (filter === 'all') {
      filteredData = timelineData;
    } else {
      filteredData = timelineData.filter(event =>
        event.categories.includes(filter)
      );
    }

    renderTimelineEvents();

    if (window.innerWidth <= 768) {
      renderVerticalTimeline();
    }
  }

  function filterByDecade(decade) {
    currentDecade = decade;
    filteredData = timelineData.filter(event => event.decade === decade);
    renderTimelineEvents();

    if (window.innerWidth <= 768) {
      renderVerticalTimeline();
    }

    // Update navigation
    updateNavigation();
  }

  // ==========================================
  // Event Modal
  // ==========================================
  function initializeModal() {
    const modal = document.getElementById('event-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeEventModal());
    }

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeEventModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeEventModal();
      }
    });
  }

  function openEventModal(event) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    // Populate modal content
    document.getElementById('modal-date').textContent = BrowningArchive.Utils.formatDate(event.date);
    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-description').innerHTML = `<p>${event.description}</p>`;

    // Set main image
    const mainImage = document.getElementById('modal-image');
    if (event.media && event.media.length > 0) {
      mainImage.src = event.media[0].url;
      mainImage.alt = event.media[0].caption || event.title;
    } else {
      mainImage.src = BrowningArchive.Utils.createPlaceholder(event.decade, 900, 400);
      mainImage.alt = event.title;
    }

    // Categories
    const categoriesContainer = document.getElementById('modal-categories');
    categoriesContainer.innerHTML = event.categories.map(cat =>
      `<span class="category-tag">${formatCategory(cat)}</span>`
    ).join('');

    // Additional media
    if (event.media && event.media.length > 1) {
      const mediaSection = document.getElementById('modal-media-section');
      const mediaGrid = document.getElementById('modal-media-grid');

      mediaSection.style.display = 'block';
      mediaGrid.innerHTML = event.media.slice(1).map(media => `
        <div class="modal-media-item">
          <img src="${media.url}"
               alt="${media.caption || event.title}"
               onerror="this.src='${BrowningArchive.Utils.createPlaceholder('Archive', 200, 180)}'">
          <div class="modal-caption">${media.caption || ''}</div>
        </div>
      `).join('');
    } else {
      document.getElementById('modal-media-section').style.display = 'none';
    }

    // Related content
    if (event.relatedExhibits && event.relatedExhibits.length > 0) {
      const relatedSection = document.getElementById('related-content');
      const relatedLinks = document.getElementById('related-links');

      relatedSection.style.display = 'block';
      relatedLinks.innerHTML = event.relatedExhibits.map(exhibitId =>
        `<a href="exhibits/${exhibitId}/index.html" class="related-link">View Related Exhibit</a>`
      ).join('');
    } else {
      document.getElementById('related-content').style.display = 'none';
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // Timeline Navigation
  // ==========================================
  function initializeNavigation() {
    const prevBtn = document.getElementById('prev-decade');
    const nextBtn = document.getElementById('next-decade');

    if (prevBtn) {
      prevBtn.addEventListener('click', navigatePrevDecade);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', navigateNextDecade);
    }
  }

  function navigatePrevDecade() {
    const decades = [...new Set(timelineData.map(e => e.decade))].sort();
    const currentIndex = decades.indexOf(currentDecade);

    if (currentIndex > 0) {
      filterByDecade(decades[currentIndex - 1]);
    }
  }

  function navigateNextDecade() {
    const decades = [...new Set(timelineData.map(e => e.decade))].sort();
    const currentIndex = decades.indexOf(currentDecade);

    if (currentIndex < decades.length - 1) {
      filterByDecade(decades[currentIndex + 1]);
    }
  }

  function updateNavigation() {
    const decades = [...new Set(timelineData.map(e => e.decade))].sort();
    const currentIndex = decades.indexOf(currentDecade);

    const prevBtn = document.getElementById('prev-decade');
    const nextBtn = document.getElementById('next-decade');
    const currentLabel = document.getElementById('current-decade');

    if (currentLabel) {
      currentLabel.textContent = currentDecade || 'All Time';
    }

    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
    }

    if (nextBtn) {
      nextBtn.disabled = currentIndex >= decades.length - 1;
    }

    const nav = document.getElementById('timeline-nav');
    if (nav) {
      nav.style.display = currentDecade ? 'flex' : 'none';
    }
  }

  // ==========================================
  // Responsive Handling
  // ==========================================
  function handleResponsive() {
    const horizontal = document.getElementById('timeline-horizontal');
    const vertical = document.getElementById('timeline-vertical');

    if (window.innerWidth <= 768) {
      // Mobile: show vertical timeline
      if (horizontal) horizontal.style.display = 'none';
      if (vertical) {
        vertical.style.display = 'block';
        renderVerticalTimeline();
      }
    } else {
      // Desktop: show horizontal timeline
      if (horizontal) horizontal.style.display = 'block';
      if (vertical) vertical.style.display = 'none';
    }
  }

  // ==========================================
  // Utility Functions
  // ==========================================
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  function formatCategory(category) {
    const categoryMap = {
      'founding': 'Founding',
      'academics': 'Academics',
      'athletics': 'Athletics',
      'arts': 'Arts & Culture',
      'campus': 'Campus',
      'milestones': 'Milestones'
    };
    return categoryMap[category] || category;
  }

  function hideLoading() {
    const loading = document.getElementById('timeline-loading');
    if (loading) loading.style.display = 'none';
  }

  function showError(message) {
    const loading = document.getElementById('timeline-loading');
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
    // Only run on timeline page
    if (!document.getElementById('timeline-events')) return;

    loadTimelineData();
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
