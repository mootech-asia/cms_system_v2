// === About Us 頁:分頁切換 + FAQ 手風琴 (原生 JS) ===
(function () {
  function injectStyle() {
    if (document.getElementById('about-style')) return;
    const s = document.createElement('style');
    s.id = 'about-style';
    s.textContent = `
      #about-root .ab-heading{color:#fff;font-size:28px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding-bottom:14px;margin:0 0 22px;border-bottom:2px solid transparent;border-image:linear-gradient(90deg,#CBE8E4,#98E7D2) 1}
      #about-root .ab-tabs{display:flex;flex-wrap:wrap;gap:8px 26px;border-bottom:1px solid #263241;margin-bottom:28px}
      #about-root .ab-tab{position:relative;padding:0 0 14px;background:none;border:0;color:#9ca3af;font-weight:600;font-size:15px;cursor:pointer}
      #about-root .ab-tab:hover{color:#d1d5db}
      #about-root .ab-tab.active{color:#98E7D2}
      #about-root .ab-tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:linear-gradient(90deg,#CBE8E4,#98E7D2)}
      #about-root .ab-panel{display:none}
      #about-root .ab-panel.active{display:block}
      #about-root .ab-card{background:#161e2c;border:1px solid #212b3d;border-radius:12px;padding:22px 24px;margin-bottom:18px}
      #about-root .ab-card-title{color:#98E7D2;font-size:17px;font-weight:700;margin:0 0 12px}
      #about-root .ab-card-body p{color:#c3cbd6;font-size:14px;line-height:1.75;margin:0 0 14px}
      #about-root .ab-card-body p:last-child{margin-bottom:0}
      #about-root .faq-group{color:#98E7D2;font-size:16px;font-weight:700;margin:26px 0 14px}
      #about-root .faq-group:first-child{margin-top:0}
      #about-root .faq-item{background:#161e2c;border:1px solid #212b3d;border-radius:12px;margin-bottom:14px;overflow:hidden}
      #about-root .faq-q{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;text-align:left;padding:18px 20px;background:none;border:0;color:#fff;font-size:15px;font-weight:700;cursor:pointer}
      #about-root .faq-chev{width:20px;height:20px;flex-shrink:0;color:#9ca3af;transition:transform .2s ease}
      #about-root .faq-item.open .faq-chev{transform:rotate(180deg)}
      #about-root .faq-a{max-height:0;overflow:hidden;transition:max-height .25s ease;padding:0 20px}
      #about-root .faq-item.open .faq-a{max-height:600px;padding:0 20px 18px}
      #about-root .faq-a p{color:#c3cbd6;font-size:14px;line-height:1.75;margin:0 0 12px}
      #about-root .faq-a p:last-child{margin-bottom:0}
    `;
    document.head.appendChild(s);
  }

  function activate(tab) {
    const root = document.getElementById('about-root');
    if (!root) return;
    const tabs = [...root.querySelectorAll('.ab-tab')];
    const valid = tabs.some((t) => t.dataset.tab === tab) ? tab : 'support';
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === valid));
    root.querySelectorAll('.ab-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === valid));
  }

  document.addEventListener('page:rendered', (e) => {
    if (!e.detail || e.detail.slug !== 'about') return;
    injectStyle();
    activate((e.detail.query && e.detail.query.tab) || 'support');
  });

  document.addEventListener('click', (e) => {
    const tab = e.target.closest && e.target.closest('#about-root .ab-tab');
    if (tab) { activate(tab.dataset.tab); return; }
    const q = e.target.closest && e.target.closest('#about-root .faq-q');
    if (q) { q.parentElement.classList.toggle('open'); }
  });
})();
