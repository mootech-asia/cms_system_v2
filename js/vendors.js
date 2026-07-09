// === 內頁:廠商選擇 → 遊戲列表 + 頂部 Back 按鈕 (原生 JS) ===
// 內容區塊完全由此模組建置,確保所有分類頁(含 live)版面一致。
(function () {
  const VENDOR_PAGES = {
    slot: 'Slot Games',
    live: 'Live Casino',
    fish: 'Fishing Games',
    'hot-games': 'Hot Games',
    'mini-games': 'Mini Games',
  };
  const BACK_PAGES = new Set([...Object.keys(VENDOR_PAGES), 'sport', 'promotion']);

  const SLOT_VENDORS = [
    'Pragmatic Play', 'PG Soft', 'CQ9 Gaming', 'Hacksaw Gaming', 'NetEnt', 'Nolimit City',
    'Big Time Gaming', 'Booongo', 'JILI', 'PlayStar', 'Yggdrasil', 'Evoplay',
    'Skywind', 'Spadegaming', "Play'n GO", 'Microgaming', 'Habanero', 'Playtech',
    'Red Tiger', 'Relax Gaming', 'Push Gaming', 'Wazdan', 'Blueprint', 'Quickspin',
    'Thunderkick', 'ELK Studios', 'Playson', 'Kalamba', 'Fantasma', 'Dragoon Soft',
  ];
  const LIVE_VENDORS = [
    'Evolution Gaming', 'Pragmatic Play Live', 'Sexy Gaming', 'Yeebet Live', 'WM Casino', 'Dream Gaming',
    'SA Gaming', 'Ezugi', 'Playtech Live', 'BG Big Gaming', 'Allbet', 'Asia Gaming',
    'eBET', 'VIVO Gaming', 'Microgaming Live', 'AE Sexy', 'OG Casino', 'Green Dragon',
    'N2 Live', 'Ho Gaming', 'Bet Games', 'Skywind Live', 'CQ9 Live', 'PP Live Deluxe',
    'Royal Gaming', 'Lucky Streak', 'Betradar Live', 'Xpro Gaming', 'Winfinity', 'Atmosfera',
  ];
  const vendorsFor = (slug) => (slug === 'live' ? LIVE_VENDORS : SLOT_VENDORS);

  const IMG = '_external/images.unsplash.com/';
  const PHOTOS = [
    'photo-1604028297236-42130c7dcc3a__w-400', 'photo-1604028296525-8304e1a4969f__w-400',
    'photo-1534620780923-1ce0db377c3f__w-400', 'photo-1590336225155-d7e19a3a954f__w-400',
    'photo-1771775606196-70dccc0d9bde__w-400', 'photo-1525018667593-176858caed6a__w-400',
  ];
  const photo = (i) => IMG + PHOTOS[((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length];

  // 由廠商名產生穩定色相與字母章
  function hueOf(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function monoOf(name) {
    const w = name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
    if (w.length >= 2) return (w[0][0] + w[1][0]).toUpperCase();
    return name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
  }

  const BACK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
  const SEARCH_SVG = '<svg class="s-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
  const ENTER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  function injectStyle() {
    if (document.getElementById('vnd-style')) return;
    const s = document.createElement('style');
    s.id = 'vnd-style';
    s.textContent = `
      #inner-back{padding:0 0 18px}
      #inner-back button{display:inline-flex;align-items:center;gap:6px;background:none;border:0;color:#fff;font-size:22px;font-weight:700;cursor:pointer;padding:0}
      #inner-back button:hover{color:#98E7D2}
      #inner-back svg{width:24px;height:24px}
      .vnd-tabs{display:flex;gap:32px;border-bottom:1px solid #263241;margin-bottom:26px}
      .vnd-tabs button{position:relative;padding:0 0 14px;background:none;border:0;color:#9ca3af;font-weight:600;font-size:15px;cursor:pointer}
      .vnd-tabs button.active{color:#98E7D2}
      .vnd-tabs button.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:linear-gradient(90deg,#CBE8E4,#98E7D2)}
      .vnd-head{display:flex;flex-direction:column;gap:16px;margin-bottom:26px}
      @media(min-width:768px){.vnd-head{flex-direction:row;align-items:center;justify-content:space-between}}
      .vnd-head h2{color:#fff;font-size:26px;font-weight:600;margin:0}
      .vnd-sub{margin:6px 0 0;color:#9ca3af;font-size:14px}
      .vnd-sub b{color:#98E7D2}
      .vnd-search{position:relative;display:flex;gap:10px}
      .vnd-search input{background:#1a2128;border:1px solid #374151;border-radius:10px;padding:11px 14px 11px 38px;color:#fff;outline:none;min-width:220px}
      .vnd-search input:focus{border-color:#98E7D2}
      .vnd-search .s-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#9ca3af;width:16px;height:16px}
      .vnd-search .s-btn{background:linear-gradient(90deg,#CBE8E4,#98E7D2);color:#0f1622;border:0;border-radius:10px;padding:0 20px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap}
      .vnd-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:16px}
      @media(min-width:640px){.vnd-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(min-width:1024px){.vnd-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
      .vnd-card{position:relative;display:block;height:140px;border-radius:16px;border:1px solid rgba(152,231,210,.4);overflow:hidden;cursor:pointer;transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease;text-align:left}
      .vnd-card:hover{border-color:#98E7D2;transform:translateY(-3px);box-shadow:0 0 0 1px rgba(152,231,210,.5),0 14px 32px rgba(0,0,0,.5)}
      .vnd-card .vnd-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .35s ease}
      .vnd-card:hover .vnd-bg{transform:scale(1.06)}
      .vnd-card .vnd-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,14,20,.94) 0%,rgba(9,14,20,.78) 38%,rgba(9,14,20,.28) 72%,rgba(9,14,20,.1) 100%)}
      .vnd-card .vnd-arc{position:absolute;right:0;bottom:0;width:75%;height:100%;pointer-events:none;opacity:.7}
      .vnd-card .vnd-name{position:absolute;left:26px;top:50%;transform:translateY(-50%);z-index:1;max-width:62%;color:#fff;font-size:22px;font-weight:800;line-height:1.2;letter-spacing:.01em;text-shadow:0 2px 14px rgba(0,0,0,.75)}
      .vgame-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
      @media(min-width:768px){.vgame-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(min-width:1024px){.vgame-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
      .vgame{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:14px;border:1px solid #2a3441;background:#121926;cursor:pointer;transition:border-color .18s ease,transform .18s ease}
      .vgame:hover{border-color:#98E7D2;transform:translateY(-2px)}
      .vgame img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}
      .vgame:hover img{transform:scale(1.08)}
      .vgame-more{display:flex;justify-content:center;margin-top:28px}
      .vgame-more button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:12px 60px;color:#d1d5db;font-weight:500;cursor:pointer;transition:all .2s}
      .vgame-more button:hover{background:#313E40;color:#AAE5D3;border-color:#AAE5D3}
    `;
    document.head.appendChild(s);
  }

  // ---- 狀態 ----
  let currentSlug = null;
  let currentTab = 'vendor';   // 'vendor' | 'favorites'
  let viewVendor = null;       // 目前檢視的廠商(進遊戲列表)

  function goBack() {
    if (viewVendor) { viewVendor = null; renderVendorGrid(); return; }
    if (window.history.length > 1) window.history.back();
    else location.hash = '#/home';
  }

  function contentInner() {
    const section = document.querySelector('#container section');
    return section && section.querySelector(':scope > div');
  }

  const ARC = '<svg class="vnd-arc" viewBox="0 0 400 200" preserveAspectRatio="none" fill="none"><path d="M-20,210 C120,120 300,150 430,-10" stroke="rgba(152,231,210,.35)" stroke-width="1.5"/><path d="M-20,240 C140,150 320,180 440,20" stroke="rgba(152,231,210,.16)" stroke-width="1.5"/></svg>';

  function vendorCard(name, i) {
    return `<button class="vnd-card" data-vendor="${name}">
        <span class="vnd-bg" style="background-image:url('${photo(i)}')"></span>
        <span class="vnd-shade"></span>
        ${ARC}
        <span class="vnd-name">${name}</span>
      </button>`;
  }

  function scaffold(slug) {
    return `
      <div id="inner-back"><button type="button">${BACK_SVG}<span>Back</span></button></div>
      <div class="vnd-tabs">
        <button data-tab="vendor" class="active">Vendor</button>
        <button data-tab="favorites">Favorites</button>
      </div>
      <div class="vnd-head">
        <div><h2 data-vnd-title>${VENDOR_PAGES[slug]}</h2><p class="vnd-sub" id="vnd-sub" style="display:none"></p></div>
        <div class="vnd-search">
          ${SEARCH_SVG}
          <input type="text" placeholder="Vendor Name">
          <button class="s-btn" type="button">${SEARCH_SVG.replace('s-icon', '')}Search</button>
        </div>
      </div>
      <div class="vnd-grid" data-vnd-grid="1"></div>`;
  }

  function grid() { return document.querySelector('#container [data-vnd-grid="1"]'); }
  function setSub(html) {
    const sub = document.getElementById('vnd-sub');
    if (!sub) return;
    if (html) { sub.innerHTML = html; sub.style.display = ''; } else { sub.style.display = 'none'; sub.innerHTML = ''; }
  }

  function renderVendorGrid() {
    const g = grid();
    if (!g) return;
    g.className = 'vnd-grid';
    g.dataset.vndGrid = '1';
    g.innerHTML = vendorsFor(currentSlug).map((v, i) => vendorCard(v, i)).join('');
    setSub('');
  }

  function renderFavorites() {
    const g = grid();
    if (!g) return;
    const items = [...favs.values()];
    if (!items.length) {
      g.className = '';
      g.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#9ca3af;padding:56px 16px">No favorites yet - tap the star on a game to add one.</div>';
      setSub('');
      return;
    }
    g.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4';
    g.dataset.vndGrid = '1';
    g.innerHTML = items.map(({ vendor, i }) => gameCard(vendor, i)).join('');
    setSub('');
  }

  // 收藏(session 內記憶):id -> {vendor, i}
  const favs = new Map();
  const favId = (vendor, i) => vendor + '||' + i;
  function favStar(id) {
    const on = favs.has(id);
    return `<button class="vnd-fav absolute top-2 right-2 z-10 focus:outline-none bg-black/50 rounded-full p-1.5 transition-colors" data-fav-id="${id}" aria-label="Favourite">
        <svg class="vnd-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${on ? '#98E7D2' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:${on ? '#98E7D2' : '#fff'}">
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
        </svg>
      </button>`;
  }

  function gameCard(vendor, i) {
    // 原本的遊戲卡設計(圖片 + Game Name + Provider + Play Now) + 收藏星號
    return `<div class="bg-[#1a2128] border border-gray-800 rounded-lg overflow-hidden hover:border-[#98E7D2] transition-colors cursor-pointer group">
        <div class="aspect-[4/3] relative overflow-hidden">
          <img src="${photo(i)}" alt="Game Name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
          ${favStar(favId(vendor, i))}
        </div>
        <div class="p-4">
          <h3 class="text-white mb-1 truncate">Game Name</h3>
          <p class="text-gray-400 text-sm mb-3 truncate">${vendor}</p>
          <button class="w-full bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">Play Now</button>
        </div>
      </div>`;
  }

  function renderGameList(vendor) {
    const g = grid();
    if (!g) return;
    g.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4';
    g.dataset.vndGrid = '1';
    g.innerHTML = Array.from({ length: 24 }, (_, i) => gameCard(vendor, i)).join('');
    setSub('');
  }

  function build(slug) {
    const inner = contentInner();
    if (!inner) return;
    currentSlug = slug;
    currentTab = 'vendor';
    viewVendor = null;
    inner.innerHTML = scaffold(slug);
    renderVendorGrid();
  }

  // ---- 事件委派 ----
  document.addEventListener('click', (e) => {
    if (e.target.closest('#inner-back button')) { e.preventDefault(); goBack(); return; }
    if (!currentSlug || !VENDOR_PAGES[currentSlug]) return;

    // 收藏星號切換
    const favBtn = e.target.closest('.vnd-fav');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = favBtn.dataset.favId;
      if (favs.has(id)) favs.delete(id);
      else { const [vendor, i] = id.split('||'); favs.set(id, { vendor, i: Number(i) }); }
      const on = favs.has(id);
      const svg = favBtn.querySelector('svg');
      if (svg) { svg.setAttribute('fill', on ? '#98E7D2' : 'none'); svg.style.color = on ? '#98E7D2' : '#fff'; }
      if (currentTab === 'favorites') renderFavorites();
      return;
    }

    const card = e.target.closest('.vnd-card');
    if (card) {
      viewVendor = card.dataset.vendor;
      renderGameList(viewVendor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const tab = e.target.closest('.vnd-tabs button');
    if (tab) {
      currentTab = tab.dataset.tab;
      viewVendor = null;
      document.querySelectorAll('.vnd-tabs button').forEach((b) => b.classList.toggle('active', b === tab));
      if (currentTab === 'favorites') renderFavorites(); else renderVendorGrid();
      return;
    }
  });

  document.addEventListener('input', (e) => {
    const input = e.target;
    if (!input || input.tagName !== 'INPUT') return;
    if (!currentSlug || !VENDOR_PAGES[currentSlug] || viewVendor || currentTab !== 'vendor') return;
    if (!input.closest('.vnd-search')) return;
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('#container .vnd-card').forEach((c) => {
      c.style.display = (!q || (c.dataset.vendor || '').toLowerCase().includes(q)) ? '' : 'none';
    });
  });

  function injectBackOnly() {
    const inner = contentInner();
    if (!inner) return;
    if (document.getElementById('inner-back')) return;
    const bar = document.createElement('div');
    bar.id = 'inner-back';
    bar.innerHTML = `<button type="button">${BACK_SVG}<span>Back</span></button>`;
    inner.insertBefore(bar, inner.firstChild);
  }

  document.addEventListener('page:rendered', (e) => {
    const slug = e.detail && e.detail.slug;
    if (!slug || !BACK_PAGES.has(slug)) { currentSlug = null; return; }
    injectStyle();
    if (VENDOR_PAGES[slug]) build(slug);
    else { currentSlug = null; injectBackOnly(); }
  });
})();
