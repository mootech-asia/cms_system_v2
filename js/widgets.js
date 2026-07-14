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
      #qr-rail{position:fixed;right:18px;top:50%;transform:translateY(-56%);z-index:9000;display:flex;flex-direction:column;align-items:center;gap:12px;padding:12px 8px;border-radius:999px;background:linear-gradient(180deg,rgba(203,232,228,.28),rgba(13,24,33,.92));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1.5px solid rgba(152,231,210,.6);box-shadow:0 0 0 1px rgba(203,232,228,.14),0 16px 36px rgba(0,0,0,.55),0 0 30px rgba(152,231,210,.26);opacity:1;transition:transform .18s ease,box-shadow .18s ease}
      #qr-rail:before{content:"";position:absolute;inset:4px;border-radius:inherit;border:1px solid rgba(203,232,228,.16);pointer-events:none}
      #qr-rail:hover,#qr-rail:focus-within{transform:translateY(-56%) translateX(-2px);box-shadow:0 0 0 1px rgba(203,232,228,.22),0 18px 42px rgba(0,0,0,.6),0 0 40px rgba(152,231,210,.38)}
      #qr-rail .qr-title{position:relative;z-index:1;margin:0 0 2px;padding:5px 9px;border-radius:999px;background:linear-gradient(135deg,#CBE8E4,#98E7D2);color:#09221c;font-size:10px;font-weight:900;line-height:1;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 6px 16px rgba(152,231,210,.22)}
      #qr-rail .qr-btn{position:relative;z-index:1;width:62px;height:62px;border-radius:50%;border:1px solid rgba(203,232,228,.72);cursor:pointer;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 25%,#e5fff8 0%,#98E7D2 48%,#47bfa6 100%);color:#09221c;box-shadow:0 10px 22px rgba(0,0,0,.42),0 0 18px rgba(152,231,210,.28),inset 0 1px 0 rgba(255,255,255,.55);transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}
      #qr-rail .qr-btn:hover,#qr-rail .qr-btn:focus-visible{transform:scale(1.08);filter:saturate(1.1);box-shadow:0 12px 26px rgba(0,0,0,.46),0 0 28px rgba(152,231,210,.5),inset 0 1px 0 rgba(255,255,255,.65);outline:none}
      #qr-rail .qr-btn img{width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}
      #qr-rail .qr-btn svg{width:28px;height:28px;stroke-width:2.3}
      #qr-rail .qr-label{position:absolute;right:calc(100% + 14px);top:50%;transform:translateY(-50%) translateX(10px);white-space:nowrap;background:linear-gradient(135deg,#CBE8E4,#98E7D2);color:#09221c;font-weight:900;font-size:15px;padding:11px 18px;border-radius:14px;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;box-shadow:0 12px 30px rgba(0,0,0,.45),0 0 20px rgba(152,231,210,.24)}
      #qr-rail .qr-label:after{content:"";position:absolute;right:-6px;top:50%;width:12px;height:12px;background:#98E7D2;transform:translateY(-50%) rotate(45deg);border-radius:2px}
      #qr-rail .qr-btn:hover .qr-label,#qr-rail .qr-btn:focus-visible .qr-label{opacity:1;transform:translateY(-50%) translateX(0)}
      @media(max-width:768px){#qr-rail{right:8px;top:48%;gap:10px;padding:10px 6px}#qr-rail .qr-title{font-size:9px;padding:5px 7px}#qr-rail .qr-btn{width:52px;height:52px}#qr-rail .qr-btn img{width:37px;height:37px}#qr-rail .qr-btn svg{width:24px;height:24px}#qr-rail .qr-label{font-size:14px;padding:10px 15px}}
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