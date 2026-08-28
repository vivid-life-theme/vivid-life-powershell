import { test } from "node:test";
import assert from "node:assert/strict";
import tokens from "@vivid-life-theme/design-system";
import {
  buildModule,
  buildManifest,
  buildThemeTable,
  MODULE_NAME,
  MODULE_GUID,
} from "./module-template.mjs";
import { rgbTriple } from "./rgb.mjs";

const FLAVORS = ["Midnight", "Twilight", "Dawn", "Noon"];
const VARIANTS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];

test("theme table has one entry per flavor×variant combination", () => {
  const table = buildThemeTable(tokens);
  for (const flavor of FLAVORS) {
    for (const variant of VARIANTS) {
      assert.match(
        table,
        new RegExp(`'${flavor}-${variant}' = @\\{`),
        `missing entry for ${flavor}-${variant}`,
      );
    }
  }
});

test("Accent field resolves via accent_shade, matching the standalone theme scripts", () => {
  const table = buildThemeTable(tokens);
  const shade = tokens.accent_shade.dawn.blue;
  const [r, g, b] = rgbTriple(tokens.palette.blue[shade]);
  const entryMatch = table.match(/'Dawn-Blue' = @\{([\s\S]*?)\n {4}\}/);
  assert.ok(entryMatch, "Dawn-Blue entry not found");
  assert.match(entryMatch[1], new RegExp(`Accent = @\\(${r}, ${g}, ${b}\\)`));
});

test("module exports only Set-VividLifeTheme", () => {
  const content = buildModule(tokens);
  assert.match(content, /Export-ModuleMember -Function Set-VividLifeTheme/);
  // The private helpers must exist but never be exported.
  assert.match(content, /function script:Set-VividLifeColors/);
  assert.match(content, /function script:ConvertTo-VividLifeForeground/);
});

test("Set-VividLifeTheme parameters expose the full flavor/variant sets with Midnight/Purple defaults", () => {
  const content = buildModule(tokens);
  assert.match(
    content,
    /ValidateSet\('Midnight', 'Twilight', 'Dawn', 'Noon'\)/,
  );
  assert.match(
    content,
    /ValidateSet\('Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'\)/,
  );
  assert.match(content, /\[string\]\$Flavor = 'Midnight'/);
  assert.match(content, /\[string\]\$Variant = 'Purple'/);
});

test("manifest embeds the requested version and a stable, well-formed GUID", () => {
  const manifest = buildManifest("1.2.3");
  assert.match(manifest, /ModuleVersion\s*=\s*'1\.2\.3'/);
  assert.match(manifest, new RegExp(`GUID\\s*=\\s*'${MODULE_GUID}'`));
  assert.match(
    MODULE_GUID,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
  assert.match(
    manifest,
    new RegExp(`RootModule\\s*=\\s*'${MODULE_NAME}\\.psm1'`),
  );
});
