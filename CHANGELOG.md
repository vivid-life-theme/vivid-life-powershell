# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- 24 PowerShell themes (4 flavors × 6 variants), generated from the Vivid Life design-system foundation
- Standalone dot-sourceable scripts (`themes/*.ps1`) for a git-clone install
- Publishable PowerShell module (`VividLifePowerShell/`) exposing `Set-VividLifeTheme -Flavor <Flavor> -Variant <Variant>`, for `Install-Module` (PowerShell Gallery)

### Fixed

- PSReadLine 2.1.0 (bundled with PowerShell 7.2) rejects `ListPrediction`/`ListPredictionSelected`; both the standalone scripts and the module now send those in a separate, try/catch-wrapped call so older PSReadLine still gets full core syntax coloring
- `$PSStyle.Formatting`/`.FileInfo` property assignments are now wrapped individually since the member set has grown across PowerShell releases past 7.2
