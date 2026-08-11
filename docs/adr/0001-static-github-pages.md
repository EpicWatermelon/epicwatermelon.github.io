# ADR 0001: Keep the portfolio as a static GitHub Pages site

- Status: Accepted
- Date: 2026-07-30

## Context

The portfolio is published from the `main` branch through GitHub Pages. It is a single-page site with no build step or framework configuration.

## Decision

Keep `index.html` as the page entry point and publish plain static files from `main`. Retain `.nojekyll` because the current Pages deployment uses the legacy branch build and the file bypasses Jekyll processing.

## Consequences

The site stays simple to deploy and inspect. Cache versions for CSS and JavaScript must be updated manually with each published release.
