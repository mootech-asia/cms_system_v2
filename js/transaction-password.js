// === Change Transaction Password flow ===
// Enhances the shared change-password fragment only when opened from
// Security Center as #/change-password?type=txn.
(function () {
  const HINT = '★Use 5-16 visible ASCII characters (letters, numbers, symbols)';
  const VISIBLE_ASCII = /^[\x21-\x7E]{5,16}$/;

  function showWarning(message) {
    if (window.showMemberModal) {
      window.showMemberModal({ type: 'warning', message });
      return;
    }
    alert(message);
  }

  function enhanceTransactionPassword(query) {
    if (!query || query.type !== 'txn') return;
    const root = document.querySelector('[data-change-password]');
    if (!root || root.dataset.txnReady === '1') return;
    root.dataset.txnReady = '1';

    const heading = document.querySelector('#container main h1');
    if (heading) heading.textContent = 'Change Transaction Password';

    const hint = root.querySelector('.mf-hint');
    if (hint) hint.textContent = HINT;

    const back = root.querySelector('.mf-back');
    if (back) back.setAttribute('href', '#/security');

    const newInput = root.querySelector('[data-cp-new]');
    const confirmInput = root.querySelector('[data-cp-confirm]');
    const submit = root.querySelector('[data-cp-submit]');
    if (!newInput || !confirmInput || !submit) return;

    submit.addEventListener('click', (event) => {
      if (submit.disabled) return;
      const password = newInput.value;
      const confirmation = confirmInput.value;

      if (!VISIBLE_ASCII.test(password)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showWarning('Use 5-16 visible ASCII characters (letters, numbers, symbols).');
        return;
      }
      if (password !== confirmation) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showWarning('The two passwords do not match.');
      }
    }, true);
  }

  document.addEventListener('page:rendered', (event) => {
    if (!event.detail || event.detail.slug !== 'change-password') return;
    enhanceTransactionPassword(event.detail.query);
  });
})();
