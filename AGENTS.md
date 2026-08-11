# Repository Instructions

This repository is Zhengji Liu's static, single-page portfolio. GitHub Pages publishes the `main` branch directly; there is no build step or framework configuration.

## Working conventions

- Treat `index.html` as the primary page entry point. Keep the site deployable as plain static files.
- Place reusable visual assets under `assets/` and preserve existing paths unless the related markup is updated in the same change.
- Avoid adding dependencies or a bundling pipeline unless the task explicitly requires one.
- Keep the existing motion-reduction and accessibility behavior intact when editing interactions or animation.
- Read `docs/README.md` before editing project documentation and `docs/design/INTERACTION_RULES.md` before changing an easter egg or language-specific interaction.
- 每次完成修改后，读取 `package.json` 的当前版本并更新 `docs/changes/<version>.md`；首次使用该版本时，同时将其登记到 `docs/CHANGELOG.md`。长期设计规则发生变化时，同步更新对应的 `docs/design/` 文档。
- Do not add Deerflow branding, links, or attribution to the public site.
- Preserve unrelated working-tree changes.

## Verification

Run `npm test` after changes that affect the page structure, content scenes, assets, animation, or accessibility behavior. For visual changes, preview locally with `python -m http.server 4173` from the repository root.
