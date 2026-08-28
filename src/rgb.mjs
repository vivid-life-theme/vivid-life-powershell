// Shared hex -> [r, g, b] conversion used by both the standalone theme
// scripts (theme-template.mjs) and the packaged module (module-template.mjs)
// — kept in one place so a parsing bug can't diverge between the two.

export function rgbTriple(hex) {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
