import { test } from "node:test";
import assert from "node:assert/strict";
import tokens from "@vivid-life-theme/design-system";
import { resolveColor } from "@vivid-life-theme/design-system/tools/build-tokens";
import { buildTheme } from "./theme-template.mjs";
import { rgbTriple } from "./rgb.mjs";

const FLAVORS = ["midnight", "twilight", "dawn", "noon"];
const VARIANTS = ["red", "orange", "yellow", "green", "blue", "purple"];

function fromRgbCall(hex) {
  const [r, g, b] = rgbTriple(hex);
  return `$PSStyle.Foreground.FromRgb(${r}, ${g}, ${b})`;
}

function bgFromRgbCall(hex) {
  const [r, g, b] = rgbTriple(hex);
  return `$PSStyle.Background.FromRgb(${r}, ${g}, ${b})`;
}

// Full regex-metacharacter escape (MDN's canonical set) — a hand-picked
// subset silently breaks if the input ever contains one of the omitted
// characters, notably a literal backslash.
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("buildTheme produces output for all 24 flavor×variant combinations", () => {
  for (const flavor of FLAVORS) {
    for (const variant of VARIANTS) {
      const content = buildTheme(flavor, variant, tokens);
      assert.match(content, /^# Vivid Life/);
      assert.match(content, /Set-PSReadLineOption -Colors @\{/);
      assert.match(content, /Default\s*=\s*\$PSStyle\.Foreground\.FromRgb/);
      assert.match(content, /Command\s*=\s*\$PSStyle\.Foreground\.FromRgb/);
    }
  }
});

test("requires $PSStyle before touching PSReadLine or formatting", () => {
  const content = buildTheme("midnight", "purple", tokens);
  const guardIndex = content.indexOf("if (-not $PSStyle)");
  const colorsIndex = content.indexOf("Set-PSReadLineOption");
  assert.ok(guardIndex >= 0, "missing $PSStyle guard");
  assert.ok(guardIndex < colorsIndex, "guard must precede PSReadLine setup");
});

test("Command uses the accent resolved from accent_shade", () => {
  const content = buildTheme("midnight", "purple", tokens);
  const shade = tokens.accent_shade.midnight.purple;
  const accent = tokens.palette.purple[shade];
  assert.match(
    content,
    new RegExp(`Command = ${escapeRegExp(fromRgbCall(accent))}`),
  );
});

test("Error maps to semantic.danger in PSReadLine colors and $PSStyle.Formatting", () => {
  const content = buildTheme("dawn", "blue", tokens);
  const danger = tokens.flavors.dawn.semantic.danger;
  const call = escapeRegExp(fromRgbCall(danger));
  assert.match(content, new RegExp(`Error = ${call}`));
  assert.match(
    content,
    new RegExp(`\\$PSStyle\\.Formatting\\.Error = ${call}`),
  );
});

function roleColor(_role, flavor, variant, target) {
  return resolveColor(tokens, flavor, variant, target, {
    surface: "bg_terminal",
  });
}

test("every shell_roles PSReadLine key is emitted with its role's colors", () => {
  for (const flavor of FLAVORS) {
    for (const variant of VARIANTS) {
      const content = buildTheme(flavor, variant, tokens);
      for (const role of Object.values(tokens.shell_roles.roles)) {
        for (const key of role.psreadline) {
          const fg = fromRgbCall(roleColor(role, flavor, variant, role.color));
          const value = role.background
            ? `${fg} + ${bgFromRgbCall(roleColor(role, flavor, variant, role.background))}`
            : fg;
          assert.match(
            content,
            new RegExp(`${key} = ${escapeRegExp(value)}`),
            `${flavor}-${variant} ${key}`,
          );
        }
      }
    }
  }
});

test("ListPredictionSelected uses the selected-row wash over bg_terminal", () => {
  const content = buildTheme("noon", "green", tokens);
  const wash = resolveColor(tokens, "noon", "green", "overlay.selected", {
    surface: "bg_terminal",
  });
  assert.match(
    content,
    new RegExp(
      `ListPredictionSelected = ${escapeRegExp(fromRgbCall(tokens.flavors.noon.text.fg))} \\+ ${escapeRegExp(bgFromRgbCall(wash))}`,
    ),
  );
});

test("Formatting and FileInfo blocks are set outside the PSReadLine module guard", () => {
  const content = buildTheme("twilight", "yellow", tokens);
  assert.match(content, /\$PSStyle\.Formatting\.FormatAccent = /);
  assert.match(content, /\$PSStyle\.FileInfo\.Directory = /);
});
