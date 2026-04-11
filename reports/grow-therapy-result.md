# Grow Therapy 退回修正結果（第4次）

## 已處理

### ① /search 404 — 已確認路由存在
- `/search` 路由已存在於 `src/app/search/page.tsx`
- 該頁面以 Suspense wrapper 渲染 `TherapistsPage` 元件
- Navbar 的連結也已正確指向 `/search`

### ② /booking 404 — 已確認路由存在
- `/booking` 路由已存在於 `src/app/booking/page.tsx`
- 該頁面顯示使用者的預約記錄，包含預約、重新排程、取消功能

### ③ 保險驗證 API 500 — 已修復
- 問題根源：原本邏輯先嘗試 DB 查詢，若失敗才檢查 mock plan
- 但 SQLite 在 Vercel 環境中無法穩定運行，導致所有 insurancePlanId 都返回 404/500
- 修復方式：優先檢查 `MOCK_PLANS`（不需要 DB），再對非 mock plan 才嘗試 DB 查詢
- 修改檔案：`src/app/api/insurance/verify/route.ts`

### ④ Console Error / Hydration Error — 已修復
- 問題根源：`Navbar` 使用 `usePathname()` 做為 active state 判斷
- SSR 時 `usePathname()` 返回空字串，Hydration 後變成實際路徑，導致 client/server mismatch
- 修復方式：加入 `mounted` state，active style 只在 client mount 後套用
- 修改檔案：`src/components/Navbar.tsx`

## 驗證
- `npm run build` 通過（無 Error，僅有 img 警告）
- Vercel 部署成功

## Git
- Commit: `43d91c7`
- 分支：main（force-push 到 remote）

## 連結
- Vercel (aliased): https://grow-therapy-pied.vercel.app
- Vercel Deployment: https://vercel.com/seans-projects-7dc76219/grow-therapy/deployments/ABBRbMUUBgJJKamdzz2mxTkqhExJ

## 本次修改檔案
- `src/components/Navbar.tsx` — 加入 mounted state 防止 hydration mismatch
- `src/app/api/insurance/verify/route.ts` — 優先處理 mock plan，移除 DB 依賴
