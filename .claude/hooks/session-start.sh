#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# 安裝 frontend/ 依賴,讓新 session(不論帳號)立刻能 build/dev,不用手動 npm install。
if [ -f frontend/package.json ]; then
  (cd frontend && npm install)
fi

# 定位交接文件,印出目前分支 + rebuild-plan.md 進度,讓新開的 session
# (換帳號、無對話記憶)能立刻知道做到哪、下一步是什麼。
echo ""
echo "=== WIN100 CMS — 專案定位(SessionStart) ==="
echo "分支:$(git branch --show-current 2>/dev/null || echo unknown)"
echo ""

if [ -f docs/rebuild-plan.md ]; then
  echo "-- docs/rebuild-plan.md 階段進度(§5) --"
  awk '/^## 5\. 進度紀錄/{f=1;next} /^## /{f=0} f' docs/rebuild-plan.md | sed '/^$/d'
  echo ""
  echo "驗收基準與逐字指令見 docs/rebuild-plan.md §1-§3;下一步 = 進度表中第一個未打勾的 R 階段。"
else
  echo "(docs/rebuild-plan.md 不存在 — 尚未建立階段計劃)"
fi

echo ""
if [ -f CLAUDE.md ]; then
  echo "工作守則(省 token / 模型調度 / 慣例)見 CLAUDE.md,開始工作前請先讀過。"
fi
echo "=============================================="
echo ""
