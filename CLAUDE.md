# Vivid Life Theme — PowerShell

PowerShell port of the Vivid Life Theme design system (4 flavors × 6 variants = 24 themes, WCAG AA verified). Companion project to [vivid-life-fish](https://github.com/vivid-life-theme/vivid-life-fish) and [vivid-life-vs-code](https://github.com/vivid-life-theme/vivid-life-vs-code).

## Key Config Files

| File                                       | Purpose                                                          |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `build.mjs`                                | Generates `themes/*.ps1` from `@vivid-life-theme/design-system`  |
| `.claude/learnings.md`                     | Auto-collected corrections/observations from config skill runs   |
| `CLAUDE.md`                                | Project instructions, loaded every message                       |
| `.claude/settings.json`                    | Permissions, hooks, environment variables                        |
| `.claude/skills/vivid-life-theme/SKILL.md` | Fetches the design-system tokens/foundation for building themes  |
| `.githooks/pre-commit`                     | Runs `scripts/sync-config-table.sh` before each commit           |
| `.github/workflows/claude-code-review.yml` | Auto-review on PR open/update                                    |
| `.github/workflows/claude.yml`             | `@claude` mention trigger in issues/PRs                          |
| `.gitignore`                               | Git ignore patterns                                              |
| `package.json`                             | npm scripts (`build`, `test`, `format`) and design-system devDep |
| `scripts/sync-config-table.sh`             | Keeps this Key Config Files table in sync with the filesystem    |

<!-- cc-config: last-optimize-run: 2026-08-28 HEAD -->

## Commands

- `npm run build` — regenerate `themes/*.ps1` from `@vivid-life-theme/design-system` (via `build.mjs`)
- `npm test` — run `src/theme-template.test.mjs` (node:test)
- `npm run format` / `npm run format:check` — prettier

## Structure

- `themes/*.ps1` — generated output, one file per flavor×variant (`vivid-life-<flavor>-<variant>.ps1`). **Never hand-edit** — edit `src/theme-template.mjs` and rebuild.
- `src/theme-template.mjs` — pure `buildTheme(flavor, variant, tokens)` mapping foundation tokens to PSReadLine `Set-PSReadLineOption -Colors` tokens and `$PSStyle.Formatting.*`/`$PSStyle.FileInfo.*` properties.
- `build.mjs` — iterates all 24 combinations and writes `themes/`.
- Themes require PowerShell 7.2+ (`$PSStyle`); dot-source a theme script from `$PROFILE` — don't `&`-invoke it, it must run in the caller's scope.

## References

Use the `vivid-life-theme` skill to fetch the design-system tokens (`tokens.json`) and system overview before writing `src/theme-template.mjs` — do not hardcode colors from memory.

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
