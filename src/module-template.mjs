// Maps Vivid Life foundation tokens to a publishable PowerShell module
// (VividLifePowerShell.psd1 + .psm1) exposing a single Set-VividLifeTheme
// cmdlet — the PowerShell Gallery install path (`Install-Module`), as
// opposed to src/theme-template.mjs's 24 standalone dot-sourceable scripts
// (the git-clone install path). Module functions are private to the module
// scope by default, so — unlike the standalone scripts — no `& { ... }`
// wrapper is needed to keep helpers out of the caller's session.
//
// All 24 themes are baked into one data table of canonical color fields;
// a single apply function derives every PSReadLine/`$PSStyle` assignment
// from those fields, mirroring the exact mapping decisions in
// theme-template.mjs (Operator -> Keyword, Variable -> Constant, etc.) so
// the two install paths never drift apart.

import { rgbTriple } from "./rgb.mjs";

export const MODULE_NAME = "VividLifePowerShell";
// Permanent PowerShell Gallery identity for this module — never regenerate,
// changing it would make the Gallery treat republishes as a different module.
export const MODULE_GUID = "7eb9cef9-0265-4a3e-b246-ed8a43e6f7f3";

const flavorPascal = {
  midnight: "Midnight",
  twilight: "Twilight",
  dawn: "Dawn",
  noon: "Noon",
};
const variantPascal = {
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue",
  purple: "Purple",
};

function resolveAccent(tokens, flavor, variant) {
  const shade = tokens.accent_shade[flavor][variant];
  return tokens.palette[variant][shade];
}

function psArray(triple) {
  return `@(${triple[0]}, ${triple[1]}, ${triple[2]})`;
}

// Canonical per-theme fields. Composed roles (Operator, Variable, Member,
// Verbose, Debug, TableHeader, Directory, SymbolicLink, ErrorAccent, ...)
// are derived from these in the apply function, not stored redundantly here.
function themeFields(flavor, variant, tokens) {
  const f = tokens.flavors[flavor];
  const { text, state, semantic, syntax } = f;
  return {
    Fg: text.fg,
    FgSubtle: text.fg_subtle,
    FgMuted: text.fg_muted,
    Comment: syntax.comment,
    Keyword: syntax.keyword,
    StringColor: syntax.string,
    NumberColor: syntax.number,
    Accent: resolveAccent(tokens, flavor, variant),
    Parameter: syntax.parameter,
    TypeColor: syntax.type,
    Constant: syntax.constant,
    FunctionColor: syntax.function,
    Info: semantic.info,
    Danger: semantic.danger,
    Warning: semantic.warning,
    Success: semantic.success,
    SelectionBg: state.selection,
  };
}

export function buildThemeTable(tokens) {
  const flavors = ["midnight", "twilight", "dawn", "noon"];
  const variants = tokens.variant_hues;

  const entries = [];
  for (const flavor of flavors) {
    for (const variant of variants) {
      const fields = themeFields(flavor, variant, tokens);
      const key = `${flavorPascal[flavor]}-${variantPascal[variant]}`;
      const lines = Object.entries(fields).map(
        ([name, hex]) => `        ${name} = ${psArray(rgbTriple(hex))}`,
      );
      entries.push([`    '${key}' = @{`, ...lines, "    }"].join("\n"));
    }
  }

  return ["$script:VividLifeThemes = @{", entries.join("\n"), "}"].join("\n");
}

