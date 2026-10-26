# Leadzen CRM

**Leadzen CRM** is the customer-relationship platform of **Leadzen Marketing** (Bengaluru, India), used to turn
ad leads into real buyers. It is a fork of [Twenty](https://github.com/twentyhq/twenty), the open-source CRM —
*powered by Twenty*. "Twenty" and the Twenty logo are trademarks of Twenty.com, PBC; Leadzen CRM is not affiliated
with or endorsed by Twenty.

## License

Licensed under the same terms as Twenty (see [LICENSE](LICENSE)): AGPLv3 for the core, MIT for the SDK/UI/apps
packages, and Twenty's commercial license for files marked `/* @license Enterprise */`. The complete source of the
version Leadzen runs is this repository.

## What Leadzen changed

Kept deliberately small so Twenty updates merge cleanly:

- Name, page titles, PWA manifest and favicons/app icons → Leadzen CRM (`packages/twenty-front/public/images/icons`,
  `packages/twenty-front/public/images/leadzen`).
- Branding constants: `packages/twenty-front/src/modules/leadzen/constants/LeadzenBranding.ts` and
  `packages/twenty-emails/src/constants/LeadzenBranding.ts`.
- Brand colours: `packages/twenty-front/src/modules/leadzen/styles/leadzen-theme.css` (imported last in
  `src/index.tsx`) turns Twenty's blue interactive colour and accent scale into Leadzen orange.
- Sign-in footer: Leadzen terms/privacy links, "Powered by Twenty" and a source-code link.
- Email logo, footer and a few subjects (verify email, invitation).
- `.github/workflows/leadzen-build.yml` builds the image; Twenty's own CI workflows are disabled in this fork.

The email sender name is configuration, not code: set `EMAIL_FROM_NAME="Leadzen CRM"` on the server.

## Versioning

`main` = a **stable Twenty release** (recorded in `.leadzen-base`, e.g. `twenty/v2.48.0`) **plus the Leadzen commits on
top**. Twenty's unreleased `main` branch is never used.

## Image

`ghcr.io/leadzenmarketing/leadzen-crm` (linux/arm64 — Apple Silicon and Oracle Ampere), built by GitHub Actions on
every push to `main`. Tags: `latest`, the Twenty version (e.g. `2.48.0`) and `sha-<commit>`.

## Updating to a new Twenty release

    scripts/leadzen/sync-upstream.sh

Finds Twenty's latest stable release, replays the Leadzen commits on top of it, force-pushes `main`, keeps upstream CI
workflows disabled and triggers a rebuild. On a cherry-pick conflict it stops so the conflict can be resolved by hand.
Back up the database before pulling a new image: the server upgrades the schema on start.

## Terms of Service

*Draft — to be replaced by Leadzen Marketing's final terms.* Leadzen CRM is provided by Leadzen Marketing to its
clients as part of agreed marketing services. Access is by invitation; clients are responsible for the lawfulness of
the lead data they upload or connect.

## Privacy Policy

*Draft — to be replaced by Leadzen Marketing's final privacy policy.* Leadzen CRM stores contact and lead data on
behalf of Leadzen Marketing's clients, solely to manage their leads and measure campaign results, in line with
India's Digital Personal Data Protection Act, 2023. Data is not sold. Contact: Leadzen Marketing.
