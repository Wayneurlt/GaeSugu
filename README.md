# Gae Sugu

Homepage for Gae Sugu, built with Next.js (App Router) and React.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where things live

- `lib/site.ts` – **all content**: sections, sub-topics, articles, galleries, events, founders, journey and your links (Buy Me a Coffee, donate, YouTube, Instagram, TikTok, email). Text in [square brackets] is a placeholder.
- `lib/nav.ts` – the menu, built from `lib/site.ts`
- `app/` – one folder per page (`about`, `archive`, `articles`, `contact`, `events`, `founders`, `newsletter`, `photography`, `support`, `videos`); `app/[category]` serves Animals & Nature, History & Culture, Travel, Wellness and Sustainability and their sub-topics
- `components/` – header, logo and shared page blocks
- `app/globals.css` – colours, type and layout

To add an article, add an entry to `articles` in `lib/site.ts`; it appears on its section page, its sub-topic page, the Articles page and gets its own page at `/articles/<slug>`.
