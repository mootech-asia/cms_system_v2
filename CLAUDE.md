# WIN100 CMS — 工作守則

## 專案速覽
- 交付物 = `frontend/`(Nuxt 4 + PrimeVue + Tailwind + Pinia,純 UI、邏輯占位)。
- 根目錄靜態站(pages/*.html + js/router.js)已凍結待退場,**非必要不要動、不要讀**。
- 總計劃與驗收基準:`docs/rebuild-plan.md`(R0–R7);風格對照:`docs/style-guide.md`。

## 省 token 守則(必守)
1. **禁止直接 cat/read minified 檔**(pages/*.html、partials/*.html、公開 js/*.css)。
   要資訊用針對性 `grep -o` 或 python 抽取,輸出限 ≤30 行。
2. **截圖能省則省**:deviceScaleFactor 1、寬 ≤1280、只截判斷所需的頁;
   驗收比對用 pixel-diff 腳本輸出數字(如 R0 做法),**數字異常才讀圖**。
3. **批次機械修改用一支腳本**(參考 R2a),不逐檔 Edit;驗證靠 `nuxt build` + grep。
4. 大輸出導到檔案再挑著讀;可合併的 shell 指令合併成一次呼叫。
5. 大型階段(整批頁面遷移、變體量產、後台頁)可交 subagent 執行,主對話只收結論。
6. 每完成一個 R 階段:commit + push + 一行報告,**建議開新 session 接續下一階段**
   (rebuild-plan.md 即交接文件),避免舊上下文複利計費。

## 慣例
- 分支:依 session 指定分支開發;commit message 英文、聚焦動機。
- 樣式:只用 theme token(tailwind.config.ts),禁任意值色碼;共用視覺進 `assets/css/main.css` @layer components。
- 元件:PrimeVue 優先,包裝於 `components/ui/*`;區塊登錄表 `app/config/blocks.ts`。
