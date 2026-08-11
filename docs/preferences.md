# Project preferences

## Product and publishing

- Keep the portfolio as a plain static site with `index.html` as its entry point.
- GitHub Pages publishes `main` directly. Do not add a bundler or framework without an explicit decision.
- Use pre-1.0 semantic versions while the site is under construction: `0.x.y`.
- Keep the package version and every CSS or JavaScript cache version in sync.
- Treat `package.json` as the authoritative current version and `docs/CHANGELOG.md` as the version-history index.
- Read the visible construction signal from the page source; do not duplicate mutable release state in this preferences file.
- Publish only assets loaded by the site at runtime. Keep source exports, visual QA captures, generated plans, and temporary files local.
- Keep the local `resume/` folder and generated project plans out of the repository.
- Keep project preferences, ADRs, feedback, TODO notes, and version records under version control in `docs/`.
- Keep repository-recovery `.bundle` snapshots local and ignored.

## Experience

- Preserve reduced-motion behavior, keyboard access, focus handling, and accessible labels when changing interactions.
- Keep public copy direct, specific, and bilingual where a translation is available.
- Keep the language switch framework-free, remember the selected language locally, and translate marked content rather than duplicating pages.
- Do not add Deerflow branding, links, or attribution to the public site.

## Collaboration

- Treat `feedback.md` and `todo.md` as the shared source of truth for open work.
- Add an ADR for a decision that changes architecture, publishing, versioning, or long-lived content rules.
