/**
 * Browning Archive - Search JavaScript
 * Search functionality across all archive content
 */

(function() {
  'use strict';

  let allData = [];
  let currentQuery = '';
  let currentFilters = {
    type: '',
    decade: '',
    theme: ''
  };

  // ==========================================
  // Load All Data
  // ==========================================
  async function loadAllData() {
    try {
      const [timelineRes, exhibitsRes, voicesRes] = await Promise.all([
        fetch('data/timeline-events.json'),
        fetch('data/exhibits.json'),
        fetch('data/voices.json')
      ]);

      const timeline = await timelineRes.json();
      const exhibits = await exhibitsRes.json();
      const voices = await voicesRes.json();

      // Tag each item with its type
      allData = [
        ...timeline.map(item => ({ ...item, type: 'timeline' })),
        ...exhibits.map(item => ({ ...item, type: 'exhibit' })),
        ...voices.map(item => ({ ...item, type: 'voice' }))
      ];

      console.log(`Loaded ${allData.length} items for search`);
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }

  // ==========================================
  // Initialize Search
  // ==========================================
  function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resetBtn = document.getElementById('reset-filters');
    const clearBtn = document.getElementById('clear-search');

    // Handle search form submission
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          currentQuery = query;
          performSearch();
        }
      });
    }

    // Handle filter changes
    ['type-filter', 'decade-filter', 'theme-filter'].forEach(filterId => {
      const filter = document.getElementById(filterId);
      if (filter) {
        filter.addEventListener('change', function() {
          updateFiltersFromUI();
          if (currentQuery) {
            performSearch();
          }
        });
      }
    });

    // Reset filters
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        document.getElementById('type-filter').value = '';
        document.getElementById('decade-filter').value = '';
        document.getElementById('theme-filter').value = '';
        currentFilters = { type: '', decade: '', theme: '' };
        if (currentQuery) {
          performSearch();
        }
      });
    }

    // Clear search
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        currentQuery = '';
        showState('initial');
      });
    }

    // Check URL for query parameter
    const urlQuery = BrowningArchive.Utils.getUrlParameter('q');
    if (urlQuery) {
      searchInput.value = urlQuery;
      currentQuery = urlQuery;
      performSearch();
    }
  }

  // ==========================================
  // Perform Search
  // ==========================================
  function performSearch() {
    showState('loading');

    // Simulate search delay for better UX
    setTimeout(() => {
      const results = searchData(currentQuery, currentFilters);
      displayResults(results);
    }, 300);
  }

  // ==========================================
  // Search Algorithm
  // ==========================================
  function searchData(query, filters) {
    const queryLower = query.toLowerCase();

    let results = allData.filter(item => {
      // Text search
      const titleMatch = item.title?.toLowerCase().includes(queryLower);
      const descMatch = item.description?.toLowerCase().includes(queryLower);
      const authorMatch = item.author?.toLowerCase().includes(queryLower);
      const transcriptionMatch = item.transcription?.toLowerCase().includes(queryLower);

      const textMatch = titleMatch || descMatch || authorMatch || transcriptionMatch;

      if (!textMatch) return false;

      // Apply filters
      if (filters.type && item.type !== filters.type) return false;
      if (filters.decade && item.decade !== filters.decade) return false;

      // Theme filter (check categories or theme property)
      if (filters.theme) {
        const hasTheme = item.categories?.includes(filters.theme) ||
                        item.theme === filters.theme ||
                        item.tags?.includes(filters.theme);
        if (!hasTheme) return false;
      }

      return true;
    });

    // Sort by relevance (simple: title matches first)
    results.sort((a, b) => {
      const aTitle = a.title?.toLowerCase().includes(queryLower);
      const bTitle = b.title?.toLowerCase().includes(queryLower);
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });

    return results;
  }

  // ==========================================
  // Display Results
  // ==========================================
  function displayResults(results) {
    if (results.length === 0) {
      showState('no-results');
      return;
    }

    const resultsGrid = document.getElementById('results-grid');
    const resultsCount = document.getElementById('results-count');
    const resultsQuery = document.getElementById('results-query');

    // Update header
    const count = results.length;
    resultsCount.textContent = `Found ${count} result${count !== 1 ? 's' : ''}`;
    resultsQuery.textContent = `Searching for: "${currentQuery}"`;

    // Render results
    resultsGrid.innerHTML = results.map(item => createResultCard(item)).join('');

    showState('results');
  }

  // ==========================================
  // Create Result Card
  // ==========================================
  function createResultCard(item) {
    const typeLabel = getTypeLabel(item.type);
    const typeIcon = getTypeIcon(item.type);
    const link = getItemLink(item);
    const image = getItemImage(item);

    return `
      <article class="card reveal">
        <img src="${image}"
             alt="${item.title}"
             class="card-image"
             onerror="this.src='${BrowningArchive.Utils.createPlaceholder(item.title, 400, 250)}'">
        <div class="card-content">
          <span class="exhibit-badge">${typeIcon} ${typeLabel}</span>
          <h3 class="card-title">${highlightQuery(item.title, currentQuery)}</h3>
          <p class="card-description">${truncateText(item.description, 120)}</p>
          <div class="card-meta">
            <span>=Å ${item.decade || item.date || 'N/A'}</span>
            ${item.itemCount ? `<span>=Ä ${item.itemCount} items</span>` : ''}
          </div>
          <a href="${link}" class="btn btn-secondary" style="width: 100%; margin-top: var(--space-md);">
            View ${typeLabel}
          </a>
        </div>
      </article>
    `;
  }

  // ==========================================
  // Utility Functions
  // ==========================================
  function updateFiltersFromUI() {
    currentFilters = {
      type: document.getElementById('type-filter').value,
      decade: document.getElementById('decade-filter').value,
      theme: document.getElementById('theme-filter').value
    };
  }

  function showState(state) {
    const states = ['initial', 'loading', 'results', 'no-results'];
    states.forEach(s => {
      const el = document.getElementById(`${s}-state`);
      if (el) el.style.display = s === state ? 'block' : 'none';
    });
  }

  function getTypeLabel(type) {
    const labels = {
      'timeline': 'Timeline Event',
      'exhibit': 'Exhibit',
      'voice': 'Voice'
    };
    return labels[type] || type;
  }

  function getTypeIcon(type) {
    const icons = {
      'timeline': '=Å',
      'exhibit': '=¼',
      'voice': '=Ý'
    };
    return icons[type] || '=Ä';
  }

  function getItemLink(item) {
    switch (item.type) {
      case 'timeline':
        return `timeline.html#${item.id}`;
      case 'exhibit':
        return `exhibits/${item.id}/index.html`;
      case 'voice':
        return `voices.html#${item.id}`;
      default:
        return '#';
    }
  }

  function getItemImage(item) {
    if (item.coverImage) return item.coverImage;
    if (item.imageUrl) return item.imageUrl;
    if (item.media && item.media.length > 0) return item.media[0].url;
    return BrowningArchive.Utils.createPlaceholder(item.title, 400, 250);
  }

  function highlightQuery(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background-color: var(--color-accent); color: white; padding: 2px 4px; border-radius: 2px;">$1</mark>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  }

  // ==========================================
  // Initialize
  // ==========================================
  async function init() {
    // Only run on search page
    if (!document.getElementById('search-form')) return;

    await loadAllData();
    initializeSearch();
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
