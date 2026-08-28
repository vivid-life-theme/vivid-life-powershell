@{
    RootModule        = 'VividLifePowerShell.psm1'
    ModuleVersion     = '0.1.0'
    GUID              = '7eb9cef9-0265-4a3e-b246-ed8a43e6f7f3'
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
