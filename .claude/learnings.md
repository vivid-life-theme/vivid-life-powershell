# Learnings

Corrections and observations collected during configuration sessions.
Entries are tagged by skill and dated.

---

[cc-config:bootstrapping-config] Project is a PowerShell port in the vivid-life-theme ecosystem, sibling to vivid-life-fish and vivid-life-vs-code; bootstrap mirrored the fish port's Node.js toolchain (build.mjs + npm) and CLAUDE.md structure by reading the fish repo via `gh api` — 2026-08-28
[cc-config:bootstrapping-config] User chose PSReadLine `Set-PSReadLineOption -Colors` + `$PSStyle.Formatting.*`/`$PSStyle.FileInfo.*` as the output surface for this port (no shell-wide ANSI palette, same boundary as fish) — 2026-08-28
[cc-config:bootstrapping-config] User declined a context/ folder for this repo — domain knowledge stays in CLAUDE.md as it grows — 2026-08-28
