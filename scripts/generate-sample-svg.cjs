/**
 * Generates `scripts/preview-*.svg` files used in the README.
 *
 * Run: node scripts/generate-sample-svg.cjs
 */

const fs = require("fs");
const path = require("path");

const { toSvg } = require("../dist/geo/index.cjs");
const { NEPAL_DISTRICTS_GEO } = require("../dist/geo/districts.cjs");
const { NEPAL_PROVINCES_GEO } = require("../dist/geo/provinces.cjs");
const { NEPAL_LOCAL_UNITS_GEO } = require("../dist/geo/local-units.cjs");

/**
 * Province palette — curated for Nepal's geographic gradient.
 * Inspired by Edward Tufte / d3-scale-chromatic, tuned for light backgrounds.
 *
 * P1 Koshi          Eastern hills + terai → crimson (Nepal flag)
 * P2 Madhesh        Southern plains       → warm sand
 * P3 Bagmati        Capital region        → teal
 * P4 Gandaki        Central hills         → steel blue (Annapurna sky)
 * P5 Lumbini        SW plains/hills       → saffron (Buddha's birthplace)
 * P6 Karnali        High Himalaya         → royal purple
 * P7 Sudurpashchim  Far west              → vibrant orange
 */
const PROVINCE_COLORS = {
  P1: "#E63946",
  P2: "#F4A261",
  P3: "#2A9D8F",
  P4: "#457B9D",
  P5: "#E9C46A",
  P6: "#7209B7",
  P7: "#F77F00",
};

const BG_LIGHT = "#F8FAFC";    // near-white, faint cool tint
const BG_DARK = "#0F172A";     // slate-900

// 1) Districts coloured by province (light-theme version, used in README)
const districtsSvg = toSvg(NEPAL_DISTRICTS_GEO, {
  width: 960,
  padding: 16,
  fill: (f) => PROVINCE_COLORS[f.properties.provinceId] || "#cbd5e1",
  stroke: "#FFFFFF",
  strokeWidth: 0.6,
  background: BG_LIGHT,
  title: "Nepal — 77 districts coloured by province (चुच्चे map)",
  featureAttrs: (f) => ({
    "data-province": f.properties.provinceId,
    "data-name": f.properties.nameEn,
  }),
});
fs.writeFileSync(path.join(__dirname, "preview-districts.svg"), districtsSvg);
console.log(`Wrote preview-districts.svg (${districtsSvg.length} bytes)`);

// 2) Province polygons (the same 7-color palette, slightly thicker strokes)
const provincesSvg = toSvg(NEPAL_PROVINCES_GEO, {
  width: 960,
  padding: 16,
  fill: (f) => PROVINCE_COLORS[f.properties.id] || "#cbd5e1",
  stroke: "#FFFFFF",
  strokeWidth: 1.2,
  background: BG_LIGHT,
  title: "Nepal — 7 provinces (चुच्चे map)",
});
fs.writeFileSync(path.join(__dirname, "preview-provinces.svg"), provincesSvg);
console.log(`Wrote preview-provinces.svg (${provincesSvg.length} bytes)`);

// 3) Highlighted single district (Kathmandu) on a muted base
const highlightSvg = toSvg(NEPAL_DISTRICTS_GEO, {
  width: 960,
  padding: 16,
  fill: (f) => (f.properties.id === "P3.D05" ? "#E63946" : "#E2E8F0"),
  stroke: "#FFFFFF",
  strokeWidth: 0.4,
  background: BG_LIGHT,
  title: "Nepal — Kathmandu district highlighted",
});
fs.writeFileSync(path.join(__dirname, "preview-highlight.svg"), highlightSvg);
console.log(`Wrote preview-highlight.svg (${highlightSvg.length} bytes)`);

// 4) Dark-theme variant (for README dark-mode readers)
const darkSvg = toSvg(NEPAL_DISTRICTS_GEO, {
  width: 960,
  padding: 16,
  fill: (f) => PROVINCE_COLORS[f.properties.provinceId] || "#475569",
  stroke: BG_DARK,
  strokeWidth: 0.5,
  background: BG_DARK,
  title: "Nepal — districts (dark theme)",
});
fs.writeFileSync(path.join(__dirname, "preview-dark.svg"), darkSvg);
console.log(`Wrote preview-dark.svg (${darkSvg.length} bytes)`);

// 5) Palika-level map — all 753 local units coloured by province
const palikaSvg = toSvg(NEPAL_LOCAL_UNITS_GEO, {
  width: 1200,
  padding: 16,
  fill: (f) => PROVINCE_COLORS[f.properties.provinceId] || "#cbd5e1",
  stroke: "#FFFFFF",
  strokeWidth: 0.25,
  background: BG_LIGHT,
  title: "Nepal — all 753 local-level units (palikas)",
  featureAttrs: (f) => ({
    "data-name": f.properties.nameEn,
    "data-type": f.properties.type,
    "data-district": f.properties.districtId,
  }),
});
fs.writeFileSync(path.join(__dirname, "preview-palikas.svg"), palikaSvg);
console.log(`Wrote preview-palikas.svg (${palikaSvg.length} bytes)`);

// 6) Palika-level — by type (metropolitan accents)
const TYPE_COLORS = {
  metropolitan: "#E63946",       // crimson
  "sub-metropolitan": "#F77F00", // orange
  municipality: "#457B9D",       // steel blue
  "rural-municipality": "#A8DADC", // pale teal
};
const palikaTypeSvg = toSvg(NEPAL_LOCAL_UNITS_GEO, {
  width: 1200,
  padding: 16,
  fill: (f) => TYPE_COLORS[f.properties.type] || "#cbd5e1",
  stroke: "#FFFFFF",
  strokeWidth: 0.25,
  background: BG_LIGHT,
  title: "Nepal — palikas coloured by type",
});
fs.writeFileSync(path.join(__dirname, "preview-palikas-by-type.svg"), palikaTypeSvg);
console.log(`Wrote preview-palikas-by-type.svg (${palikaTypeSvg.length} bytes)`);

console.log("\nAll SVG previews generated.");
