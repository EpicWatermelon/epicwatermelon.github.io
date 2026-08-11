# ADR 0004: Keep the bilingual interface framework-free

- Status: Accepted
- Date: 2026-07-30

## Context

The portfolio needs English and Chinese content while remaining a single deployable static page. Adding a framework or build pipeline would increase publishing complexity without a corresponding product need.

## Decision

Use a small local `assets/js/i18n.js` script and `data-i18n` markers to translate existing content in place. Store the selected language locally and preserve semantic markup, keyboard behavior, and accessible labels.

## Consequences

The site remains easy to publish from `main`. New public copy must include its translation keys and be covered by the bilingual-content tests.
