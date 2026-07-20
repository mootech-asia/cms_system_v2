/**
 * WIN100 factory static site — behaviour-layer seed data.
 *
 * Ported verbatim (values copied, not referenced) from the frontend/ Vue source
 * so the vanilla JS behaviour layer (site.js) can rebuild markup that only
 * exists in the live Nuxt app's reactive state and was never present in the
 * prerendered static HTML (e.g. non-active carousel slides, non-active tab
 * panels, closed dropdown/modal contents).
 *
 * Sources (read-only references, nothing in frontend/ was modified):
 *   - frontend/app/config/mock/home.ts        (banners, miniGamesTabs, miniGamesImgs)
 *   - frontend/app/config/operational-media.ts (HOME/LIVE_CASINO/CATEGORY_VENDOR media)
 *   - frontend/app/composables/useLocale.ts    (zh copy — the site's default/baked locale)
 *   - frontend/app/components/VendorBrowser.vue (SLOT_VENDORS / LIVE_VENDORS / LIVE_GAME_NAMES)
 *   - frontend/app/components/AppIcon.vue      (icon path data)
 *   - frontend/app/pages/sport.vue             (MATCHES)
 *   - frontend/app/stores/bank.ts              (demo bound accounts)
 *   - frontend/app/pages/banking-details.vue   (DEMO_BANKS)
 *
 * Plain global script (no ESM, no fetch) — exposes window.WIN100_DATA.
 */
