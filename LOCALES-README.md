# English and Polish versions – preview branch

## What is included
- New English `/en/` and Polish `/pl/` website versions.
- 10 pages per language: home, marquee hire, equipment, graphics/visualisations, corporate events, team building, contact, enquiry, cookie settings, privacy policy.
- A CZ / EN / PL switcher in the existing Czech header, on desktop and mobile, including the Czech legal pages.
- Localised contact and enquiry form labels and submission feedback. Existing Formspree endpoint, field mappings and conversion events are maintained; the requested language is added to each submission.
- Localised cookie banner and controls; existing consent choices and GA4/Google Ads tracking mechanisms stay in place.
- Canonical and reciprocal hreflang links plus the 28-URL sitemap.
- CSS extensions compatible with the current Magnetic Events visual identity.

## Editorial and QA notes
- The translated promotional pages reflect the Czech offer accurately but are *adapted and shorter*, not line-by-line duplicates of the original Czech catalogue. Detailed product dimensions and technical categories are included.
- No event organising or programme coordination is offered; these remain the organiser's responsibility.
- Polish and English legal translations follow the published Czech notices and should be reviewed for legal accuracy before release.
- A static source check found no broken internal paths in the 20 translated HTML pages.
- Live rendering, form delivery, accessibility and responsiveness should still be tested in a hosted preview before merging.

## Release
Keep as a draft PR until the user reviews language, design and the final mobile experience. Merging into `main` may publish automatically through GitHub Pages.