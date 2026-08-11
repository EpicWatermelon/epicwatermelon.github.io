# ADR 0002: Publish only runtime assets

- Status: Accepted
- Date: 2026-07-30

## Context

The repository had accumulated source exports, preview sheets, generated plans, temporary images, and files that were not loaded by the public site.

## Decision

Track only assets directly required by `index.html`, the stylesheet, or JavaScript at runtime. Keep source exports, previews, local resumes, generated plans, and temporary files ignored. The automated test suite checks that known unused assets are absent from Git tracking.

## Consequences

Published repository size stays focused on the live site. A new runtime asset must be referenced by the page code and included in tests before it is committed.
