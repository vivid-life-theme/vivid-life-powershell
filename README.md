# Vivid Life Theme — PowerShell

A multi-flavor color theme for [PowerShell](https://learn.microsoft.com/powershell/) (PSReadLine + `$PSStyle`). **4 flavors × 6 variants = 24 themes**, all WCAG AA verified. Generated from the [Vivid Life design-system foundation](https://github.com/vivid-life-theme/vivid-life-design-system) — colors and contrast ratios come from a single source of truth.

## Flavors

In time-of-day order:

| Flavor       | Type  | Canvas    |
| ------------ | ----- | --------- |
| **Midnight** | dark  | `#171717` |
| **Twilight** | dark  | `#404040` |
| **Dawn**     | light | `#d4d4d4` |
| **Noon**     | light | `#f5f5f5` |

## Variants

Each flavor is available in six accent variants: **Red · Orange · Yellow · Green · Blue · Purple**. The variant re-tints the accent (PSReadLine's `Command`/`FormatAccent`/directory color); the rest of the theme stays stable across variants.

## Requirements

PowerShell **7.2+** — themes use `$PSStyle`, introduced in that release. On older hosts, a theme script prints a warning and returns without changing anything.

PowerShell 7.2 itself bundles **PSReadLine 2.1.0**, which predates the prediction-list colors (`ListPrediction`/`ListPredictionSelected`) — every theme still applies full syntax-highlighting colors on 2.1.0, just without those two. Check your version with `(Get-Module PSReadLine).Version` and, if you want prediction-list coloring, upgrade with:

```powershell
Install-Module -Name PSReadLine -MinimumVersion 2.2.0 -Force -SkipPublisherCheck
```

## Install

### Manual

```powershell
git clone https://github.com/vivid-life-theme/vivid-life-powershell.git
```

Dot-source one theme from your `$PROFILE`. If you don't have a profile yet, create one first:

```powershell
if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

Then add this line to it:

```powershell
. /path/to/vivid-life-powershell/themes/vivid-life-midnight-purple.ps1
```

Dot-sourcing (not `&`-invoking) is required — the script sets `$PSStyle` and PSReadLine options in your current session scope.

Default: **Midnight · Purple** (`vivid-life-midnight-purple`), matching the design system's overall default.

## Scope

PowerShell's theme-able surface is `Set-PSReadLineOption -Colors` (shell syntax highlighting, prediction list) plus `$PSStyle.Formatting.*` and `$PSStyle.FileInfo.*` (PS 7.2+ output formatting: errors, warnings, tables, directory listings). There is no shell-wide ANSI terminal palette to set here; that's the terminal emulator's job and out of scope for this port — same boundary the [fish port](https://github.com/vivid-life-theme/vivid-life-fish) draws.

## Recommended companion

**Font** — [Atkinson Hyperlegible Mono](https://www.brailleinstitute.org/freefont) for the terminal, or its [Nerd Font variant](https://www.nerdfonts.com/font-downloads) if your prompt (e.g. [Starship](https://starship.rs)) uses icon glyphs.

## Contributing

```bash
npm install
npm run build   # regenerate themes/*.ps1 from the design-system tokens
npm test        # verify the mapping
npm run format  # prettier
```

Edit `src/theme-template.mjs` to change how foundation tokens map to PSReadLine/`$PSStyle` properties — never hand-edit files under `themes/`, they're generated.

If you need a color or token not in the foundation, that's a foundation gap — open an issue against [vivid-life-design-system](https://github.com/vivid-life-theme/vivid-life-design-system) rather than papering over it here.
