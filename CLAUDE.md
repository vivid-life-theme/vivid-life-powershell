# Vivid Life Theme — PowerShell

PowerShell port of the Vivid Life Theme design system (4 flavors × 6 variants = 24 themes, WCAG AA verified). Companion project to [vivid-life-fish](https://github.com/vivid-life-theme/vivid-life-fish) and [vivid-life-vs-code](https://github.com/vivid-life-theme/vivid-life-vs-code).

## Key Config Files

| File                                                  | Purpose                                                          |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| `build.mjs`                                           | Generates `themes/*.ps1` from `@vivid-life-theme/design-system`  |
| `.claude/learnings.md`                                | Auto-collected corrections/observations from config skill runs   |
| `CLAUDE.md`                                           | Project instructions, loaded every message                       |
| `.claude/settings.json`                               | Permissions, hooks, environment variables                        |
| `.claude/skills/release/SKILL.md`                     | `/release` skill: version bump → CHANGELOG → tag → push          |
| `.claude/skills/vivid-life-theme/SKILL.md`            | Fetches the design-system tokens/foundation for building themes  |
| `.githooks/pre-commit`                                | Runs `scripts/sync-config-table.sh` before each commit           |
| `.github/workflows/claude-code-review.yml`            | Auto-review on PR open/update                                    |
| `.github/workflows/claude.yml`                        | `@claude` mention trigger in issues/PRs                          |
| `.github/workflows/publish-to-powershell-gallery.yml` | `Publish-Module` on `v*` tag push (needs `PSGALLERY_API_KEY`)    |
| `.gitignore`                                          | Git ignore patterns                                              |
| `package.json`                                        | npm scripts (`build`, `test`, `format`) and design-system devDep |
| `scripts/sync-config-table.sh`                        | Keeps this Key Config Files table in sync with the filesystem    |

<!-- cc-config: last-optimize-run: 2026-08-28 HEAD -->

## Commands

- `npm run build` — regenerate `themes/*.ps1` **and** `VividLifePowerShell/` from `@vivid-life-theme/design-system` (via `build.mjs`)
- `npm test` — run `src/theme-template.test.mjs` and `src/module-template.test.mjs` (node:test)
- `npm run format` / `npm run format:check` — prettier

## Structure

Two install paths generated from the same foundation tokens — keep them in sync when changing the mapping:

- `themes/*.ps1` — standalone scripts, one per flavor×variant (`vivid-life-<flavor>-<variant>.ps1`), dot-sourced directly from `$PROFILE`. **Never hand-edit** — edit `src/theme-template.mjs` and rebuild.
- `VividLifePowerShell/` — a publishable module (`VividLifePowerShell.psd1` + `.psm1`) exposing one cmdlet, `Set-VividLifeTheme -Flavor <Flavor> -Variant <Variant>`, for `Install-Module` (PowerShell Gallery). **Never hand-edit** — edit `src/module-template.mjs` and rebuild.
- `src/theme-template.mjs` — pure `buildTheme(flavor, variant, tokens)` mapping foundation tokens to PSReadLine `Set-PSReadLineOption -Colors` tokens and `$PSStyle.Formatting.*`/`$PSStyle.FileInfo.*` properties.
- `src/module-template.mjs` — bakes all 24 themes into one data table (`buildThemeTable`) plus a shared apply function (`buildModule`) and manifest (`buildManifest`); mirrors the exact same mapping decisions as `theme-template.mjs` so the two paths don't drift.
- `src/rgb.mjs` — shared hex→RGB parsing used by both templates.
- `build.mjs` — iterates all 24 combinations and writes both `themes/` and `VividLifePowerShell/`.
- Both require PowerShell 7.2+ (`$PSStyle`). Standalone scripts must be dot-sourced (not `&`-invoked) to run in the caller's scope; the module keeps helpers module-private automatically (only `Set-VividLifeTheme` is exported).
- PowerShell 7.2 bundles PSReadLine 2.1.0, which rejects `ListPrediction`/`ListPredictionSelected` (added in 2.2.0) — both templates send those in a separate try/catch-wrapped call so older PSReadLine still gets full core coloring. `$PSStyle.Formatting`/`.FileInfo` assignments are similarly wrapped per-property since the member set has grown past 7.2. Verify any template change against a real `pwsh` (available in this environment), not just unit tests — the unit tests check string shape, not runtime validity.
- The module's GUID (`MODULE_GUID` in `src/module-template.mjs`) is permanent — never regenerate it, that would make the PowerShell Gallery treat a republish as a different module.
- Not yet published to the PowerShell Gallery. Publishing is handled by the `release` skill (`/release`): it bumps the version, updates `CHANGELOG.md`, tags, and pushes; the tag push triggers `.github/workflows/publish-to-powershell-gallery.yml`, which runs `Publish-Module` in CI using the `PSGALLERY_API_KEY` repo secret. Never attempt `Publish-Module` directly from here — it needs the maintainer's own API key and is a one-way action.

## References

Use the `vivid-life-theme` skill to fetch the design-system tokens (`tokens.json`) and system overview before writing `src/theme-template.mjs` or `src/module-template.mjs` — do not hardcode colors from memory.

## Conventions

- 24 themes = 4 flavors × 6 variants. Keep flavor/variant naming consistent with the upstream design-system and the other ports (fish, VS Code).
- PowerShell's theme-able surface: PSReadLine syntax-highlighting colors (`Set-PSReadLineOption -Colors`) and, on PowerShell 7+, `$PSStyle.Formatting.*` / `$PSStyle.FileInfo.*` output colors. There is no shell-wide ANSI terminal palette to set here — that belongs to the terminal emulator, out of scope for this port (same boundary the fish port draws).

## Don't

- Don't commit secrets or credentials to git
- Don't use --force flags — fix the underlying issue instead
- Don't hardcode color values without pulling them from the design-system tokens via the `vivid-life-theme` skill

## Learnings

When the user corrects a mistake or points out a recurring issue, append a one-line summary to .claude/learnings.md. Don't modify CLAUDE.md directly.

## Compact Instructions

When compacting, preserve: list of modified files, current test status, open TODOs, and key decisions made.
