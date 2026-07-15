import type { Config } from 'tailwindcss';

/**
 * 品牌 theme — 全站唯一的設計代幣來源(規範 1-B.1)。
 * 語意命名,markup 一律使用這些 token,禁止任意值色碼(如 bg-[#98E7D2])。
 * 對照表見 docs/style-guide.md。
 */
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        /* 主色 */
        primary: { DEFAULT: '#98E7D2', soft: '#CBE8E4', faint: '#313E40' },
        'on-primary': '#0F1622',
        /* 面板(綠黑系) */
        surface: { deep: '#0F1419', DEFAULT: '#1A2128', 2: '#2A3138' },
        line: { DEFAULT: '#374151', soft: '#1F2937' },
        /* 文字四階 */
        ink: { DEFAULT: '#FFFFFF', 2: '#D1D5DB', 3: '#9CA3AF', 4: '#6B7280' },
        /* 狀態/強調 */
        danger: '#F87171',
        success: '#4ADE80',
        gold: '#F0B24A',
        accent: '#AAE5D3',
        /* 銀行卡擬物卡面(全站唯一保留的藍黑系) */
        card: { 1: '#1B2536', 2: '#131C2B', 3: '#0D1420', line: '#26324A' },
      },
      fontSize: {
        display: ['30px', { lineHeight: '1.2' }],
        h1: ['24px', { lineHeight: '1.2' }],
        h2: ['18px', { lineHeight: '1.2' }],
        'body-lg': ['16px', { lineHeight: '1.5' }],
        body: ['14px', { lineHeight: '1.5' }],
        note: ['12px', { lineHeight: '1.5' }],
        micro: ['10px', { lineHeight: '1' }],
      },
      letterSpacing: {
        wide2: '.06em',   /* 小型標籤 */
        numeric: '.12em', /* 卡號/金額 */
      },
      backgroundImage: {
        'g-primary': 'linear-gradient(90deg,#CBE8E4,#98E7D2)',
        'g-hero': 'linear-gradient(90deg,#0F766E 0%,#10B981 55%,#B9DE5A 100%)',
      },
      borderRadius: {
        ui: '10px', /* 按鈕/輸入框標準圓角 */
      },
      boxShadow: {
        mint: '0 8px 20px rgba(152,231,210,.18)',
      },
    },
  },
};
