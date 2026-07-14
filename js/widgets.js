// === 右側浮動快捷列 (Promo Channel / Live Chat / FAQ) ===
// 固定在畫面右側、垂直略高於中央;每頁皆顯示,掛在 body 上不受換頁影響。
(function () {
  const SEND = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>';
  const HELP = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>';

  function injectStyle() {
    if (document.getElementById('qr-rail-style')) return;
    const s = document.createElement('style');
    s.id = 'qr-rail-style';
    s.textContent = `
      #qr-rail{position:fixed;right:18px;top:50%;transform:translateY(-56%);z-index:9000;display:flex;flex-direction:column;align-items:center;gap:14px;padding:10px 8px;border-radius:999px;background:rgba(16,27,38,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(203,232,228,.2);box-shadow:0 12px 30px rgba(0,0,0,.36);opacity:.92;transition:opacity .18s ease,background-color .18s ease,border-color .18s ease,box-shadow .18s ease}
      #qr-rail:hover,#qr-rail:focus-within{opacity:1;background:rgba(18,31,44,.84);border-color:rgba(203,232,228,.32);box-shadow:0 14px 34px rgba(0,0,0,.42)}
      #qr-rail .qr-title{display:none}
      #qr-rail .qr-btn{position:relative;width:56px;height:56px;border-radius:50%;border:1px solid rgba(203,232,228,.14);cursor:pointer;display:flex;align-items:center;justify-content:center;background:rgba(24,39,58,.78);color:#9ca3af;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);transition:background-color .15s ease,border-color .15s ease,color .15s ease,opacity .15s ease}
      #qr-rail .qr-btn:hover,#qr-rail .qr-btn:focus-visible{background:rgba(31,50,70,.9);border-color:rgba(203,232,228,.34);color:#CBE8E4;outline:none}
      #qr-rail .qr-btn img{width:34px;height:34px;object-fit:contain;opacity:.86;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}
      #qr-rail .qr-btn svg{width:27px;height:27px;stroke-width:2.2;opacity:.88}
      #qr-rail .qr-label{position:absolute;right:calc(100% + 12px);top:50%;transform:translateY(-50%) translateX(6px);white-space:nowrap;background:rgba(24,39,58,.94);border:1px solid rgba(203,232,228,.18);color:#CBE8E4;font-weight:700;font-size:13px;padding:8px 12px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity .16s ease,transform .16s ease;box-shadow:0 10px 24px rgba(0,0,0,.35)}
      #qr-rail .qr-label:after{content:"";position:absolute;right:-5px;top:50%;width:10px;height:10px;background:rgba(24,39,58,.94);border-right:1px solid rgba(203,232,228,.18);border-top:1px solid rgba(203,232,228,.18);transform:translateY(-50%) rotate(45deg);border-radius:1px}
      #qr-rail .qr-btn:hover .qr-label,#qr-rail .qr-btn:focus-visible .qr-label{opacity:1;transform:translateY(-50%) translateX(0)}
      @media(max-width:768px){#qr-rail{right:8px;top:48%;gap:11px;padding:9px 6px}#qr-rail .qr-btn{width:50px;height:50px}#qr-rail .qr-btn img{width:31px;height:31px}#qr-rail .qr-btn svg{width:24px;height:24px}#qr-rail .qr-label{font-size:12px;padding:7px 10px}}
    `;
    document.head.appendChild(s);
  }

  function makeBtn({ label, inner, onClick }) {
    const b = document.createElement('button');
    b.className = 'qr-btn';
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = inner + `<span class="qr-label">${label}</span>`;
    b.addEventListener('click', onClick);
    return b;
  }

  function build() {
    if (document.getElementById('qr-rail')) return;
    injectStyle();
    const rail = document.createElement('div');
    rail.id = 'qr-rail';

    const title = document.createElement('div');
    title.className = 'qr-title';
    title.textContent = 'Quick';
    rail.appendChild(title);

    rail.appendChild(makeBtn({
      label: 'Promo Channel',
      inner: '<img src="assets/logo.png" alt="">',
      onClick: () => { location.hash = '#/promotion'; },
    }));
    rail.appendChild(makeBtn({
      label: 'Live Chat',
      inner: SEND,
      onClick: () => { if (window.openSupportModal) window.openSupportModal(); },
    }));
    rail.appendChild(makeBtn({
      label: 'FAQ',
      inner: HELP,
      onClick: () => { location.hash = '#/about?tab=faq'; },
    }));

    document.body.appendChild(rail);

    // 只在首頁顯示浮動快捷列,其餘頁面隱藏
    const sync = (slug) => { rail.style.display = slug === 'home' ? '' : 'none'; };
    const cur = (location.hash.replace(/^#\/?/, '').split('?')[0]) || 'home';
    sync(cur);
    document.addEventListener('page:rendered', (e) => { if (e.detail) sync(e.detail.slug); });
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();