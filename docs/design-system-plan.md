# 全站樣式盤點與分層規劃

> 2026-07-14 盤點。範圍：靜態站（22 個 `pages/*.html` + 22 個 `js/*.js` + `css/base.css` 107KB）與 Nuxt 前端（34 個 `.vue`）。

## 一、現況盤點

### 字級（約 30 種並存）
| 來源 | 值 | 使用量 |
|---|---|---|
| Tailwind 級距 | `text-sm`(614)、`text-xs`(297)、`xl`(48)、`2xl`(44)、`base`(42)、`lg`(36)、`3xl`(33)、`5xl`(12)、`4xl`(9) | 正常主幹 |
| 任意值 | `text-[10px]`(141)、`text-[9px]`(48)、`text-[17px]`、`text-[20px]` | 大量超小字無規範 |
| inline / JS 注入 | 12/13/14/15/16/17/18/20/22/24/26/28/30/40/54px + 3 種 `clamp()` | 約 20 種散值 |

### 顏色（72 種 hex + 101 種 rgba ≈ 170 種寫法）
- 主色明確：mint 漸層 `#98E7D2`(551)/`#CBE8E4`(307)，背景 `#0F1419`(485)/`#1A2128`(293)。
- 灰階混亂：`#9ca3af`、`#d1d5db`、`#4b5563`、`#6b7280`、`#c3cbd6`、`#cbd5e1`、`#e5e7eb`、`#ccc`…（Tailwind gray/slate 與自訂值混用）。
- 深色面板兩個色溫並存：綠黑系（`#1a2128`、`#2a3138`、`#313e40`）與藍黑系（`#0a0e1a`、`#1e2730`、`#212b3d`、`#263241`、`#161e2c`、`#2a3441`）。
- 狀態/強調色未定義：`#f0b24a`（金）、`#b9de5a`、`#f4e185`、red-400、green-400 散用。

### 字距 / 行高 / 字重
- letter-spacing 9 種寫法（0~0.22em）+ `tracking-wide/wider/widest` 混用。
- line-height 10 種散值 + `leading-tight/none/relaxed`。
- font-weight 出現 400/500/600/700/800/900/1000（1000 為非法值）+ `font-medium/semibold/bold`。

### 架構性問題
1. 樣式散落 4 層：`base.css`（編譯產物，utility 集固定不可擴充）、`pages/*.html` inline style、JS 注入樣式（member-forms/mobile/auth/promotion-detail/back-buttons…）、Vue scoped style。
2. 雙前端（靜態 + Nuxt）需同步維護，任何全域改動工作量 ×2。
3. 單行壓縮 HTML 使批次替換需逐處人工判斷層級歸屬。

## 二、目標層級規範（tokens 草案）

```css
:root {
  /* 字級階梯（對齊現有 Tailwind 級距） */
  --fs-display: 30px;  /* 頁面大標 text-3xl */
  --fs-h1: 24px;       /* 區塊主標 text-2xl */
  --fs-h2: 18px;       /* 卡片標題 text-lg */
  --fs-body: 14px;     /* 內文 text-sm */
  --fs-caption: 12px;  /* 說明/標籤 text-xs */
  --fs-micro: 10px;    /* 徽章/角標（收斂 9px→10px） */

  /* 字重四階：400 內文 / 600 次強調 / 700 標題 / 800 數值與 CTA */
  /* 字距三階 */
  --ls-tight: 0;         /* 內文 */
  --ls-wide: .06em;      /* 小型大寫標籤 */
  --ls-numeric: .12em;   /* 卡號/金額等等寬感數字 */
  /* 行高三階：1(數值/按鈕) 1.5(內文) 1.2(標題) */

  /* 色彩語意 */
  --c-primary: #98E7D2; --c-primary-soft: #CBE8E4;   /* 漸層固定 90deg soft→primary */
  --c-bg: #0F1419; --c-surface: #1A2128; --c-surface-2: #2A3138; --c-border: #374151;
  --c-text: #FFFFFF; --c-text-2: #D1D5DB; --c-text-3: #9CA3AF; --c-text-4: #6B7280;
  --c-gold: #F0B24A; --c-danger: #F87171; --c-success: #4ADE80;
  /* 藍黑系僅保留於「銀行卡」擬物卡面：#131C2B/#26324A */
}
```

