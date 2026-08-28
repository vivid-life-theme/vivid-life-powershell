// Reads foundation tokens from @vivid-life-theme/design-system, emits:
// - one PowerShell .ps1 theme script per (flavor, variant) into themes/
// - a publishable module (VividLifePowerShell.psd1 + .psm1) into
//   VividLifePowerShell/, for `Install-Module` (PowerShell Gallery) installs

import {
  mkdirSync,
  writeFileSync,
  readdirSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tokens from "@vivid-life-theme/design-system";

import { buildTheme } from "./src/theme-template.mjs";
import {
  buildModule,
  buildManifest,
  MODULE_NAME,
} from "./src/module-template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "themes");
const MODULE_DIR = join(__dirname, MODULE_NAME);

const flavors = ["midnight", "twilight", "dawn", "noon"];
const variants = tokens.variant_hues;

mkdirSync(THEMES_DIR, { recursive: true });

// Clean stale theme files so renames don't leave orphans.
for (const file of readdirSync(THEMES_DIR)) {
  if (file.endsWith(".ps1")) {
    rmSync(join(THEMES_DIR, file));
  }
}

let count = 0;
for (const flavor of flavors) {
  for (const variant of variants) {
    const content = buildTheme(flavor, variant, tokens);
    const fileName = `vivid-life-${flavor}-${variant}.ps1`;
    writeFileSync(join(THEMES_DIR, fileName), content, "utf8");
    count++;
  }
}

console.log(
  `Built ${count} themes (${flavors.length} flavors x ${variants.length} variants) into themes/`,
);

const { version } = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf8"),
);

mkdirSync(MODULE_DIR, { recursive: true });
writeFileSync(
  join(MODULE_DIR, `${MODULE_NAME}.psm1`),
  buildModule(tokens),
  "utf8",
);
writeFileSync(
  join(MODULE_DIR, `${MODULE_NAME}.psd1`),
  buildManifest(version),
  "utf8",
);

console.log(`Built ${MODULE_NAME} module (v${version}) into ${MODULE_NAME}/`);
