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

## 模型調度(必守)
> 主對話本身用哪個模型由使用者用 `/model` 決定,這裡管的是**分派給 subagent(Agent/Workflow)時要不要指定 model 參數**。

1. **機械/批次型任務一律指定 `model: 'sonnet'`**,不要繼承主對話模型:
   - 整批頁面/元件改寫(如 R2a 的 chrome 去重複、R2d 的 scoped CSS 遷移)
   - 大量檔案的搜尋替換、格式轉換、逐頁驗證截圖/curl 比對
   - 這類任務已驗證 Sonnet 5 品質足夠,不需要 Fable 5/Opus 等級推理,強行用高階模型只是燒額度。
2. **架構/設計/判斷型任務不降級**:省略 `model` 參數讓其繼承主對話模型(如 R2b 的 config 設計、R3 皮膚層架構、後台資料結構設計、任何需要跟使用者原文逐字核對的驗收)。
3. **純機械檢查(grep 結果分類、簡單格式檢查)可用 `model: 'haiku'`**,若該任務明顯不需要理解上下文。
4. 一次要平行開多個 subagent 前,先估算是否可能撞到主模型的額度上限;可能撞到就整批用 `sonnet`,不要等額度耗盡才切。
5. 上述規則只管 subagent 分派;絕不擅自建議或暗示使用者切換主對話模型,那是使用者的選擇。

## 慣例
- 分支:依 session 指定分支開發;commit message 英文、聚焦動機。
- 樣式:只用 theme token(tailwind.config.ts),禁任意值色碼;共用視覺進 `assets/css/main.css` @layer components。
- 元件:PrimeVue 優先,包裝於 `components/ui/*`;區塊登錄表 `app/config/blocks.ts`。
