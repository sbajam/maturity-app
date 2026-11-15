# Vendow V2 — Fix for missing Wizard after restoring nuxt.config.ts

## Confirmed root cause from supplied sources

- The original Nuxt configuration exposes `runtimeConfig.public.demoMode`.
- V2 added `runtimeConfig.public.appMode` and `useAppMode()` checked ONLY `appMode === 'demo'`.
- After the Nuxt configuration was restored to fix CSS, `appMode` was absent, making the app think Demo mode was off.
- The assessment detail conditionally hides `Review Wizard Steps` when Demo is off, and `/run` renders `AI analysis is not available` instead of the Wizard.

This patch changes **only** `front/composables/useAppMode.ts`. It does not alter Nuxt configuration, routing, CSS, layouts, the database, API, or Wizard components. Explicit `appMode=real` takes precedence if that key is present.

## Apply

1. Back up your frontend working tree.
2. Extract the ZIP at `D:\Saba\maturity-app` so it replaces the composable under `front/`.
3. In the frontend `.env`, ensure the original Nuxt public flag is set:

```dotenv
NUXT_PUBLIC_DEMO_MODE=true
NUXT_PUBLIC_API_BASE=http://127.0.0.1:3002/api/v1
NUXT_API_BASE=http://127.0.0.1:3002/api/v1
```

`NUXT_PUBLIC_APP_MODE=demo` **alone** is insufficient if `runtimeConfig.public.appMode` was removed from the restored Nuxt configuration. `runtimeConfig.public.demoMode` must exist in your `nuxt.config.ts` (as it did in the original source). If the frontend environment specifies `NUXT_PUBLIC_APP_MODE=real` while a new config declares `appMode`, that explicit real setting overrides the demo flag. Use consistent configuration.

4. Restart Nuxt to reload environment variables. No migrations or seeds needed.

## Verify

- `/enterprise/900001/assessments` -> select `900001` -> `Review Wizard Steps` button visible.
- `/enterprise/900001/assessments/900001/run` -> 4-step Wizard, completed assessment read-only; use step navigation at top to inspect all stages without mutating DB.
- `/enterprise/900001/assessments/900002/run` -> interactive Demo Wizard for draft.
- `/enterprise/900001/assessments/900001/report` -> separate final Report; opening Report is NOT supposed to open the Wizard.

If the Wizard still shows `AI analysis is not available`, verify `NUXT_PUBLIC_DEMO_MODE=true` is in the actual frontend `.env`, not just `.env.demo.example`, and restart Nuxt. The frontend must connect to the Demo backend (3002).

## Scope and validation

Reviewed compatibility logic statically. No full Nuxt build or browser / PostgreSQL test was run in this environment. Existing historical read-only Wizard limitations remain unchanged.
