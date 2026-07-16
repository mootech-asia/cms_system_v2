# Claude Latest Handoff

> Updated: 2026-07-16 (Asia/Taipei)  
> Repository: `mootech-asia/cms_system_v2`  
> Status: the user's latest requests are complete and deployed.

## Read this first

- Work directly on GitHub. The user explicitly does not want a local checkout used for source editing.
- Source branch: `main`.
- Build candidate branch: `pages-candidate`.
- Production branch: `gh-pages`.
- Do not edit generated files on `gh-pages` by hand.
- Do not delete any `backup/*` branches.
- Historical implementation details remain in `docs/handoff-2026-07-16.md`.

## Current URLs

- Repository: https://github.com/mootech-asia/cms_system_v2
- Frontend: https://mootech-asia.github.io/cms_system_v2/
- Client admin: https://mootech-asia.github.io/cms_system_v2/admin/
- Design studio: https://mootech-asia.github.io/cms_system_v2/studio/
- Studio preview: https://mootech-asia.github.io/cms_system_v2/studio/preview/

The previous repository URL redirects to the new repository. The previous Pages URL at
`https://mootech-asia.github.io/cms_v2/` returns 404 and must not be used.

## Verified branch state

| Purpose | Branch / source | SHA |
|---|---|---|
| Source/docs baseline before handoff | `main` | `66bb3261cd5b88020c8879643e573984d2f3b47b` |
| Last deployed source | candidate input | `2f0675b87087384ffd2301dbfa7c4b68fe139de4` |
| Candidate output | `pages-candidate` | `5c998aea25f36330af43bce867ecbdb64e93bb4a` |
| Production output | `gh-pages` | `5c998aea25f36330af43bce867ecbdb64e93bb4a` |
| Legacy production backup | `backup/gh-pages-legacy-2026-07-16` | `0b1a1d61a5bcc4bb72e490952a582d5da62a02bd` |

All `main` commits after deployed source `2f0675b...` only update documentation, including
this handoff and the `CLAUDE.md` pointer. They do not change the built frontend.

## Successful GitHub Actions

- Frontend checks: run `29511710161`, success.
- Build Pages candidate: run `29511710277`, success.
- GitHub Pages deployment: run `29512079625`, success.
- Production URL, admin URL, and studio URL were checked after deployment and returned HTTP 200.

## Latest completed user requests

### 1. Fixed member sidebar

Files:

- `frontend/app/components/MemberSidebar.vue`
- `frontend/app/layouts/member.vue`

Behavior:

- Desktop member sidebar is fixed below the 64px member header.
- Sidebar remains at `y=64px` while the page scrolls.
- Desktop member content has a 256px left offset and is not covered by the sidebar.
- Mobile keeps the existing bottom navigation.

### 2. Live Game photography and carousel

Files:

- `frontend/app/stores/content.ts`
- `frontend/app/components/home/MiniGamesGrid.vue`
- `frontend/app/components/home/MiniGamesGridV2.vue`
- `frontend/app/components/home/MiniGamesGridV3.vue`
- Existing media source: `frontend/app/config/operational-media.ts`

Behavior:

- Live Game uses real dealer, roulette, baccarat, and table photography.
- External Pexels URLs are resolved directly instead of receiving the Nuxt base prefix.
- Image focal points are preserved across all three homepage variants.
- Previous/Next controls now scroll by the number of visible cards.
- Controls reach the end and wrap around on the following click.
- Buttons have explicit `type="button"`.

Rendered verification:

- Six sampled Live images loaded at 1920px natural width.
- Carousel changed from `scrollLeft=0` to `scrollLeft=1260` after Next.
- Desktop and mobile images rendered successfully.

### 3. Promotion dots removed

Files:

- `frontend/app/components/home/Promotion.vue`
- `frontend/app/components/home/PromotionV2.vue`
- `frontend/app/assets/css/main.css`

Behavior:

- The three decorative dots in the upper-right of promotion artwork were removed.
- Removed from desktop, mobile, and the responsive v2 variant.
- Unused dot CSS was removed.
- DOM verification found zero matching dot elements.

### 4. Repository rename and Pages migration

Previous repository:

- `mootech-asia/cms_v2`

Current repository:

- `mootech-asia/cms_system_v2`

Deployment changes:

- `.github/workflows/build-pages-candidate.yml` now uses
  `NUXT_APP_BASE_URL=/cms_system_v2/`.
- Generated base-path verification now checks `/cms_system_v2/`.
- README, CLAUDE guidance, Nuxt comments, and `withBase` comments use the new name/path.
- Candidate output was rebuilt before production promotion.
- Production `gh-pages` points to the exact verified candidate SHA.

## Final visual QA results

- Member sidebar position before scroll: `x=0, y=64, width=256, height=936`.
- Member sidebar position after 900px scroll: unchanged.
- Member main content desktop left margin: `256px`.
- Live Game first image: Pexels live-dealer media, natural width `1920`.
- Carousel: `0 -> 1260px` after clicking Next.
- Promotion decorative dots: `0`.
- Mobile document horizontal overflow: `0px`.

## Deployment procedure for future frontend changes

1. Edit source on `main` through GitHub.
2. Wait for both workflows:
   - `Frontend checks`
   - `Build Pages candidate`
3. Confirm the `pages-candidate` commit message identifies the expected `main` source SHA.
4. Test the candidate output at desktop and mobile widths.
5. Only after verification, force-update `gh-pages` to the exact `pages-candidate` SHA.
6. Wait for GitHub's `pages build and deployment` run to succeed.
7. Verify the public frontend, admin, and studio URLs.

Do not bypass the candidate branch. The current workflow intentionally separates build from
production promotion.

## Rollback

- For the current Nuxt production release, move `gh-pages` back to the previous known-good
  output SHA if a regression is found.
- For the pre-Nuxt legacy site, move `gh-pages` to
  `backup/gh-pages-legacy-2026-07-16` or SHA
  `0b1a1d61a5bcc4bb72e490952a582d5da62a02bd`.
- Never delete the backup branch without explicit approval from the repository owner.

## Known implementation limitations

These are existing product limitations, not regressions from the latest work:

- Content and account operations are still UI/mock implementations until backend contracts exist.
- Content store saves are in-memory placeholders.
- Nickname state is in-memory and resets after refresh.
- Deposit provider outcomes are simulated.
- External campaign photography currently depends on Pexels URLs.
- Continue to follow existing component reuse and semantic token rules in `CLAUDE.md`.

## Claude startup checklist

1. Read this file.
2. Read `CLAUDE.md`.
3. Read `docs/handoff-2026-07-16.md` only when historical detail is needed.
4. Confirm the repository is `mootech-asia/cms_system_v2`, not `cms_v2`.
5. Confirm the requested target branch before editing.
6. Keep all source edits on `main` unless the user explicitly requests another branch.
7. Preserve the candidate-to-production deployment gate.
8. Report GitHub commit, checks, deployed SHA, and verified URL after each production change.

## Current handoff conclusion

There are no known unfinished items from the user's latest requests. The repository rename,
fixed member sidebar, Live Game media/carousel repair, promotion-dot removal, and new Pages
deployment are complete and verified.
