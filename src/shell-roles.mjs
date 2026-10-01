// PSReadLine colors, read from the design system's `shell_roles` map instead
// of chosen port-side (so fish and PowerShell color one command line alike).
// Shell text renders on `bg_terminal`, so `overlay.*` targets resolve over it.

import { resolveColor } from "@vivid-life-theme/design-system/tools/build-tokens";

// Added in PSReadLine 2.2.0 — sent separately so 2.1.0 (bundled with
// PowerShell 7.2) still gets every other key.
const PREDICTION_KEYS = new Set(["ListPrediction", "ListPredictionSelected"]);

// -> [{ key, fg, bg? }] for every PSReadLine key a shell role feeds.
export function psreadlineColors(tokens, flavor, variant) {
  const resolve = (target) =>
    resolveColor(tokens, flavor, variant, target, { surface: "bg_terminal" });
  return Object.values(tokens.shell_roles.roles).flatMap((role) =>
    role.psreadline.map((key) => ({
      key,
      fg: resolve(role.color),
      ...(role.background && { bg: resolve(role.background) }),
      prediction: PREDICTION_KEYS.has(key),
    })),
  );
}
