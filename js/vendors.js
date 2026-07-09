// === 內頁:廠商選擇 → 遊戲列表 + 頂部 Back 按鈕 (原生 JS) ===
(function () {
  // 走「先選廠商」流程的遊戲分類頁
  const VENDOR_PAGES = {
    slot: 'Slot Games',
    live: 'Live Games',
    fish: 'Fish Games',
    'hot-games': 'Hot Games',
    'mini-games': 'Mini Games',
  };
  // 需要頂部 Back 按鈕的內頁(含 sport / promotion)
  const BACK_PAGES = new Set([...Object.keys(VENDOR_PAGES), 'sport', 'promotion']);

  const VENDORS = [
    'Pragmatic Play', 'PG Soft', 'CQ9 Gaming', 'Hacksaw Gaming', 'NetEnt', 'Nolimit City',
    'Big Time Gaming', 'Booongo', 'JILI', 'PlayStar', 'Yggdrasil', 'Evoplay',
    'Skywind', 'Spadegaming', "Play'n GO", 'Microgaming', 'Habanero', 'Playtech',
    'Red Tiger', 'Relax Gaming', 'Push Gaming', 'Wazdan', 'Blueprint', 'Quickspin',
    'Thunderkick', 'ELK Studios', 'Playson', 'Kalamba', 'Fantasma', 'Dragoon Soft',
  ];

  const IMG = '_external/images.unsplash.com/';
  const PHOTOS = [
    'photo-1604028297236-42130c7dcc3a__w-400', 'photo-1604028296525-8304e1a4969f__w-400',
    'photo-1534620780923-1ce0db377c3f__w-400', 'photo-1590336225155-d7e19a3a954f__w-400',
    'photo-1771775606196-70dccc0d9bde__w-400', 'photo-1525018667593-176858caed6a__w-400',
  ];
  const photo = (i) => IMG + PHOTOS[((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length];

  const ARC = '<svg class="vnd-arc" viewBox="0 0 400 200" preserveAspectRatio="none" fill="none"><path d="M-20,210 C120,120 300,150 430,-10" stroke="rgba(152,231,210,.35)" stroke-width="1.5"/><path d="M-20,240 C140,150 320,180 440,20" stroke="rgba(152,231,210,.18)" stroke-width="1.5"/></svg>';

  function injectStyle() {
    if (document.getElementById('vnd-style')) return;
    const s = document.createElement('style');
    s.id = 'vnd-style';
    s.textContent = `
      #inner-back{padding:0 0 18px}
      #inner-back button{display:inline-flex;align-items:center;gap:6px;background:none;border:0;color:#fff;font-size:22px;font-weight:700;cursor:pointer;padding:0}
      #inner-back button:hover{color:#98E7D2}
      #inner-back svg{width:24px;height:24px}
      .vnd-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:16px}
      @media(min-width:640px){.vnd-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(min-width:1024px){.vnd-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
      .vnd-card{position:relative;display:block;width:100%;height:130px;overflow:hidden;border-radius:14px;border:1px solid #2a3441;background:radial-gradient(120% 140% at 100% 50%,#243244 0%,#141d2a 45%,#0d1420 100%);cursor:pointer;transition:border-color .18s ease,transform .18s ease}
      .vnd-card:hover{border-color:#98E7D2;transform:translateY(-2px)}
      .vnd-card .vnd-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.16;filter:grayscale(.3)}
      .vnd-card .vnd-arc{position:absolute;right:0;top:0;width:70%;height:100%;pointer-events:none}
      .vnd-card .vnd-photo{position:absolute;right:0;bottom:0;height:118%;width:52%;object-fit:cover;object-position:center top;-webkit-mask-image:linear-gradient(90deg,transparent,#000 55%);mask-image:linear-gradient(90deg,transparent,#000 55%);opacity:.85}
      .vnd-card .vnd-name{position:absolute;left:22px;top:50%;transform:translateY(-50%);max-width:55%;color:#fff;font-size:20px;font-weight:800;letter-spacing:.02em;text-shadow:0 2px 12px rgba(0,0,0,.6);z-index:1}
      .vgame-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
      @media(min-width:768px){.vgame-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(min-width:1024px){.vgame-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
      .vgame{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:14px;border:1px solid #2a3441;background:#121926;cursor:pointer;transition:border-color .18s ease,transform .18s ease}
      .vgame:hover{border-color:#98E7D2;transform:translateY(-2px)}
      .vgame img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}
      .vgame:hover img{transform:scale(1.08)}
      .vnd-sub{margin:0 0 20px;color:#9ca3af;font-size:14px}
      .vnd-sub b{color:#98E7D2}
      .vgame-more{display:flex;justify-content:center;margin-top:24px}
      .vgame-more button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:12px 60px;color:#d1d5db;font-weight:500;cursor:pointer;transition:all .2s}
      .vgame-more button:hover{background:#313E40;color:#AAE5D3;border-color:#AAE5D3}
    `;
    document.head.appendChild(s);
  }

  const BACK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';

  // 每頁的狀態:是否正在看某廠商的遊戲列表
  let viewVendor = null;

  function goBack() {
    if (viewVendor) { viewVendor = null; renderVendorGrid(); return; }
    if (window.history.length > 1) window.history.back();
    else location.hash = '#/home';
  }

  function injectBack() {
    // 插進第一個深色內容 <section> 的內層 .container,位在 tabs/title 上方
    const section = document.querySelector('#container section');
    const inner = section && section.querySelector(':scope > div');
    if (!inner) return;
    const old = document.getElementById('inner-back');
    if (old) old.remove();
    const bar = document.createElement('div');
    bar.id = 'inner-back';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = BACK_SVG + '<span>Back</span>';
    btn.addEventListener('click', goBack);
    bar.appendChild(btn);
    inner.insertBefore(bar, inner.firstChild);
  }

  // 找到內容區塊裡的遊戲卡格子
  function findGrid() {
    return document.querySelector('#container [data-vnd-grid="1"]')
      || [...document.querySelectorAll('#container .grid')].find((g) => g.querySelector('.group'));
  }
  function findTitleRow() {
    const h2 = [...document.querySelectorAll('#container h2')].find((h) => /Games$/.test((h.textContent || '').trim()));
    return h2 ? h2.parentElement : null;
  }

  let currentSlug = null;

  function renderVendorGrid() {
    const grid = findGrid();
    if (!grid) return;
    grid.dataset.vndGrid = '1';
    grid.className = 'vnd-grid';
    grid.innerHTML = VENDORS.map((name, i) => `
      <button class="vnd-card" data-vendor="${name}">
        <span class="vnd-bg" style="background-image:url('${photo(i + 2)}')"></span>
        ${ARC}
        <img class="vnd-photo" src="${photo(i)}" alt="">
        <span class="vnd-name">${name}</span>
      </button>`).join('');
    // 標題還原
    const h2 = [...document.querySelectorAll('#container h2')].find((h) => h.dataset.vndTitle === '1');
    if (h2) h2.textContent = VENDOR_PAGES[currentSlug] || h2.textContent;
    const sub = document.getElementById('vnd-sub');
    if (sub) sub.remove();
  }

  function renderGameList(vendor) {
    const grid = findGrid();
    if (!grid) return;
    grid.dataset.vndGrid = '1';
    grid.className = 'vgame-grid';
    const n = 24;
    grid.innerHTML = Array.from({ length: n }, (_, i) => `
      <div class="vgame" title="${vendor}"><img src="${photo(i)}" alt="${vendor} game"></div>`).join('');
    // 標題顯示廠商 + 小字
    const h2 = [...document.querySelectorAll('#container h2')].find((h) => h.dataset.vndTitle === '1');
    if (h2) {
      h2.textContent = (VENDOR_PAGES[currentSlug] || 'Games');
      if (!document.getElementById('vnd-sub')) {
        const p = document.createElement('p');
        p.id = 'vnd-sub';
        p.className = 'vnd-sub';
        p.innerHTML = `<b>${vendor}</b> — tap Back to choose another vendor`;
        h2.insertAdjacentElement('afterend', p);
      } else {
        document.getElementById('vnd-sub').innerHTML = `<b>${vendor}</b> — tap Back to choose another vendor`;
      }
    }
  }

  function renderFavoritesEmpty() {
    const grid = findGrid();
    if (!grid) return;
    grid.dataset.vndGrid = '1';
    grid.className = '';
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#9ca3af;padding:56px 16px">No favorites yet - open a vendor to start playing.</div>';
    const sub = document.getElementById('vnd-sub');
    if (sub) sub.remove();
  }

  function clearStrayLoadMore() {
    [...document.querySelectorAll('#container button')].forEach((b) => {
      if (!/load more/i.test((b.textContent || '').trim())) return;
      const wrap = b.parentElement;
      if (wrap && wrap.children.length === 1 && !wrap.classList.contains('vgame-more')) wrap.remove();
    });
  }

  function setupVendorPage(slug) {
    currentSlug = slug;
    viewVendor = null;
    clearStrayLoadMore();
    const h2 = [...document.querySelectorAll('#container h2')].find((h) => /Games$/.test((h.textContent || '').trim()));
    if (h2) h2.dataset.vndTitle = '1';
    // 搜尋框改成廠商搜尋
    const search = [...document.querySelectorAll('#container input')].find((i) => /search/i.test(i.getAttribute('placeholder') || ''));
    if (search) { search.placeholder = 'Vendor Name'; search.dataset.vndSearch = '1'; }
    // 把 Filter 按鈕文字改成 Search
    const filterBtn = [...document.querySelectorAll('#container button')].find((b) => (b.textContent || '').trim() === 'Filter');
    if (filterBtn) filterBtn.querySelector('span') ? (filterBtn.querySelector('span').textContent = 'Search') : (filterBtn.lastChild.textContent = 'Search');
    renderVendorGrid();
  }

  // 事件:廠商卡點擊、廠商搜尋、遊戲點擊
  document.addEventListener('click', (e) => {
    if (!currentSlug || !VENDOR_PAGES[currentSlug]) return;
    const card = e.target.closest && e.target.closest('.vnd-card');
    if (card) {
      viewVendor = card.dataset.vendor;
      renderGameList(viewVendor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Vendor / Favorites 分頁切換
    const tabBtn = e.target.closest('.border-b button');
    if (tabBtn) {
      const t = (tabBtn.textContent || '').trim();
      if (t === 'Vendor') { viewVendor = null; renderVendorGrid(); }
      else if (t === 'Favorites') { viewVendor = null; renderFavoritesEmpty(); }
    }
  });
  document.addEventListener('input', (e) => {
    const input = e.target;
    if (!input || !input.dataset || input.dataset.vndSearch !== '1' || viewVendor) return;
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('#container .vnd-card').forEach((c) => {
      c.style.display = (!q || (c.dataset.vendor || '').toLowerCase().includes(q)) ? '' : 'none';
    });
  });

  document.addEventListener('page:rendered', (e) => {
    const slug = e.detail && e.detail.slug;
    if (!slug || !BACK_PAGES.has(slug)) return;
    injectStyle();
    injectBack();
    if (VENDOR_PAGES[slug]) setupVendorPage(slug);
  });
})();
