document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;
  const savedTheme = localStorage.getItem('devbase-theme');
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);

  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const themeLabel = document.querySelector('.theme-label');

  const applyThemeState = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀';
    if (themeLabel) themeLabel.textContent = isLight ? 'Dark' : 'Light';
  };

  applyThemeState();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('devbase-theme', nextTheme);
      applyThemeState();
    });
  }

  const button = document.querySelector('.search-box button');
  const input = document.querySelector('.search-box input');

  if (button && input) {
    button.addEventListener('click', () => {
      const query = input.value.trim();
      const targetUrl = query ? `posts.html?q=${encodeURIComponent(query)}` : 'posts.html';
      window.location.href = targetUrl;
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        button.click();
      }
    });
  }

  const searchInput = document.getElementById('postSearch');
  const filterButtons = document.querySelectorAll('.chip');
  const postCards = document.querySelectorAll('.article-card');
  const noResults = document.querySelector('.no-results');

  if (searchInput && postCards.length) {
    let activeFilter = 'all';

    const updatePosts = () => {
      const query = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      postCards.forEach((card) => {
        const text = (card.textContent || '').toLowerCase();
        const tags = (card.dataset.tags || '').toLowerCase();
        const matchesCategory = activeFilter === 'all' || tags.includes(activeFilter);
        const matchesSearch = !query || text.includes(query) || tags.includes(query);
        const shouldShow = matchesCategory && matchesSearch;

        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      if (noResults) {
        noResults.classList.toggle('visible', visibleCount === 0);
      }
    };

    filterButtons.forEach((buttonNode) => {
      buttonNode.addEventListener('click', () => {
        filterButtons.forEach((chip) => chip.classList.toggle('active', chip === buttonNode));
        activeFilter = buttonNode.dataset.filter || 'all';
        updatePosts();
      });
    });

    searchInput.addEventListener('input', updatePosts);

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery) {
      searchInput.value = initialQuery;
    }

    updatePosts();
  }
});
