// === Category pages Load More button ===
(function () {
  const ROUTES = new Set(['hot-games', 'sport', 'live', 'slot', 'fish', 'mini-games']);
  const BUTTON_CLASS = 'cms-load-more-button px-8 py-3 rounded-lg transition-colors';
  const BUTTON_STYLE = 'background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); color: rgb(209, 213, 219); font-weight: 500; cursor: pointer; min-width: 160px;';

  function findExistingLoadMore(root) {
    return [...root.querySelectorAll('button, a')].find((element) => /load\s*more/i.test((element.textContent || '').trim()));
  }

  function normalizeButton(button) {
    button.textContent = 'Load More';
    button.className = BUTTON_CLASS;
    button.setAttribute('style', BUTTON_STYLE);
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
