# Restore the original Assessment UI and remove `constants`

This patch targets the current **Vendow V2 frontend** (after the V2 patch and Timeline syntax fix). It does **not** change `nuxt.config.ts`, `.env`, the Backend, database schema, or Seed.

## Apply

1. Back up the current `front` folder or commit your changes first.
2. Extract this ZIP **at the repository root** `D:\Saba\maturity-app` (it contains `front/...` paths). Preserve existing files not listed in the patch.
3. Remove the obsolete navigation constant with the **guarded script** included in this ZIP:

```powershell
cd D:\Saba\maturity-app
.\REMOVE_CONSTANTS.ps1
```

The script removes only `front/constants`, and **refuses to delete it** if it contains files other than `navigation.ts`.

The Sidebar's navigation items are now component-local and it no longer imports from `~/constants`. Do not remove other folders.

## What is restored

- `/enterprise/900001/assessments`: original two-column **AssessmentList + AssessmentDetail + AssessmentPipelineCard** layout.
- Clicking an assessment selects its details and loads its pipeline/evidence/mappings from the existing `/full` Backend endpoint.
- Creating a new assessment opens the existing 4-step Wizard on `/run`.
- Completed assessment `900001`: **Review Wizard Steps** opens at Review Setup. A read-only step selector lets you inspect Evidence, AI Analysis summary and Results without mutating its stored outcome.
- Draft assessment `900002`: runs Review -> Evidence/Mapping -> simulated AI -> Results via the existing Demo API.
- Deep link `/enterprise/900001/assessments/900001` redirects to the original list/detail page with that assessment selected, instead of skipping directly to Report.
- Report retains existing Pipeline and Timeline components; **nothing in the report page is replaced**.

## Important

- The read-only historical wizard is a reconstruction from the **saved final-state database records**, not an exact event-by-event replay of intermediate model responses. For full stage-by-stage audit, a future backend execution history would be required.
- Only the Demo environment supports simulated execution. Real mode does not call Demo endpoints.
- If Nuxt fails to compile, check that the previously delivered fix for `front/components/assessment/Timeline.vue` is still in place. This patch does not overwrite that file.

## Verification on your Windows machine

```powershell
cd D:\Saba\maturity-app\front
npm run typecheck
npm run build
```

Use a supported Node release: Nuxt 4.6.x requires Node 22.21+ or 24.11+. Run both Backend Demo and Frontend Demo as before, then test:

- `/enterprise/900001/assessments`: select both stored assessments; see Pipeline on the right.
- `.../assessments/900001/run`: step through the read-only historic wizard; no network POST/PATCH should fire.
- `.../assessments/900002/run`: finish the live simulated wizard, then refresh and view Report.
- `/enterprise/900001/assessments/900001/report`: Report and Timeline still work.
- `/`: Dashboard remains at root, **not** `/dashboard`.

This patch is source-level reviewed. Full Nuxt build and browser tests require the actual installed dependencies and PostgreSQL connection; they were not successfully run here.
