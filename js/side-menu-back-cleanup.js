(function () {
  const MEMBER_SLUGS = new Set([
    'account',
    'account-record',
    'betting-record',
    'banking-details',
    'change-password',
    'deposit',
    'deposit-record',
    'personal-info',
    'profit-loss',
    'security',
    'support',
    'withdrawal',
    'withdrawal-record'
  ]);

  function activeSlug(detail) {
    if (detail && detail.slug) return detail.slug;
    const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
    return hash || 'home';
  }

  function isMemberPage(detail) {
    return MEMBER_SLUGS.has(activeSlug(detail));
  }

  function removeMemberBacks(detail) {
    if (!isMemberPage(detail)) return;
    document.querySelectorAll('#container #member-back, #container .mf-back').forEach((node) => node.remove());
  }

  function scheduleRemove(detail) {
    if (!isMemberPage(detail)) return;
    removeMemberBacks(detail);
    requestAnimationFrame(() => removeMemberBacks(detail));
    setTimeout(() => removeMemberBacks(detail), 60);
  }

  function handleMemberClick(event) {
    if (activeSlug() === 'banking-details' && event.target.closest('#container [data-acct]')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    requestAnimationFrame(() => scheduleRemove());
  }

  document.addEventListener('page:rendered', (event) => scheduleRemove(event.detail));
  window.addEventListener('hashchange', () => requestAnimationFrame(() => scheduleRemove()));
  document.addEventListener('click', handleMemberClick, true);

  const observer = new MutationObserver(() => scheduleRemove());
  function startObserver() {
    const container = document.getElementById('container');
    if (container) observer.observe(container, { childList: true, subtree: true });
    scheduleRemove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
