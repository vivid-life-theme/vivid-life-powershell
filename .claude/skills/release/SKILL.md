---
name: release
description: Release skill for vivid-life-powershell — bumps version, updates CHANGELOG, commits, tags, and pushes. CI handles Publish-Module. Use only when intentionally cutting a release.
disable-model-invocation: true
---

# PowerShell Gallery Publish Skill

Runs the full release sequence for vivid-life-powershell: pre-flight → version bump → CHANGELOG update → commit → tag → push. The actual `Publish-Module` runs in GitHub Actions after the tag lands.

## Pre-flight

Run all checks before doing anything else. Stop and report clearly if any fail.

- Verify on `main`: `git branch --show-current` must output `main`
- Verify working tree clean: `git status --porcelain` must produce no output
- Verify build passes: `npm run build` must exit without error
- Verify build produced no drift: `git status --porcelain` must again produce no output — `themes/*.ps1` and `VividLifePowerShell/` are committed, generated artifacts, so a diff here means the tokens dependency or template changed without the regenerated output being committed
- Verify tests pass: `npm test` must exit without error

## CHANGELOG Check

Read `CHANGELOG.md`. Locate the `## [Unreleased]` section.

If it contains no entries (only the heading and surrounding blank lines), stop:

> The `[Unreleased]` section in CHANGELOG.md is empty. Document what changed before running `/release`.

Otherwise show the user the full contents of the `[Unreleased]` section and continue.

## Version Confirmation

Read `"version"` from `package.json` and show the current value.

Show the `[Unreleased]` contents again as context.

Ask the user to confirm the new version number. Suggest the appropriate bump:

- Patch (X.Y.Z+1): bug fixes, documentation updates
- Minor (X.Y+1.0): new themes, new variants, new features (e.g. the module packaging)
- Major (X+1.0.0): breaking changes to theme naming, `Set-VividLifeTheme`'s parameters, or the module's exported surface

If this is the first-ever release (no existing `v*` git tags — check with `git tag -l 'v*'`), the current `package.json` version (already `0.1.0`, never tagged) may stand as-is rather than being bumped further.

Wait for the user to confirm before proceeding.

## Bump Version

Edit `package.json`: change `"version"` to the confirmed version string.

Run `npm run build` again so `VividLifePowerShell/VividLifePowerShell.psd1`'s `ModuleVersion` (sourced from `package.json` at build time) picks up the new version. Confirm with `grep ModuleVersion VividLifePowerShell/VividLifePowerShell.psd1`.

## Update CHANGELOG

Edit `CHANGELOG.md`:

1. Replace the `## [Unreleased]` heading with `## [X.Y.Z] - YYYY-MM-DD` where `YYYY-MM-DD` is today's date in ISO 8601 format
2. Insert a new `## [Unreleased]` section at the top (before the versioned entry), with a blank line after the heading

The result should look like:

```
## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD

### <category>

- <entry>

```

## Commit

```bash
git add package.json CHANGELOG.md VividLifePowerShell/VividLifePowerShell.psd1
git commit -m "🔖 chore(release): bump to vX.Y.Z

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

## Tag

```bash
git tag -a vX.Y.Z -m "Version X.Y.Z"
```

## Push

```bash
git push && git push --tags
```

This fires the `publish-to-powershell-gallery.yml` GitHub Actions workflow. `Publish-Module` runs in CI against the committed `VividLifePowerShell/` folder, using the `PSGALLERY_API_KEY` secret — the API key never touches the local machine.

## Confirm

Report to the user:

> Tag vX.Y.Z pushed. Monitor the publish run at: https://github.com/vivid-life-theme/vivid-life-powershell/actions
>
> The Gallery listing typically updates within a few minutes of the workflow completing. Verify at: https://www.powershellgallery.com/packages/VividLifePowerShell
