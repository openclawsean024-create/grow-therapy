# grow-therapy · CHANGELOG

## v3.0.2 (2026-09-06)
> v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet

### Added
- `PRD/SPEC.md` — 9 章 v3.0.2 等級規格書（12 條 FR、NFR table、部署契約、mermaid flow）
- `PRD/CHANGELOG.md` — 本文件
- `.github/workflows/ci.yml` — GHA 4-job CI（lint/test/build/deploy-to-Vercel）
- `vitest.config.ts` — Vitest 設定（含 `@/*` alias）
- `tests/utils.test.ts` — 13 個單元測試（formatDate / formatTime / formatDateTime / formatCurrency / getAvailableSlots）
- `package.json` scripts: `test` / `test:watch`
- `devDependencies`: `vitest@^2.1.9`

### Fixed
- `src/lib/stripe.ts` — 修正 Stripe `apiVersion` 型別錯誤。原 commit d46ec04 把版本改成 `2026-08-26.dahlia`，但安裝的 stripe@22.0.1 SDK 只支援到 `2026-03-25.dahlia`，導致 `next build` 編譯失敗。回退到 SDK 內建最新版本。

### Verified
- `npm install --legacy-peer-deps` — 347 packages
- `npm run build` — ✅ Compiled successfully（16 routes：6 static + 10 dynamic）
- `npx tsc --noEmit` — 0 error
- `npm run lint` — 0 error（5 個 `<img>` 警告，預期內）
- `npm test` — 13/13 pass (`tests/utils.test.ts`)

### Status
- Default branch: `main`
- Deploy target: `vercel`
- Token source: `/Users/sean/.minimax/workspace/repo-fleet/.env`

---

## v3.0.1 (2026-09-06)
- chore: validate build
- chore: fix build error (stripe apiVersion) — ⚠️ 此 commit 引入新 bug，於 v3.0.2 修正
- chore: validate build

## v3.0.0 (2026-09-06)
- 12 項 GrowTherapy re-inspect 修正（預約申請表/治療師 profile/篩選器/UI 規範）
- 統一色彩規範（emerald → blue #4A90D9）
- 移除 i18n、加入 /search 路由

## v0.1.0 (2026-09-06)
- Initial: Next.js 14 + Prisma 5 + NextAuth + Stripe + 9 個 model
