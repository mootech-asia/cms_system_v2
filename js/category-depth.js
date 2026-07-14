// === Category cleanup for legacy injected headers/back buttons ===
(function () {
  const CATEGORY_ROUTES = new Set(['hot-games', 'sport', 'live', 'slot', 'fish', 'mini-games']);

  function escapeHtml(value) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (char) => map[char]);
  }

  function cleanup(detail) {
    const slug = detail && detail.slug;
    if (!CATEGORY_ROUTES.has(slug)) return;
    const section = document.querySelector('#container section');
    const target = section && section.querySelector('.container');
    if (!target) return;

    target.querySelectorAll('.cms-category-back-wrap, .cms-provider-heading').forEach((element) => element.remove());
    target.querySelectorAll('[data-cms-provider-title]').forEach((heading) => {
      heading.innerHTML = escapeHtml(heading.dataset.cmsProviderTitle || heading.textContent || '');
      heading.classList.remove('cms-provider-inline');
      delete heading.dataset.cmsProviderTitle;
    });
  }

  document.addEventListener('page:rendered', (event) => {
    cleanup(event.detail || {});
  });
})();
