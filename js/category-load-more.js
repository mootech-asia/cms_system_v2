// === Category pages Load More button ===
(function () {
  const ROUTES = new Set(['hot-games', 'sport', 'live', 'slot', 'fish', 'mini-games']);
  const BUTTON_CLASS = 'cms-load-more-button px-8 py-3 rounded-lg transition-colors';

  function ensureStyles() {
    if (document.getElementById('cms-load-more-style')) return;
    const style = document.createElement('style');
    style.id = 'cms-load-more-style';
    style.textContent = `
      .cms-load-more-button {
        min-width: 160px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgb(209, 213, 219);
        font-weight: 500;
        cursor: pointer;
        box-shadow: none;
        transition: background-color .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease, transform .18s ease;
      }
      .cms-load-more-button:hover,
      .cms-load-more-button:focus-visible {
        background: #304242;
        border-color: rgba(170, 229, 211, 0.22);
        color: #AAE5D3;
        box-shadow: inset 0 0 0 1px rgba(170, 229, 211, 0.03), 0 0 0 1px rgba(41, 68, 72, 0.35);
        transform: translateY(-1px);
        outline: none;
      }
      .cms-load-more-button:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  function findExistingLoadMore(root) {
    return [...root.querySelectorAll('button, a')].find((element) => /load\s*more/i.test((element.textContent || '').trim()));
  }

  function normalizeButton(button) {
    ensureStyles();
    button.textContent = 'Load More';
    button.className = BUTTON_CLASS;
    button.removeAttribute('style');
    button.setAttribute('type', 'button');
  }

  function createLoadMore() {
    const wrap = document.createElement('div');
    wrap.className = 'cms-load-more-wrap flex justify-center mt-8';

    const button = document.createElement('button');
    normalizeButton(button);
    wrap.appendChild(button);
    return wrap;
  }

  function ensureLoadMore(slug) {
    if (!ROUTES.has(slug)) return;
    const section = document.querySelector('#container section');
    const target = section && section.querySelector('.container');
    if (!target) return;

    const existing = findExistingLoadMore(target);
    if (existing) {
      normalizeButton(existing);
      return;
    }

    target.appendChild(createLoadMore());
  }

  document.addEventListener('page:rendered', (event) => {
    ensureLoadMore(event.detail && event.detail.slug);
  });
})();