const APPLY_FUNCTION = `
function script:ConvertTo-VividLifeForeground([int[]]$Triple) {
    $PSStyle.Foreground.FromRgb($Triple[0], $Triple[1], $Triple[2])
}

function script:ConvertTo-VividLifeBackground([int[]]$Triple) {
    $PSStyle.Background.FromRgb($Triple[0], $Triple[1], $Triple[2])
}

function script:Set-VividLifeProperty([scriptblock]$Assign) {
    try { & $Assign } catch { }
}

function script:Set-VividLifeColors([hashtable]$Theme) {
    if (-not $PSStyle) {
        Write-Warning 'Vivid Life Theme requires PowerShell 7.2+ ($PSStyle). Skipping theme.'
        return
    }

    if (Get-Module -ListAvailable -Name PSReadLine) {
        Set-PSReadLineOption -Colors @{
            Default             = (ConvertTo-VividLifeForeground $Theme['Fg'])
            Comment             = (ConvertTo-VividLifeForeground $Theme['Comment'])
            Keyword             = (ConvertTo-VividLifeForeground $Theme['Keyword'])
            String              = (ConvertTo-VividLifeForeground $Theme['StringColor'])
            Number              = (ConvertTo-VividLifeForeground $Theme['NumberColor'])
            Command             = (ConvertTo-VividLifeForeground $Theme['Accent'])
            Parameter           = (ConvertTo-VividLifeForeground $Theme['Parameter'])
            Operator            = (ConvertTo-VividLifeForeground $Theme['Keyword'])
            Type                = (ConvertTo-VividLifeForeground $Theme['TypeColor'])
            Variable            = (ConvertTo-VividLifeForeground $Theme['Constant'])
            Member              = (ConvertTo-VividLifeForeground $Theme['FunctionColor'])
            Emphasis            = (ConvertTo-VividLifeForeground $Theme['Info'])
            Error               = (ConvertTo-VividLifeForeground $Theme['Danger'])
            ContinuationPrompt  = (ConvertTo-VividLifeForeground $Theme['FgSubtle'])
            InlinePrediction    = (ConvertTo-VividLifeForeground $Theme['FgSubtle'])
            Selection           = "$(ConvertTo-VividLifeForeground $Theme['Fg'])$(ConvertTo-VividLifeBackground $Theme['SelectionBg'])"
        }

        try {
            Set-PSReadLineOption -Colors @{
                ListPrediction         = (ConvertTo-VividLifeForeground $Theme['FgMuted'])
                ListPredictionSelected = "$(ConvertTo-VividLifeForeground $Theme['Fg'])$(ConvertTo-VividLifeBackground $Theme['SelectionBg'])"
            }
        } catch { }
    }

    Set-VividLifeProperty { $PSStyle.Formatting.FormatAccent = (ConvertTo-VividLifeForeground $Theme['Accent']) }
    Set-VividLifeProperty { $PSStyle.Formatting.TableHeader = $PSStyle.Bold + (ConvertTo-VividLifeForeground $Theme['Accent']) }
    Set-VividLifeProperty { $PSStyle.Formatting.CustomTableHeaderLabel = $PSStyle.Bold + (ConvertTo-VividLifeForeground $Theme['Accent']) }
    Set-VividLifeProperty { $PSStyle.Formatting.Error = (ConvertTo-VividLifeForeground $Theme['Danger']) }
    Set-VividLifeProperty { $PSStyle.Formatting.ErrorAccent = $PSStyle.Bold + (ConvertTo-VividLifeForeground $Theme['Danger']) }
    Set-VividLifeProperty { $PSStyle.Formatting.Warning = (ConvertTo-VividLifeForeground $Theme['Warning']) }
    Set-VividLifeProperty { $PSStyle.Formatting.Verbose = (ConvertTo-VividLifeForeground $Theme['Info']) }
    Set-VividLifeProperty { $PSStyle.Formatting.Debug = (ConvertTo-VividLifeForeground $Theme['FgSubtle']) }

    Set-VividLifeProperty { $PSStyle.FileInfo.Directory = $PSStyle.Bold + (ConvertTo-VividLifeForeground $Theme['Accent']) }
    Set-VividLifeProperty { $PSStyle.FileInfo.SymbolicLink = (ConvertTo-VividLifeForeground $Theme['Constant']) }
    Set-VividLifeProperty { $PSStyle.FileInfo.Executable = (ConvertTo-VividLifeForeground $Theme['Success']) }
}

function Set-VividLifeTheme {
    <#
    .SYNOPSIS
        Applies a Vivid Life Theme color scheme to PSReadLine and $PSStyle.
    .DESCRIPTION
        Sets PSReadLine syntax-highlighting colors and, on PowerShell 7.2+,
        $PSStyle.Formatting / $PSStyle.FileInfo colors for the given flavor
        and variant. Run it from your $PROFILE to apply on every session.
    .PARAMETER Flavor
        One of Midnight, Twilight, Dawn, Noon. Defaults to Midnight.
    .PARAMETER Variant
        One of Red, Orange, Yellow, Green, Blue, Purple. Defaults to Purple.
    .EXAMPLE
        Set-VividLifeTheme
        Applies the default Midnight/Purple theme.
    .EXAMPLE
        Set-VividLifeTheme -Flavor Dawn -Variant Blue
    #>
    [CmdletBinding()]
    param(
        [ValidateSet('Midnight', 'Twilight', 'Dawn', 'Noon')]
        [string]$Flavor = 'Midnight',

        [ValidateSet('Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple')]
        [string]$Variant = 'Purple'
    )

    $key = "$Flavor-$Variant"
    $theme = $script:VividLifeThemes[$key]
    if (-not $theme) {
        throw "Unknown Vivid Life theme: $key"
    }

    Set-VividLifeColors -Theme $theme
}

Export-ModuleMember -Function Set-VividLifeTheme
`.trim();

export function buildModule(tokens) {
  return [
    "# Generated by vivid-life-powershell — do not hand-edit.",
    "# Edit src/module-template.mjs and rebuild.",
    "",
    buildThemeTable(tokens),
    "",
    APPLY_FUNCTION,
    "",
  ].join("\n");
}

export function buildManifest(version) {
  return `@{
    RootModule        = '${MODULE_NAME}.psm1'
    ModuleVersion     = '${version}'
    GUID              = '${MODULE_GUID}'
    Author            = 'Michael van Laar'
    CompanyName       = 'Vivid Life Theme'
    Copyright         = '(c) Michael van Laar. MIT License.'
    Description       = 'A multi-flavor color theme for PowerShell (PSReadLine + $PSStyle). 4 flavors x 6 variants = 24 themes. WCAG AA verified.'
    PowerShellVersion = '7.2'
    FunctionsToExport = @('Set-VividLifeTheme')
    CmdletsToExport   = @()
    VariablesToExport = @()
    AliasesToExport   = @()
    PrivateData       = @{
        PSData = @{
            Tags         = @('theme', 'color-theme', 'psreadline', 'pwsh', 'powershell', 'wcag', 'accessibility', 'vivid-life')
            LicenseUri   = 'https://github.com/vivid-life-theme/vivid-life-powershell/blob/main/LICENSE'
            ProjectUri   = 'https://github.com/vivid-life-theme/vivid-life-powershell'
        }
    }
}
`;
}
