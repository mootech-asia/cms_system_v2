# cms_system_v2 — WIN100(交付版)

> 本 repo 現行形態(main,2026-07-19 起)是**純 HTML+CSS+JS 靜態站**:
> `factory/win100/`,免建置、可直接開 `index.html`,行為層是 vanilla JS
> (`assets/js/site.js`),無框架依賴。
> 本 repo 同時是**模板工廠**(2026-07-17 業主整併,cms_system 已廢除):
> `templates/starter/` 起新模板、`docs/template-guide.md` 為模板開發規範。
>
> 舊的 Nuxt 4 + PrimeVue + TailwindCSS + Pinia 工程師形式(含 `/admin`、`/studio`
> 兩個後台)已完整保存於分支 `工程師框架版本` 與 `客戶後台`,main 不再放框架原始碼。

## 快速開始

```bash
npm install                          # 只裝本地驗證用的 playwright,無其他依賴
npm run serve:win100                 # http://localhost:4173,直接開 factory/win100/
npm run verify:win100                # 結構檢查(無需瀏覽器)
npm run verify:win100:behavior       # 行為檢查(Playwright,需先 serve:win100)
```

也可以完全不裝任何東西,直接用瀏覽器開 `factory/win100/index.html`(file://)。

| 路徑 | 用途 |
|---|---|
| `factory/win100/index.html` 等 24 頁 | WIN100 站點 |
| ~~`/studio`~~ / ~~`/admin`~~ | 已移出 main,見分支 `客戶後台`(設計後台/客戶後台) |

## 工程接手重點

- **無後端串接**:目前是純前端靜態展示,換膚、輪播、頁簽、表單互動等由
  `factory/win100/assets/js/site.js` 驅動,資料在 `assets/js/data.js`;要接 API
  就是把這兩個檔案裡對應的讀寫改成真正的網路請求。
- **換膚**:`factory/win100/themes/*.css` 是全站視覺唯一來源(CSS 變數);
  加皮膚 = 複製檔案改值,並在 `site.js` 的皮膚清單補一筆。
- **重新產生**:若工程師框架版本(Nuxt)有更新,用
  `scripts/build-factory-win100.js` 重新產生本目錄的頁面結構與 CSS(不會覆蓋
  `assets/js/site.js`、`assets/js/data.js`,見腳本檔頭說明)。
- Token 對照:`docs/style-guide.md`;驗收紀錄:`docs/rebuild-plan.md`;
  完整《模板開發規範》:`docs/template-guide.md`;起新模板:`templates/starter/`(規範 §9)。

## GitHub Pages

Nuxt 正式站由 `gh-pages` 分支提供:
https://mootech-asia.github.io/cms_system_v2/

- `main`:原始碼
- `pages-candidate`:GitHub Actions 建置候選版
- `gh-pages`:驗證後的正式版
- `backup/gh-pages-legacy-2026-07-16`:改版前靜態站備份

安全 tag:`keep/github-pages-latest-2026-06-29`、`keep/figma-react-version-2026-06-29`。
