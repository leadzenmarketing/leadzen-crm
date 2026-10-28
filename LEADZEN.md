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

*Effective 28 October 2026.* This policy covers Leadzen CRM and Leadzen Connect, the lead-management tools that
Leadzen Marketing (Bengaluru, India) runs for its advertising clients.

**Who decides and who processes.** Each client business decides why and how its leads are used; under India's Digital
Personal Data Protection Act, 2023 the client is the Data Fiduciary. Leadzen Marketing processes that data only on the
client's instructions, as its Data Processor.

**What we collect.** When a person fills a lead form for one of our clients (a Meta / Facebook / Instagram Lead Ad, a
website form, or a sheet the client shares with us), we receive the answers they gave: usually name, phone number,
email, city and the questions asked in that form, plus the campaign, ad and form the lead came from. The client's team
then adds notes, call outcomes, follow-up dates and deal details in the CRM. We do not collect payment details.

**How we use it.** Only to deliver each lead to the client's own CRM workspace, help the client's sales team follow it
up, and report campaign results (for example, cost per lead) to that client. We do not sell personal data, do not use
one client's leads for another client, and do not use lead data for our own advertising.

**Meta Platform data.** Leads from Meta Lead Ads are fetched with the advertiser's permission through the Meta
Marketing API (`leads_retrieval`) and stored only in that advertiser's workspace. Meta data is used only for the
purposes above and is deleted as described below.

**Who can see it.** Only users the client approves in its own workspace, and Leadzen Marketing staff who run the
service. Each client's data sits in a separate workspace. Data is stored on servers in India, access is password
protected, and backups are kept private.

**How long we keep it.** For as long as the client uses the service. Within 30 days after a client leaves, its
workspace and backups are deleted, unless the client asks us to export the data first or the law requires us to keep
it.

**Your rights.** You can ask to see, correct or delete your data, or withdraw consent, by contacting the business whose
form you filled or by writing to us (below). We will pass your request to that business and act on it.

### Data deletion

To have your data deleted from Leadzen CRM:

1. Email **marketingleadzen@gmail.com** with the subject "Delete my data".
2. Include the phone number and/or email address you used in the form, and the business name if you know it.
3. We confirm receipt within 3 working days and delete your lead record, its notes and its activity history from the
   relevant workspace within 30 days. Backups holding it expire within a further 30 days.
4. We reply to confirm the deletion.

You can also remove Leadzen's access to your Facebook data at any time from Facebook Settings → Apps and Websites.

**Contact / grievance officer:** Leadzen Marketing, Bengaluru, India — marketingleadzen@gmail.com.
