# Gae Sugu

Website for Gae Sugu, built with Next.js (App Router) and React, with a built-in admin for editing the content.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing the site: the admin

Go to **/admin** and sign in. From there you can change every heading, paragraph, link, button, card, article and photo on the site, and upload new photos.

Sign-in details live in environment variables, never in the code:

| Variable | What it is |
| --- | --- |
| `ADMIN_EMAIL` | The admin's email address |
| `ADMIN_PASSWORD` | The admin's password |
| `AUTH_SECRET` | Any long random text; signs the sign-in cookie |
| `DATABASE_URL` | The Neon Postgres database where edits are saved |
| `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH` | Optional: only used when there is no `DATABASE_URL` (see below) |

On your computer, put them in `.env` or `.env.local` (git ignores both; `.env.example` lists them). For the live site, add them in **Vercel → Settings → Environment Variables** and redeploy.

### How saving works

- **With `DATABASE_URL`** (the normal setup): every save goes to the database and is live on the site straight away, both on Vercel and on your computer. Note that running locally with the same `DATABASE_URL` edits the live site. Only edited sections are stored (table `site_content`, one row per content file); anything never edited still comes from the files in `content/`, and if a file has been edited in the admin, the database copy wins. Uploaded photos are stored in the database too (table `site_media`) and served from `/media/…`. The tables are created automatically.
- **Without a database**, on your computer (`npm run dev`) saving writes to the files in `content/` and `public/photos/`; commit and push them to publish. On Vercel each save is instead committed to GitHub (needs `GITHUB_TOKEN`, a [fine-grained token](https://github.com/settings/personal-access-tokens) with **Contents: Read and write** on this repo) and Vercel redeploys in about 1–2 minutes.

Pages are pre-built and cached; each save clears that cache, so the next visit shows the change.

Every save is checked first: it must keep the same fields as before, slugs must be valid and unique, and photos still in use cannot be deleted, so an edit cannot break a page.

## Where things live

- `content/*.json` – **the starting content** (edits made in the admin are stored in the database on top): `home` (homepage), `articles`, `photography`, `events`, `about`, `explore` (regions and artefacts), `pages` (other pages' text), `categories` (sections and topics), `nav` (menu), `settings` (links, email, footer) and `photos` (the photo library). Text in [square brackets] is a placeholder.
- `public/photos/` – the photo files. Uploads are resized to 1600 px and stripped of location data.
- `lib/db.ts` – the database; `lib/content.ts` – merges database edits over the content files; `lib/site.ts` – `getSite()`, which every page uses to read the content
- `app/(site)/` – the public pages; `app/(site)/[category]` serves the sections and their topics
- `app/admin/`, `app/api/admin/`, `components/admin/`, `lib/admin/` – the admin
- `components/` – header, logo and shared page blocks
- `app/globals.css` – colours, type and layout

Articles have a full-text field: leave a blank line between paragraphs, start a line with `## ` for a subheading and `> ` for a quote. A new article appears on its section and topic pages, the Articles page and at `/articles/<slug>`.