(function (window) {
  'use strict';

  function pexels(id) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=1920';
  }

  // ---- Skins (frontend/app/utils/themes.ts THEME_KEYS / THEME_LABELS) --------
  var THEME_KEYS = ['win100', 'aurora', 'noir', 'fashion-blue', 'rose-graphite', 'cyber-green'];
  var THEME_LABELS = {
    win100: 'Emerald',
    aurora: 'Aurora',
    noir: 'Noir Gold',
    'fashion-blue': 'Fashion Blue',
    'rose-graphite': 'Rose Graphite',
    'cyber-green': 'Cyber Green',
  };

  // ---- Icons (frontend/app/components/AppIcon.vue) ---------------------------
  var ICONS = {
    globe: '<circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>',
    house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
    gamepad2: '<line x1="6" x2="10" y1="11" y2="11"></line><line x1="8" x2="8" y1="9" y2="13"></line><line x1="15" x2="15.01" y1="12" y2="12"></line><line x1="18" x2="18.01" y1="10" y2="10"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"></path><path d="M18 12v.5"></path><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"></path><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"></path><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"></path><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"></path>',
    cherry: '<path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"></path><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"></path><path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12"></path><path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z"></path>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    'chevron-down': '<path d="m6 9 6 6 6-6"></path>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>',
    grid: '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
    download: '<path d="M12 17V3"></path><path d="m6 11 6 6 6-6"></path><path d="M19 21H5"></path>',
    upload: '<path d="M12 21V7"></path><path d="m6 11 6-6 6 6"></path><path d="M5 3h14"></path>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
    trend: '<path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M7 15h4"></path>',
    bitcoin: '<circle cx="12" cy="12" r="9"></circle><path d="M9.5 8h3.8a2.2 2.2 0 0 1 0 4.4H9.5z"></path><path d="M9.5 12.4h4.2a2.3 2.3 0 0 1 0 4.6H9.5z"></path><path d="M9.5 6v12M11 4.5V6M14 4.5V6M11 18v1.5M14 18v1.5"></path>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle>',
    search: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>',
    check: '<path d="M20 6 9 17l-5-5"></path>',
    pencil: '<path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L4 16l-1 5 5-1Z"></path><path d="m15 5 4 4"></path>',
    bank: '<rect x="2" y="7" width="16" height="11" rx="2"></rect><path d="M2 11h16"></path><circle cx="8" cy="14.5" r="1.4"></circle><path d="M18 9.5l3.6 1.5a1 1 0 0 1 .4 1.4l-2 3.4"></path>',
    'log-out': '<path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>',
    back: '<path d="m15 18-6-6 6-6"></path>',
  };

  // ---- zh copy actually baked into the static pages (frontend/app/composables/useLocale.ts) --
  var T = {
    back: '返回',
    playNow: '立即遊玩',
    loadMore: '載入更多',
    liveDealer: '真人荷官',
    liveStudio: '真人館',
    gamePlaceholder: '遊戲名稱',
    searchVendor: '廠商名稱',
    searchGame: '搜尋遊戲',
    home: '首頁',
    hotGames: '熱門遊戲',
    sports: '體育',
    live: '真人娛樂',
    slots: '老虎機',
    fish: '捕魚',
    miniGames: '迷你遊戲',
    promotion: '優惠活動',
    browse: '瀏覽',
    deposit: '儲值',
    member: '會員',
    login: '登入',
    register: '註冊',
    logout: '登出',
    accountView: '查看會員中心',
    accountId: '帳號',
    accountBalance: '餘額',
    accountPoints: '點數',
    notAvailable: '此靜態預覽尚未包含此內容',
  };

  // ---- composables/useLocale.ts APP_LOCALES (only the zh copy above was ever
  // ported/baked into these pages — see T above; site.js's locale switcher
  // shows all 4 as options but only zh actually has translated content, so
  // picking en/ko/th surfaces T.notAvailable instead of silently no-op'ing) --
  var LOCALES = [
    { code: 'zh', short: '中文', label: '中文' },
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'ko', short: '한국어', label: '한국어' },
    { code: 'th', short: 'ไทย', label: 'ภาษาไทย' },
  ];

  // ---- pages/promotion.vue PROMOS[] (Detail button destination content) ------
  var PROMOS = [
    { id: 'riobet-casino', title: 'RioBet Casino', headline: 'Unlimited Daily Bonus', primary: 'Sports / Slots', primaryRate: '5%', secondary: 'Casino / Mini Games', secondaryRate: '3%', img: pexels(7594128), focalPoint: '50% 52%' },
    { id: 'bitstarz-casino', title: 'BitStarz Casino', headline: 'Weekly Reload Bonus', primary: 'Slots', primaryRate: '50%', secondary: 'Live Casino', secondaryRate: '10%', img: pexels(29825627), focalPoint: '54% 50%' },
    { id: 'icecasino', title: 'IceCasino', headline: 'Member Exclusive Bonus', primary: 'Hot Games', primaryRate: '30%', secondary: 'Mini Games', secondaryRate: '8%', img: pexels(32100316), focalPoint: '72% 28%' },
    { id: 'gamdom-casino', title: 'Gamdom Casino', headline: 'Daily Cashback Boost', primary: 'Sports', primaryRate: '15%', secondary: 'Fish Games', secondaryRate: '6%', img: pexels(27568815), focalPoint: '62% 50%' },
  ];

  // ---- deposit.vue gateways[] (Provider A-D → available payment method count) --
  var DEPOSIT_GATEWAYS = [
    { id: 'a', methodCount: 4 },
    { id: 'b', methodCount: 3 },
    { id: 'c', methodCount: 2 },
    { id: 'd', methodCount: 1 },
  ];

  // ---- AppBanner (frontend/app/config/mock/home.ts + useLocale.ts bannerCopy.zh) ----
  // Order matches the source `banners` array (id 2, 4, 1, 3) — index 0 is what
  // the SSR snapshot shows by default (data-campaign="2").
  var BANNERS = [
    {
      id: 2, badge: '首存禮遇', title: '儲值狂熱', highlight: '100%',
      sub: '迎新加碼 · 快速出款 · 限時開放', cta: '立即儲值',
      img: pexels(32100316), focalPoint: '76% 28%',
    },
    {
      id: 4, badge: '2026 世界足球', title: '榮耀之路', highlight: '2026',
      sub: '即時賠率 · 賽事中心 · 每球必爭', cta: '查看賽事',
      img: pexels(30651230), focalPoint: '60% 52%',
    },
    {
      id: 1, badge: '電競週', title: '戰力升級', highlight: '30%',
      sub: '每週遊戲返水 · 限時開放', cta: '進入競技場',
      img: pexels(7862503), focalPoint: '68% 50%',
    },
    {
      id: 3, badge: '智慧錢包', title: 'USDT', highlight: '+8%',
      sub: '快速入金 · 安全結算 · 24/7 存取', cta: '立即儲值',
      img: pexels(36755611), focalPoint: '70% 48%',
    },
  ];

  // ---- MiniGamesGrid (homepage rail tabs) — frontend/app/stores/content.ts catalogSeed --
  // mini/slot share the same 6-file local image pool cycling by index;
  // live cycles the 6 Pexels "tables" media (identical pool VendorBrowser uses for kind=live).
  var MINI_IMG_POOL = [
    '_external/images.unsplash.com/photo-1534620780923-1ce0db377c3f__w-200',
    '_external/images.unsplash.com/photo-1604028297236-42130c7dcc3a__w-200',
    '_external/images.unsplash.com/photo-1604028296525-8304e1a4969f__w-200',
    '_external/images.unsplash.com/photo-1771775606196-70dccc0d9bde__w-200',
    '_external/images.unsplash.com/photo-1525018667593-176858caed6a__w-200',
    '_external/images.unsplash.com/photo-1590336225155-d7e19a3a954f__w-200',
  ];
  var LIVE_TABLES = [
    { image: pexels(7594348), focalPoint: '42% 50%' },
    { image: pexels(6664128), focalPoint: '50% 48%' },
    { image: pexels(7594254), focalPoint: '68% 48%' },
    { image: pexels(6664131), focalPoint: '50% 38%' },
    { image: pexels(7594310), focalPoint: '55% 40%' },
    { image: pexels(7594183), focalPoint: '50% 50%' },
  ];
  var MINI_NAMES = {
    mini: ['Mega Fortune', 'Starburst', 'Limbo', 'Mines', 'Plinko', 'Dice', 'Tower', 'Keno', 'Hilo', 'Wheel', 'Crash', 'Coin Flip', 'Rocket', 'Caves', 'Video Poker', 'Scratch Card', 'Aviator', 'Spaceman', 'JetX', 'Balloon', 'Penalty Shoot-out', 'Goal Rush', 'Cricket Crash', 'Zeppelin', 'Magic Keno', 'Turbo Mines', 'Royal Dice', 'Lucky Wheel', 'Neon Tower', 'Bomb Squad', 'Cave Dash', 'Gem Flip', 'Star Rocket', 'Hyper Plinko', 'Double Hilo', 'Quantum Crash', 'Aqua Dice', 'Vegas Coin', 'Sky Drop', 'Loot Box', 'Chicken Road', 'Fortune Rings', 'Blast Off', 'Mine Runner', 'Pixel Keno', 'Flip Master', 'Rocket Queen', 'Cosmic Caves', 'Turbo Tower', 'Golden Plinko'],
    slot: ['Gates of Olympus', 'Sweet Bonanza', 'Book of Dead', 'Starburst', 'Wolf Gold', 'Mega Moolah', 'Gonzo Quest', 'Dead or Alive', 'Sugar Rush', 'Big Bass', 'Money Train', 'Wild West Gold', 'Gates of Valhalla', 'Big Bass Bonanza', 'Sugar Rush 1000', 'Fruit Party', 'The Dog House', 'Madame Destiny', 'Wild Wild Riches', 'Floating Dragon', 'Buffalo King', 'Great Rhino', 'John Hunter', 'Aztec Gems', 'Fire Strike', 'Chilli Heat', 'Mustang Gold', 'Wolf Legend', 'Book of Ra', 'Legacy of Dead', 'Rise of Olympus', 'Moon Princess', 'Reactoonz', 'Fire Joker', 'Golden Ticket', 'Honey Rush', 'Gemix', 'Jammin Jars', 'Razor Shark', 'Wild Flower', 'Money Cart', 'Stormforged', 'Book of Shadows', 'San Quentin', 'Mental', 'Tombstone', 'Fire in the Hole', 'Punk Rocker', 'Warrior Graveyard', 'Das xBoot'],
    live: ['Lightning Roulette', 'Crazy Time', 'Mega Wheel', 'Baccarat', 'Dragon Tiger', 'Monopoly Live', 'Blackjack VIP', 'Sic Bo', 'Dream Catcher', 'Speed Roulette', 'Football Studio', 'Andar Bahar', 'Crazy Coin Flip', 'XXXtreme Lightning', 'Gold Bar Roulette', 'Red Door Roulette', 'Funky Time', 'Video Poker Live', 'Bac Bo', 'Super Sic Bo', 'Cash or Crash', 'Gonzo Treasure Hunt', 'Deal or No Deal', 'Monopoly Big Baller', 'Sweet Bonanza CandyLand', 'Adventures Beyond', 'Immersive Roulette', 'Auto Roulette', 'Speed Baccarat', 'No Commission Bac', 'Dragon Roulette', 'Emperor Baccarat', 'Golden Wealth', 'Lightning Baccarat', 'Lightning Dice', 'Lightning Storm', 'Peek Baccarat', 'Prosperity Tree', 'Fortune Baccarat', 'Super Andar Bahar', 'Teen Patti Live', "Casino Hold'em", 'Three Card Poker', 'Ultimate Texas', 'Caribbean Stud', 'Side Bet City', 'Football Studio Dice', 'Fan Tan Live', 'Extreme Texas', 'Power Blackjack'],
  };
  var MINI_ROUTES = { mini: 'mini-games.html', slot: 'slot.html', live: 'live.html' };

  // ---- VendorBrowser (frontend/app/components/VendorBrowser.vue) -------------
  var SLOT_VENDORS = ['Pragmatic Play', 'PG Soft', 'CQ9 Gaming', 'Hacksaw Gaming', 'NetEnt', 'Nolimit City', 'Big Time Gaming', 'Booongo', 'JILI', 'PlayStar', 'Yggdrasil', 'Evoplay', 'Skywind', 'Spadegaming', "Play'n GO", 'Microgaming', 'Habanero', 'Playtech', 'Red Tiger', 'Relax Gaming', 'Push Gaming', 'Wazdan', 'Blueprint', 'Quickspin', 'Thunderkick', 'ELK Studios', 'Playson', 'Kalamba', 'Fantasma', 'Dragoon Soft'];
  var LIVE_VENDORS = ['Evolution Gaming', 'Pragmatic Play Live', 'Sexy Gaming', 'Yeebet Live', 'WM Casino', 'Dream Gaming', 'SA Gaming', 'Ezugi', 'Playtech Live', 'BG Big Gaming', 'Allbet', 'Asia Gaming', 'eBET', 'VIVO Gaming', 'Microgaming Live', 'AE Sexy', 'OG Casino', 'Green Dragon', 'N2 Live', 'Ho Gaming', 'Bet Games', 'Skywind Live', 'CQ9 Live', 'PP Live Deluxe', 'Royal Gaming', 'Lucky Streak', 'Betradar Live', 'Xpro Gaming', 'Winfinity', 'Atmosfera'];
  var LIVE_GAME_NAMES = ['Lightning Roulette', 'VIP Baccarat', 'Speed Blackjack', 'Dragon Tiger', 'Casino Hold’em', 'Immersive Roulette', 'No Commission Baccarat', 'Sic Bo Live', 'Power Blackjack', 'Golden Roulette', 'Baccarat Control Squeeze', 'Three Card Poker'];
  var VENDOR_MEDIA = {
    live: LIVE_TABLES,
    slot: [
      { image: pexels(29825627), focalPoint: '58% 50%' },
      { image: pexels(7594128), focalPoint: '50% 52%' },
      { image: pexels(7594183), focalPoint: '50% 50%' },
      { image: pexels(7594310), focalPoint: '55% 40%' },
      { image: pexels(6664128), focalPoint: '50% 48%' },
      { image: pexels(27568815), focalPoint: '62% 50%' },
    ],
    fish: [
      { image: pexels(5955036), focalPoint: '58% 48%' },
      { image: pexels(32824677), focalPoint: '50% 52%' },
      { image: pexels(13070714), focalPoint: '54% 50%' },
      { image: pexels(18528202), focalPoint: '46% 52%' },
    ],
    'mini-games': [
      { image: pexels(27568815), focalPoint: '62% 50%' },
      { image: pexels(7561836), focalPoint: '60% 46%' },
      { image: pexels(7862503), focalPoint: '68% 50%' },
      { image: pexels(36755611), focalPoint: '70% 48%' },
    ],
  };

  // ---- sport.vue MATCHES (Load more cycles the same 8, up to 3 extra loads) --
  var SPORT_MATCHES = [
    { league: 'Premier League', home: { abbr: 'MU', name: 'Manchester United' }, away: { abbr: 'LIV', name: 'Liverpool' }, score: '2 - 1', time: "Live 67'" },
    { league: 'NBA', home: { abbr: 'LAL', name: 'Lakers' }, away: { abbr: 'GSW', name: 'Warriors' }, score: '98 - 105', time: 'Live Q3' },
    { league: 'La Liga', home: { abbr: 'RMA', name: 'Real Madrid' }, away: { abbr: 'FCB', name: 'Barcelona' }, score: '1 - 1', time: "Live 82'" },
    { league: 'MLB', home: { abbr: 'NYY', name: 'Yankees' }, away: { abbr: 'BOS', name: 'Red Sox' }, score: '4 - 3', time: 'Live 7th' },
    { league: 'Champions League', home: { abbr: 'PSG', name: 'PSG' }, away: { abbr: 'FCB', name: 'Bayern Munich' }, score: '3 - 2', time: "Live 55'" },
    { league: 'NBA', home: { abbr: 'BOS', name: 'Celtics' }, away: { abbr: 'MIA', name: 'Heat' }, score: '102 - 99', time: 'Live Q4' },
    { league: 'Premier League', home: { abbr: 'ARS', name: 'Arsenal' }, away: { abbr: 'CHE', name: 'Chelsea' }, score: '1 - 0', time: "Live 78'" },
    { league: 'Serie A', home: { abbr: 'JUV', name: 'Juventus' }, away: { abbr: 'INT', name: 'Inter Milan' }, score: '0 - 0', time: "Live 23'" },
  ];

  // ---- banking-details.vue DEMO_BANKS -----------------------------------------
  var DEMO_BANKS = ['Bank of America', 'Shinhan Bank', 'KB Kookmin Bank', 'Woori Bank', 'NH Nonghyup Bank', 'Hana Bank', '산림조합중앙회 Bank'];

  // ---- stores/bank.ts default seeded accounts (account.html / withdrawal.html carousel) --
  var BANK_ACCOUNTS = [
    { bank: 'KB Bank', num: '**** **** **** 1234', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-08-14' },
    { bank: 'Shinhan Bank', num: '**** **** **** 5678', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-09-05' },
    { bank: 'Woori Bank', num: '**** **** **** 9012', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-10-02' },
  ];

  // ---- AppHeader.vue nav[] (label already zh via t(), href → flattened static filenames) --
  var NAV_LINKS = [
    { label: T.home, href: 'index.html', icon: 'house' },
    { label: T.hotGames, href: 'hot-games.html', icon: 'flame' },
    { label: T.sports, href: 'sport.html', icon: 'trophy' },
    { label: T.live, href: 'live.html', icon: 'video' },
    { label: T.slots, href: 'slot.html', icon: 'cherry' },
    { label: T.fish, href: 'fish.html', icon: 'fish' },
    { label: T.miniGames, href: 'mini-games.html', icon: 'gamepad2' },
    { label: T.promotion, href: 'promotion.html', icon: 'gift' },
  ];

  // ---- MemberMenuDrawer.vue links[] (Browse button on the mobile bottom nav) --
  var MEMBER_MENU_LINKS = [
    { label: 'Account Overview', href: 'account.html', icon: 'grid' },
    { label: 'Deposit', href: 'deposit.html', icon: 'download' },
    { label: 'Withdrawal', href: 'withdrawal.html', icon: 'upload' },
    { label: 'Betting Record', href: 'betting-record.html', icon: 'history' },
    { label: 'Deposit Record', href: 'deposit-record.html', icon: 'file' },
    { label: 'Profit And Loss', href: 'profit-loss.html', icon: 'trend' },
    { label: 'Withdrawal Record', href: 'withdrawal-record.html', icon: 'file' },
    { label: 'Account Record', href: 'account-record.html', icon: 'file' },
    { label: 'Personal Info', href: 'personal-info.html', icon: 'user' },
    { label: 'Security Center', href: 'security.html', icon: 'shield' },
    { label: 'Customer Service', href: 'support.html', icon: 'chat' },
  ];


  // ---- i18n dictionaries (ported verbatim from composables/useLocale.ts zh/en) ----
  var I18N = {
    "zh": {
      "nav.home": "首頁",
      "nav.hotGames": "熱門遊戲",
      "nav.sports": "體育",
      "nav.live": "真人娛樂",
      "nav.slots": "老虎機",
      "nav.fish": "捕魚",
      "nav.miniGames": "迷你遊戲",
      "nav.promotion": "優惠活動",
      "nav.browse": "瀏覽",
      "nav.deposit": "儲值",
      "nav.member": "會員",
      "account.id": "帳號",
      "account.balance": "餘額",
      "account.points": "點數",
      "account.view": "查看會員中心",
      "auth.login": "登入",
      "auth.register": "註冊",
      "auth.logout": "登出",
      "action.showAll": "查看全部",
      "action.playNow": "立即遊玩",
      "action.detail": "查看詳情",
      "action.viewAllLive": "查看全部直播",
      "action.placeBet": "立即投注",
      "action.back": "返回",
      "action.search": "搜尋",
      "action.loadMore": "載入更多",
      "search.vendorName": "廠商名稱",
      "search.game": "搜尋遊戲",
      "label.liveStudio": "真人館",
      "label.liveDealer": "真人荷官",
      "game.placeholder": "遊戲名稱",
      "section.hotGames": "熱門遊戲",
      "section.liveSport": "體育直播",
      "section.promotion": "優惠活動",
      "ticker.congratulations": "恭喜",
      "ticker.winning": "贏得",
      "ticker.in": "於",
      "sport.eventTag": "全球最大賽事",
      "sport.worldCup": "FIFA 世界盃",
      "sport.prizePool": "總獎池",
      "footer.tagline": "理性遊玩，安心娛樂。",
      "footer.responsible": "博彩可能造成成癮，請理性遊玩。如需支援資訊，請前往責任博彩協助頁面。",
      "footer.cookies": "當您存取、繼續使用或瀏覽本站，即表示您同意我們使用部分瀏覽器 Cookie，以改善您的使用體驗。",
      "footer.rights": "win10069 © 版權所有，受法律保護",
      "studio.previewLanguage": "預覽語言",
      "deposit.qr.pill": "掃碼付款",
      "deposit.qr.hint": "請使用手機掃描下方 QR Code，或複製付款網址完成付款。",
      "deposit.qr.addressLabel": "收款地址",
      "deposit.qr.linkLabel": "付款網址",
      "deposit.qr.copy": "複製",
      "deposit.qr.copied": "已複製",
      "deposit.qr.note": "此為示意用 QR Code 與付款網址，僅供介面展示。",
      "deposit.qr.confirm": "下一步",
      "deposit.qr.altText": "付款 QR Code"
    },
    "en": {
      "nav.home": "Home",
      "nav.hotGames": "Hot Games",
      "nav.sports": "Sports",
      "nav.live": "Live",
      "nav.slots": "Slots",
      "nav.fish": "Fish",
      "nav.miniGames": "Mini Games",
      "nav.promotion": "Promotion",
      "nav.browse": "Browse",
      "nav.deposit": "Deposit",
      "nav.member": "Member",
      "account.id": "ID",
      "account.balance": "Balance",
      "account.points": "Points",
      "account.view": "View Account",
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.logout": "Logout",
      "action.showAll": "Show all",
      "action.playNow": "Play Now",
      "action.detail": "Detail",
      "action.viewAllLive": "View All Live",
      "action.placeBet": "Place Bet",
      "action.back": "Back",
      "action.search": "Search",
      "action.loadMore": "Load More",
      "search.vendorName": "Vendor Name",
      "search.game": "Search Game",
      "label.liveStudio": "LIVE STUDIO",
      "label.liveDealer": "LIVE DEALER",
      "game.placeholder": "Game Name",
      "section.hotGames": "Hot Games",
      "section.liveSport": "Live Sport",
      "section.promotion": "Promotion",
      "ticker.congratulations": "Congratulations",
      "ticker.winning": "winning",
      "ticker.in": "in",
      "sport.eventTag": "The World's Biggest Event",
      "sport.worldCup": "FIFA WORLD CUP",
      "sport.prizePool": "Prize Pool",
      "footer.tagline": "Play responsibly, play with us.",
      "footer.responsible": "Gambling can be addictive, please play responsibly. For information on support measures, please visit our Responsible Gambling Help page.",
      "footer.cookies": "By accessing, continuing to use or navigating throughout this site you accept that we will use certain browser cookies to improve your customer experience with us.",
      "footer.rights": "win10069 © All rights reserved and protected by law",
      "studio.previewLanguage": "Preview language",
      "deposit.qr.pill": "Scan to Pay",
      "deposit.qr.hint": "Scan the QR code below with your mobile wallet, or copy the payment link to complete your payment.",
      "deposit.qr.addressLabel": "Payment Address",
      "deposit.qr.linkLabel": "Payment Link",
      "deposit.qr.copy": "Copy",
      "deposit.qr.copied": "Copied",
      "deposit.qr.note": "This QR code and payment link are for demonstration purposes only.",
      "deposit.qr.confirm": "Next",
      "deposit.qr.altText": "Payment QR code"
    }
  };

  // ---- FAQ zh translations (about.vue faq[] EN -> zh-TW) ----
  var FAQ_ZH = {
    "General Information": "一般資訊",
    "Account Management": "帳戶管理",
    "About WIN100%": "關於 WIN100%",
    "Are the games provided on the site fair?": "網站提供的遊戲公平嗎?",
    "Is my personal information safe?": "我的個人資料安全嗎?",
    "How do I change my password?": "如何變更密碼?",
    "I lost my password, how can I get it reissued?": "我忘記密碼了,要怎麼補發?",
    "WIN100% is an overseas betting site that provides trusted and verified games. From sports, slot games, live casinos to mini games, we are doing our best to closely follow the trends of online entertainment products. You can experience exciting games while receiving various benefits such as attractive promotions and bonuses like various customer loyalty programs.": "WIN100% 是提供可信且經驗證遊戲的海外投注網站。從體育、老虎機、真人娛樂場到迷你遊戲,我們致力於緊跟線上娛樂產品的潮流。您可以在享受精彩遊戲的同時,獲得各種優惠活動、紅利與客戶忠誠計畫等多重福利。",
    "The WIN100% site is a legally registered company, and all game results are absolutely fair, impartial, and based on factual outcomes.": "WIN100% 為合法註冊之公司,所有遊戲結果絕對公平、公正,並以實際結果為準。",
    "We prioritize your personal information above all else. WIN100% will never share your information with any third party unless required by regulations, applicable laws and regulations, or a court order.": "我們將您的個人資料保護視為第一優先。除非法規、適用法律或法院命令要求,WIN100% 絕不會與任何第三方分享您的資料。",
    "After logging into the site, click Information Center > My Information. You can change your password through the \"Login Password\" menu.": "登入網站後,點選「資訊中心 > 我的資料」,即可透過「登入密碼」選單變更密碼。",
    "If you have forgotten your account password, please click the \"Forgot Password\" button. Enter your username and the email address registered during signup. If the information provided is correct, a temporary password will be sent to your email.": "若您忘記帳戶密碼,請點選「忘記密碼」按鈕,輸入您的帳號與註冊時填寫的電子信箱。資料正確的話,臨時密碼將寄送至您的信箱。"
  };

  // ---- deposit QR step (pages/deposit.vue mockPaymentAddresses + deposit.qr.* strings) ----
  var DEPOSIT_QR = {
    "addresses": {
      "linepay": "https://line.example/pay/8f3c1a92b7d4e05f",
      "trc20": "TXf9K2mNq7QeYzR3sD8pL1cWvA6bH4gU5t",
      "erc20": "0x7c3F9aE45bD218e6A0c9F5b3D8a41E2C6B7d9F0A"
    },
    "en": {
      "pill": "Scan to Pay",
      "hint": "Scan the QR code below with your mobile wallet, or copy the payment link to complete your payment.",
      "addressLabel": "Payment Address",
      "linkLabel": "Payment Link",
      "copy": "Copy",
      "copied": "Copied",
      "note": "This QR code and payment link are for demonstration purposes only.",
      "confirm": "Next",
      "back": "Back",
      "altText": "Payment QR code"
    },
    "zh": {
      "pill": "掃碼付款",
      "hint": "請使用手機掃描下方 QR Code,或複製付款網址完成付款。",
      "addressLabel": "收款地址",
      "linkLabel": "付款網址",
      "copy": "複製",
      "copied": "已複製",
      "note": "此為示意用 QR Code 與付款網址,僅供介面展示。",
      "confirm": "下一步",
      "back": "返回",
      "altText": "付款 QR Code"
    }
  };

  window.WIN100_DATA = {
    THEME_KEYS: THEME_KEYS,
    THEME_LABELS: THEME_LABELS,
    ICONS: ICONS,
    T: T,
    BANNERS: BANNERS,
    MINI_IMG_POOL: MINI_IMG_POOL,
    LIVE_TABLES: LIVE_TABLES,
    MINI_NAMES: MINI_NAMES,
    MINI_ROUTES: MINI_ROUTES,
    SLOT_VENDORS: SLOT_VENDORS,
    LIVE_VENDORS: LIVE_VENDORS,
    LIVE_GAME_NAMES: LIVE_GAME_NAMES,
    VENDOR_MEDIA: VENDOR_MEDIA,
    SPORT_MATCHES: SPORT_MATCHES,
    DEMO_BANKS: DEMO_BANKS,
    BANK_ACCOUNTS: BANK_ACCOUNTS,
    NAV_LINKS: NAV_LINKS,
    MEMBER_MENU_LINKS: MEMBER_MENU_LINKS,
    DEPOSIT_GATEWAYS: DEPOSIT_GATEWAYS,
    LOCALES: LOCALES,
    I18N: I18N,
    FAQ_ZH: FAQ_ZH,
    DEPOSIT_QR: DEPOSIT_QR,
    PROMOS: PROMOS,
  };
})(window);