收斂原則：灰階全部映射到 text 4 階；深色面板統一綠黑系（藍黑僅保留銀行卡面）；weight 1000/900→800、500→600；9px→10px；letter-spacing/line-height 各收斂到 3 階。

## 三、階段性計劃

| 階段 | 內容 | 產出 | 規模 |
|---|---|---|---|
| P0 | 建立 `css/tokens.css`（變數 + 少量覆蓋層），掛進 `index.html` 與 Nuxt；本文件即規範 | tokens 上線（尚不改頁面） | 小，半個 session 內 |
| P1 | 會員區收斂：account/deposit/withdrawal/banking-details/security/personal-info/change-password/4 個 record 頁 + member-forms/auth/mobile 注入樣式 | 12 頁 + 3 JS 對齊 tokens，逐頁截圖驗證 | 中 |
| P2 | 行銷/遊戲區：home/promotion/about/support/hot-games/slot/sport/live/fish/mini-games + widgets/vendors/promotion-detail JS | 10 頁 + 3 JS | 中大（home 最複雜） |
| P3 | Nuxt 前端同步：tokens 進 Nuxt，34 個 vue 對齊 | 雙前端一致 | 中 |
| P4 | 全站截圖驗收（桌機/手機）+ 部署 | 驗收報告 | 小 |

依賴順序：P0 → P1 → P2 → P3 → P4。P1/P2 內部可再按頁切分，任何切點都可安全部署（tokens 是覆蓋層，未改到的頁面不受影響）。

### 進度
- P0 ✅ tokens.css 上線（靜態 + Nuxt）。
- P1 ✅ 會員區收斂。
- P2 ✅ 行銷/遊戲區 + 共用 chrome 抽成 partials。
- P3 ✅ Nuxt 對齊（2026-07-14）：22 條路由雙前端逐頁截圖比對。修正 — VendorBrowser 廠商標題改 mint 膠囊徽章（移除粉紅底線 #f033b5 與 #c9ced6/#d9d6d0 灰）、slot 不再預設進 PP、Back 僅在廠商遊戲列表顯示、遊戲格加 Load More；sport 加 Load More；promotion 移除 Load more 並移植詳情視圖（?detail=）；會員頁移除頂部 Back（InnerBack 元件刪除）；MemberHeader 補語言選單+漢堡（後依需求改為僅手機顯示，PC 版移除）；change-password 文案/驗證改條件式（login=長度、txn=ASCII）。殘餘像素差來源：靜態會員頁內部捲軸的水平位移與跑馬燈/輪播動畫時序，視覺等同。
- P4 ✅ 全站截圖驗收（2026-07-14）：22 路由 + 4 互動狀態 × 桌機/手機 × 雙前端（約 100 張），逐項比對通過；唯一修正 — Nuxt 手機抽屜登出態 Login/Register 版式對齊 mobile.js。詳見 `p4-acceptance.md`。
- P5 ✅ 殘值收斂（2026-07-14，雙前端同步）：`text-[9px]`→`text-[10px]`（sport 隊徽縮寫，64 處）；散灰對映四階 — #C3CBD6/#CBD5E1/#E5E7EB→#D1D5DB、#8FA39C→#9CA3AF、#F9FAFB→#FFF（back 按鈕規格全數同步）；on-primary 深色統一 — 內聯 #111827/#0F172A→#0F1622（`text-gray-900` 類別為 base.css 編譯值，不動）。改動頁面對 P4 基線回歸 ≤0.24%。仍保留的非代幣值：藍黑系銀行卡面（`--c-card-face-*`）、廠商卡 #161E2C/#212B3D（使用者核可設計）、白底銀行下拉內部淺灰、#AAE5D3 註標綠（沿用全站慣例）。

## 四、Usage 評估

- **一次完成（P0–P4 同一個 session）：不建議。** 逐頁替換需人工判斷 + 逐頁截圖驗證，22 個單行 HTML + 20 個 JS + 34 個 Vue 的總量，加上本 session 已消耗的額度，一次跑完溢出風險高，且中途溢出會留下「改一半」的狀態。
- **建議切法**：本次完成 P0（+視餘量做 P1 的 account/withdrawal/banking-details 三頁示範）；P1 剩餘 + P2 一個新 session；P3 + P4 一個新 session。每階段結束即部署，隨時可停。
