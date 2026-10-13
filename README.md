# Vivid Life Theme — PowerShell

A multi-flavor color theme for [PowerShell](https://learn.microsoft.com/powershell/) (PSReadLine + `$PSStyle`). **4 flavors × 6 variants = 24 themes**, all WCAG AA verified, so your eyes never have to file a bug report. Generated from the [Vivid Life design-system foundation](https://github.com/vivid-life-theme/vivid-life-design-system): colors and contrast ratios come from a single source of truth. Yes, even for the shell that insists on `Verb-Noun`.

## Flavors

In time-of-day order. PowerShell doesn't paint the terminal background (your terminal emulator does), so every color here is checked against the flavor's **terminal background**:

| Flavor       | Type  | Terminal background |
| ------------ | ----- | ------------------- |
| **Midnight** | dark  | `#0a0a0a`           |
| **Twilight** | dark  | `#333333`           |
| **Dawn**     | light | `#d4d4d4`           |
| **Noon**     | light | `#ffffff`           |

For the contrast numbers to hold, pair it with the [Windows Terminal port](https://github.com/vivid-life-theme/vivid-life-windows-terminal) (same flavor, obviously), or set your terminal's background to the value above.

## Variants

Each flavor comes in six accent variants: **Red · Orange · Yellow · Green · Blue · Purple**. The variant re-tints the accent (PSReadLine's `Command`/`FormatAccent`/directory color); everything else stays put across variants.

## Requirements

PowerShell **7.2+**. The themes use `$PSStyle`, which arrived in that release. On older hosts a theme script prints a warning and backs away slowly without touching anything.

PowerShell 7.2 itself bundles **PSReadLine 2.1.0**, which predates the prediction-list colors (`ListPrediction`/`ListPredictionSelected`). Every theme still applies full syntax highlighting on 2.1.0, just without those two. Check your version with `(Get-Module PSReadLine).Version` and, if you want prediction-list coloring, upgrade with:

```powershell
Install-Module -Name PSReadLine -MinimumVersion 2.2.0 -Force -SkipPublisherCheck
```

## Install

### PowerShell Gallery

[VividLifePowerShell](https://www.powershellgallery.com/packages/VividLifePowerShell) is published on the PowerShell Gallery:

```powershell
Install-Module -Name VividLifePowerShell -Scope CurrentUser
```

Add this to your `$PROFILE` (no profile yet? `if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }` makes one):

```powershell
Import-Module VividLifePowerShell
Set-VividLifeTheme -Flavor Midnight -Variant Purple
```

`Set-VividLifeTheme` with no arguments applies the default (Midnight · Purple). Flavor and variant names tab-complete, because typing is overrated.

### Standalone script (no module)

If you'd rather not depend on a module, clone the repo and dot-source one theme script from your `$PROFILE` instead:

```powershell
git clone https://github.com/vivid-life-theme/vivid-life-powershell.git
```

```powershell
if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

```powershell
. /path/to/vivid-life-powershell/themes/vivid-life-midnight-purple.ps1
```

Dot-source it (`.`) from your `$PROFILE`. Invoking it with `&` works too: the script changes `$PSStyle` properties and calls `Set-PSReadLineOption`, and both apply to the whole session, not just the script's own scope.

### Choose a theme

Default: **Midnight · Purple** (`vivid-life-midnight-purple`), matching the design system's overall default. Swap the `-Flavor`/`-Variant` arguments (or the script name) for any of the other 23.

## Scope

PowerShell's themeable surface is `Set-PSReadLineOption -Colors` (syntax highlighting, prediction list) plus `$PSStyle.Formatting.*` and `$PSStyle.FileInfo.*` (PS 7.2+ output formatting: errors, warnings, tables, directory listings). There's no shell-wide ANSI terminal palette to set here. That's the terminal emulator's job, the same boundary the [fish port](https://github.com/vivid-life-theme/vivid-life-fish) draws.

## Recommended companion

**Font:** [Atkinson Hyperlegible Mono](https://www.brailleinstitute.org/freefont) for the terminal, or its [Nerd Font variant](https://www.nerdfonts.com/font-downloads) if your prompt (say, [Starship](https://github.com/vivid-life-theme/vivid-life-starship)) uses icon glyphs.

The rest of the family (terminals, editors, prompts, desktop) lives at [github.com/vivid-life-theme](https://github.com/vivid-life-theme).

## Contributing

```bash
npm install
npm run build   # regenerate themes/*.ps1 and VividLifePowerShell/ from the design-system tokens
npm test        # verify both mappings
npm run format  # prettier
```

Edit `src/theme-template.mjs` (standalone scripts) or `src/module-template.mjs` (the module) to change how foundation tokens map to PSReadLine/`$PSStyle` properties. Both follow the same [design decisions](src/theme-template.mjs), so change them together or they'll drift apart like two forks nobody rebased. Never hand-edit files under `themes/` or `VividLifePowerShell/`: they're generated.

If you need a color or token that isn't in the foundation, that's a foundation gap. Open an issue against [vivid-life-design-system](https://github.com/vivid-life-theme/vivid-life-design-system) rather than papering over it here.

## License

MIT. See [LICENSE](LICENSE).
