# ADR 0003: Use 0.x.y versions while the site is under construction

- Status: Accepted
- Date: 2026-07-30

## Context

The site presents an explicit construction status and is still evolving in content, interaction design, and research cases. Earlier releases used the `1.1.x` line, which suggested a stable public release.

## Decision

Use semantic versions in the `0.x.y` range until the site reaches its defined public-release criteria. Treat `package.json` as the authoritative current version, keep all CSS and JavaScript cache query versions in sync, and record each version in `docs/CHANGELOG.md` plus `docs/changes/<version>.md`.

## Consequences

Visitors receive fresh static assets after a release. The version number accurately signals that compatibility and content may still change.
