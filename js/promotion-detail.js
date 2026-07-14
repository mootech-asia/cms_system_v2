// === Promotion list/detail navigation ===
(function () {
  const PROMOS = [
    { id: 'riobet-casino', title: 'RioBet Casino', headline: 'Unlimited Daily Bonus', primary: 'Sports / Slots', primaryRate: '5%', secondary: 'Casino / Mini Games', secondaryRate: '3%' },
    { id: 'bitstarz-casino', title: 'BitStarz Casino', headline: 'Weekly Reload Bonus', primary: 'Slots', primaryRate: '50%', secondary: 'Live Casino', secondaryRate: '10%' },
    { id: 'icecasino', title: 'IceCasino', headline: 'Member Exclusive Bonus', primary: 'Hot Games', primaryRate: '30%', secondary: 'Mini Games', secondaryRate: '8%' },
    { id: 'gamdom-casino', title: 'Gamdom Casino', headline: 'Daily Cashback Boost', primary: 'Sports', primaryRate: '15%', secondary: 'Fish Games', secondaryRate: '6%' },
  ];
  const PROMO_BY_ID = PROMOS.reduce((map, promo) => {
    map[promo.id] = promo;
    return map;
  }, {});

  function escapeHtml(value) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (char) => map[char]);
  }

  function getSection() {
    return document.querySelector('#container section');
  }

  function getContainer() {
    const section = getSection();
    return section && section.querySelector('.container');
  }

  function ensureStyles() {
    if (document.getElementById('promotion-detail-style')) return;
    const style = document.createElement('style');
    style.id = 'promotion-detail-style';
    style.textContent = `
      #container section.promotion-detail-section{background:#070b33!important;min-height:calc(100dvh - 64px)!important;padding-top:40px!important;padding-bottom:72px!important}
      .promotion-clickable{cursor:pointer}
      .promotion-clickable:focus-visible{outline:2px solid #98E7D2;outline-offset:3px}
      .promotion-detail-page{max-width:1240px;margin:0 auto;color:#fff}
      .promotion-detail-back{display:inline-flex;align-items:center;gap:8px;margin-bottom:34px;border:1px solid rgba(203,232,228,.24);background:rgba(255,255,255,.05);color:#f5f7fb;border-radius:8px;padding:10px 16px;font-size:18px;font-weight:800;line-height:1;cursor:pointer;transition:background-color .16s ease,border-color .16s ease,color .16s ease}
      .promotion-detail-back:hover,.promotion-detail-back:focus-visible{background:rgba(203,232,228,.12);border-color:rgba(203,232,228,.42);color:#CBE8E4;outline:none}
      .promotion-detail-back svg{width:20px;height:20px;stroke-width:3}
      .promotion-detail-heading{display:inline-block;margin:0 0 28px;font-size:30px;font-weight:900;line-height:1;background:linear-gradient(90deg,#f02eb7,#ff7864,#ffb23d);-webkit-background-clip:text;background-clip:text;color:transparent}
      .promotion-detail-shell{display:flex;flex-direction:column;align-items:center;gap:34px}
      .promotion-detail-poster{position:relative;width:min(100%,690px);min-height:860px;overflow:hidden;border:2px solid rgba(226,174,73,.82);border-radius:4px;background:radial-gradient(circle at 50% 13%,rgba(246,207,112,.18),transparent 22%),radial-gradient(circle at 82% 5%,rgba(246,207,112,.28),transparent 18%),linear-gradient(160deg,#14103c 0%,#09072b 58%,#14103c 100%);box-shadow:0 26px 80px rgba(0,0,0,.42),inset 0 0 0 8px rgba(226,174,73,.14);padding:62px 64px 54px;text-align:center}
      .promotion-detail-poster:before,.promotion-detail-poster:after{content:"";position:absolute;pointer-events:none}.promotion-detail-poster:before{inset:28px;border:2px solid rgba(226,174,73,.68);box-shadow:inset 0 0 0 1px rgba(255,242,186,.2)}.promotion-detail-poster:after{right:-82px;bottom:-96px;width:270px;height:420px;border-radius:160px 160px 0 0;background:linear-gradient(180deg,rgba(255,242,186,.24),rgba(255,120,100,.12) 45%,transparent);filter:blur(2px);transform:rotate(-15deg)}
      .promotion-detail-content{position:relative;z-index:1;display:flex;min-height:744px;flex-direction:column;align-items:center;justify-content:space-between;gap:28px}
      .promotion-detail-logo{height:44px;object-fit:contain;mix-blend-mode:lighten}.promotion-detail-kicker{margin:0;color:#f5c75f;font-size:15px;font-weight:900;letter-spacing:.24em;text-transform:uppercase}.promotion-detail-title{margin:0;font-size:58px;font-weight:1000;line-height:1.08;color:#ffd979;text-shadow:0 2px 0 #7c4511,0 0 24px rgba(255,202,89,.45)}
      .promotion-detail-subtitle{margin:0;color:#fff;font-size:24px;font-weight:800}.promotion-detail-offers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;width:100%;margin-top:4px}.promotion-detail-offer{position:relative;border:2px solid rgba(226,174,73,.78);border-radius:16px;background:rgba(13,10,44,.74);padding:26px 18px 22px;box-shadow:inset 0 0 24px rgba(226,174,73,.08)}
      .promotion-detail-rank{position:absolute;top:-17px;left:50%;transform:translateX(-50%);width:38px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#ffe58d,#d79225);color:#25150b;font-size:14px;font-weight:1000;box-shadow:0 6px 16px rgba(0,0,0,.35)}
      .promotion-detail-offer h4{margin:0 0 10px;color:#ffd979;font-size:21px;font-weight:1000}.promotion-detail-offer strong{display:block;color:#fff;font-size:30px;line-height:1}.promotion-detail-offer span{display:block;margin-top:10px;color:#f5f7fb;font-size:14px;font-weight:700}
      .promotion-detail-rules{width:100%;margin:2px 0 0;padding:22px 28px;border:1px solid rgba(226,174,73,.74);border-radius:16px;background:rgba(8,7,30,.58);text-align:left}.promotion-detail-rules h4{margin:0 0 12px;text-align:center;color:#fff;font-size:18px}.promotion-detail-rules ol{margin:0;padding-left:18px;color:#d9d7e8;font-size:15px;line-height:1.7}.promotion-detail-note{margin:0;color:#c9c7d8;font-size:13px;line-height:1.6}.promotion-detail-cta{width:min(100%,420px);border:0;border-radius:8px;background:linear-gradient(90deg,#CBE8E4,#98E7D2);color:#07131c;font-size:17px;font-weight:900;padding:14px 18px;cursor:pointer;transition:opacity .16s ease}.promotion-detail-cta:hover,.promotion-detail-cta:focus-visible{opacity:.88;outline:none}
      @media(max-width:768px){#container section.promotion-detail-section{padding-top:28px!important}.promotion-detail-back{font-size:16px;margin-bottom:24px}.promotion-detail-heading{font-size:28px}.promotion-detail-poster{min-height:auto;padding:44px 24px 36px}.promotion-detail-poster:before{inset:16px}.promotion-detail-content{min-height:680px}.promotion-detail-title{font-size:38px}.promotion-detail-subtitle{font-size:20px}.promotion-detail-offers{grid-template-columns:1fr;gap:22px}.promotion-detail-rules{padding:18px 20px}.promotion-detail-rules ol{font-size:14px}}
    `;
    document.head.appendChild(style);
  }

  function setDetailMode(enabled) {
    const section = getSection();
    if (!section) return;
    const hero = section.previousElementSibling;
    if (hero && hero.querySelector('h1')) hero.style.display = enabled ? 'none' : '';
    section.classList.toggle('promotion-detail-section', enabled);
  }

  function removeLoadMore(root) {
    [...root.querySelectorAll('button, a')]
      .filter((element) => /load\s*more/i.test((element.textContent || '').trim()))
      .forEach((button) => {
        const parent = button.parentElement;
        if (parent && parent.children.length === 1 && /justify-center/.test(parent.className || '')) parent.remove();
        else button.remove();
      });
  }

  function goToDetail(id) {
    location.hash = '#/promotion?detail=' + encodeURIComponent(id);
  }

  function setupList() {
    const target = getContainer();
    if (!target) return;
    ensureStyles();
    setDetailMode(false);
    removeLoadMore(target);

    const cards = [...target.querySelectorAll('.grid > div')].filter((card) => card.querySelector('h3') && card.querySelector('button'));
    cards.forEach((card, index) => {
      const promo = PROMOS[index] || PROMOS[0];
      if (!promo) return;
      card.classList.add('promotion-clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.dataset.promoId = promo.id;

      if (!card.dataset.promotionBound) {
        card.dataset.promotionBound = 'true';
        card.addEventListener('click', () => goToDetail(card.dataset.promoId));
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            goToDetail(card.dataset.promoId);
          }
        });
      }

      const button = card.querySelector('button');
      if (button && !button.dataset.promotionBound) {
        button.dataset.promotionBound = 'true';
        button.type = 'button';
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          goToDetail(card.dataset.promoId);
        });
      }
    });
  }

  function renderDetail(id) {
    const target = getContainer();
    if (!target) return;
    ensureStyles();
    const promo = PROMO_BY_ID[id] || PROMOS[0];
    const title = escapeHtml(promo.title);
    setDetailMode(true);

    target.innerHTML = `
      <div class="promotion-detail-page">
        <button class="promotion-detail-back" type="button" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span>Back</span>
        </button>
        <div class="promotion-detail-shell">
          <h2 class="promotion-detail-heading">Promotion</h2>
          <div class="promotion-detail-poster">
            <div class="promotion-detail-content">
              <img class="promotion-detail-logo" src="assets/logo.png" alt="WIN100%">
              <div>
                <p class="promotion-detail-kicker">Special Offer</p>
                <h3 class="promotion-detail-title">${escapeHtml(promo.headline)}</h3>
                <p class="promotion-detail-subtitle">${title}</p>
              </div>
              <div class="promotion-detail-offers">
                <div class="promotion-detail-offer">
                  <div class="promotion-detail-rank">1</div>
                  <h4>${escapeHtml(promo.primary)}</h4>
                  <strong>${escapeHtml(promo.primaryRate)}</strong>
                  <span>Max reward / rollover applies</span>
                </div>
                <div class="promotion-detail-offer">
                  <div class="promotion-detail-rank">2</div>
                  <h4>${escapeHtml(promo.secondary)}</h4>
                  <strong>${escapeHtml(promo.secondaryRate)}</strong>
                  <span>Max reward / rollover applies</span>
                </div>
              </div>
              <div class="promotion-detail-rules">
                <h4>Promotion Terms</h4>
                <ol>
                  <li>Bonus rewards are calculated from eligible deposits and game turnover.</li>
                  <li>Cancelled bets, refunds, cashouts, and invalid results are not included.</li>
                  <li>Members must keep an active balance and meet rollover requirements.</li>
                  <li>Each completed promotion can only be claimed once.</li>
                </ol>
              </div>
              <button class="promotion-detail-cta" type="button">Claim Promotion</button>
              <p class="promotion-detail-note">win100% reserves the right to adjust, pause, or end this promotion at any time.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const back = target.querySelector('.promotion-detail-back');
    if (back) back.addEventListener('click', () => { location.hash = '#/promotion'; });
  }

  document.addEventListener('page:rendered', (event) => {
    const detail = event.detail || {};
    if (detail.slug !== 'promotion') return;

    if (detail.query && detail.query.detail) renderDetail(detail.query.detail);
    else setupList();
  });
})();
