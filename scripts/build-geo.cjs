/**
 * Build script: simplify the 14MB HDX nepal-districts.geojson into manageable
 * datasets that ship with the package.
 *
 *   - districts.geo.ts  — 77 simplified districts (~150-300 KB)
 *   - provinces.geo.ts  — 7 simplified provinces (dissolved from districts)
 *
 * Simplification: Visvalingam-Whyatt-style area-based point removal. Tunable
 * via a single tolerance constant. Polygons rounded to 4 decimal places of
 * coordinate (≈ 11 m precision in lat/lng) — plenty for any map use case.
 *
 * Source: HDX cod-ab-npl (CC-BY 4.0) — Nepal subnational admin boundaries.
 *
 * Run with: node scripts/build-geo.js
 */

const fs = require("fs");
const path = require("path");

// Source: post-May-2020 चुच्चे (chuche) map of Nepal — includes Kalapani,
// Lipulekh, Limpiyadhura territories. From Acesmndr/nepal-geojson (MIT).
const SRC = path.join(__dirname, "source-districts-chuche.geojson");
const OUT_DIR = path.join(__dirname, "..", "src", "geo");

// Simplification tolerance — area threshold in (deg^2). Smaller = more detail.
// 1e-4 produces ~150-200 KB; 1e-5 gives ~400 KB; 1e-3 ~50 KB but loses detail.
const SIMPLIFY_TOLERANCE = 5e-5;

// Coordinate decimal-precision rounding (4 ≈ 11 m precision).
const COORD_DECIMALS = 4;

function roundCoord(c) {
  return Math.round(c * 1e4) / 1e4;
}

/** Triangle area for VW simplification. */
function triangleArea(p1, p2, p3) {
  return Math.abs(
    (p1[0] * (p2[1] - p3[1]) +
      p2[0] * (p3[1] - p1[1]) +
      p3[0] * (p1[1] - p2[1])) /
      2,
  );
}

/**
 * Visvalingam-Whyatt simplification.
 * Iteratively remove the point with smallest triangle area until threshold met.
 */
function simplifyRing(ring, tolerance) {
  if (ring.length <= 4) return ring;
  // Compute initial areas.
  const points = ring.map((p, i) => ({
    pt: p,
    area: i === 0 || i === ring.length - 1
      ? Infinity
      : triangleArea(ring[i - 1], p, ring[i + 1]),
    prev: i - 1,
    next: i + 1,
  }));

  let count = points.length;
  while (count > 4) {
    // Find min-area point.
    let minIdx = -1;
    let minArea = Infinity;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.area === null) continue;
      if (p.area < minArea) {
        minArea = p.area;
        minIdx = i;
      }
    }
    if (minIdx < 0 || minArea > tolerance) break;
    // Remove this point.
    const p = points[minIdx];
    const prev = points[p.prev];
    const next = points[p.next];
    prev.next = p.next;
    next.prev = p.prev;
    p.area = null;
    count--;
    // Recompute neighbors' areas.
    if (prev.area !== null && prev.prev >= 0 && prev.next < points.length) {
      const pp = points[prev.prev];
      const nn = points[prev.next];
      if (pp && nn) prev.area = Math.max(triangleArea(pp.pt, prev.pt, nn.pt), prev.area);
    }
    if (next.area !== null && next.prev >= 0 && next.next < points.length) {
      const pp = points[next.prev];
      const nn = points[next.next];
      if (pp && nn) next.area = Math.max(triangleArea(pp.pt, next.pt, nn.pt), next.area);
    }
  }

  // Walk the linked list and emit kept points.
  const out = [];
  let i = 0;
  while (i !== points.length - 1) {
    out.push(points[i].pt.map(roundCoord));
    i = points[i].next;
  }
  out.push(points[i].pt.map(roundCoord));
  // Ensure ring closure.
  if (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1]) {
    out.push([out[0][0], out[0][1]]);
  }
  return out;
}

function simplifyGeometry(geom) {
  if (geom.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: geom.coordinates.map((ring) => simplifyRing(ring, SIMPLIFY_TOLERANCE)),
    };
  }
  if (geom.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: geom.coordinates.map((poly) =>
        poly.map((ring) => simplifyRing(ring, SIMPLIFY_TOLERANCE)),
      ),
    };
  }
  return geom;
}

// ---------- Main ----------

const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
console.log(`Source: ${raw.features.length} features, ${(fs.statSync(SRC).size / 1024 / 1024).toFixed(1)} MB`);

// Map district name → our existing schema id (P{n}.D{nn}).
// This requires importing our DISTRICTS table. To keep the build script
// dependency-free, we inline the mapping here based on alphabetical order
// per province (matches src/data/districts.ts seed order).
const DISTRICT_ID_BY_NAME = {
  // P1 (Koshi) — alphabetical order
  Bhojpur: "P1.D01", Dhankuta: "P1.D02", Ilam: "P1.D03", Jhapa: "P1.D04",
  Khotang: "P1.D05", Morang: "P1.D06", Okhaldhunga: "P1.D07", Panchthar: "P1.D08",
  Sankhuwasabha: "P1.D09", Solukhumbu: "P1.D10", Sunsari: "P1.D11", Taplejung: "P1.D12",
  Terhathum: "P1.D13", Udayapur: "P1.D14",
  // P2 (Madhesh)
  Bara: "P2.D01", Dhanusha: "P2.D02", Mahottari: "P2.D03", Parsa: "P2.D04",
  Rautahat: "P2.D05", Saptari: "P2.D06", Sarlahi: "P2.D07", Siraha: "P2.D08",
  // P3 (Bagmati)
  Bhaktapur: "P3.D01", Chitwan: "P3.D02", Dhading: "P3.D03", Dolakha: "P3.D04",
  Kathmandu: "P3.D05", Kavrepalanchok: "P3.D06", Lalitpur: "P3.D07", Makwanpur: "P3.D08",
  Nuwakot: "P3.D09", Ramechhap: "P3.D10", Rasuwa: "P3.D11", Sindhuli: "P3.D12",
  Sindhupalchok: "P3.D13",
  // P4 (Gandaki)
  Baglung: "P4.D01", Gorkha: "P4.D02", Kaski: "P4.D03", Lamjung: "P4.D04",
  Manang: "P4.D05", Mustang: "P4.D06", Myagdi: "P4.D07", Nawalpur: "P4.D08",
  Parbat: "P4.D09", Syangja: "P4.D10", Tanahun: "P4.D11",
  // P5 (Lumbini)
  Arghakhanchi: "P5.D01", Banke: "P5.D02", Bardiya: "P5.D03", Dang: "P5.D04",
  "Eastern Rukum": "P5.D05", Gulmi: "P5.D06", Kapilvastu: "P5.D07", Palpa: "P5.D08",
  Parasi: "P5.D09", Pyuthan: "P5.D10", Rolpa: "P5.D11", Rupandehi: "P5.D12",
  // P6 (Karnali)
  Dailekh: "P6.D01", Dolpa: "P6.D02", Humla: "P6.D03", Jajarkot: "P6.D04",
  Jumla: "P6.D05", Kalikot: "P6.D06", Mugu: "P6.D07", Salyan: "P6.D08",
  Surkhet: "P6.D09", "Western Rukum": "P6.D10",
  // P7 (Sudurpashchim)
  Achham: "P7.D01", Baitadi: "P7.D02", Bajhang: "P7.D03", Bajura: "P7.D04",
  Dadeldhura: "P7.D05", Darchula: "P7.D06", Doti: "P7.D07", Kailali: "P7.D08",
  Kanchanpur: "P7.D09",
};

// Title-case + normalization map (chuche source uses UPPERCASE).
function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Source-name normalizations (chuche → our schema).
const NAME_FIXES = {
  Tehrathum: "Terhathum",
  Dhanusa: "Dhanusha",
  Tanahu: "Tanahun",
  Kavrepalanchowk: "Kavrepalanchok",
};

const features = raw.features.map((f) => {
  // Chuche source: { DISTRICT: "JHAPA", HQ: "BHADRAPUR", PROVINCE: 1 }
  const sourceName = titleCase(f.properties.DISTRICT);
  const ourName = NAME_FIXES[sourceName] || sourceName;
  const districtId = DISTRICT_ID_BY_NAME[ourName];
  if (!districtId) {
    throw new Error(`No district id mapping for "${f.properties.DISTRICT}" (title-cased "${sourceName}", normalised to "${ourName}")`);
  }
  const provinceId = `P${f.properties.PROVINCE}`;
  return {
    type: "Feature",
    properties: {
      id: districtId,
      provinceId,
      nameEn: ourName,
    },
    geometry: simplifyGeometry(f.geometry),
  };
});

console.log(`Simplified ${features.length} district features.`);

// ---------- Districts file ----------

const districtsCollection = { type: "FeatureCollection", features };
const districtsJson = JSON.stringify(districtsCollection);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, "districts.geo.ts"),
  `/**
 * Simplified district-level GeoJSON for Nepal (77 districts).
 *
 * Source: HDX cod-ab-npl (CC-BY 4.0) — Nepal subnational admin boundaries.
 * Simplification: Visvalingam-Whyatt at tolerance ${SIMPLIFY_TOLERANCE}.
 * Coordinate precision: ${COORD_DECIMALS} decimals (~11 m).
 *
 * Generated by scripts/build-geo.js — do not edit by hand.
 */

import type { DistrictGeoFeatureCollection } from "./types.js";

export const NEPAL_DISTRICTS_GEO: DistrictGeoFeatureCollection = ${districtsJson};
`,
);

const districtsSize = fs.statSync(path.join(OUT_DIR, "districts.geo.ts")).size;
console.log(`Wrote districts.geo.ts: ${(districtsSize / 1024).toFixed(0)} KB`);

// ---------- Provinces file (dissolve districts → 7 provinces) ----------

// Group districts by province; the dissolved province polygon is just the
// union of district polygons. For ultra-simple rendering, the agent could
// further simplify, but the union of already-simplified districts suffices.
const provinceFeatures = [];
for (let p = 1; p <= 7; p++) {
  const provFeatures = features.filter((f) => f.properties.provinceId === `P${p}`);
  // Combine all rings into one MultiPolygon.
  const polygons = [];
  for (const f of provFeatures) {
    if (f.geometry.type === "Polygon") {
      polygons.push(f.geometry.coordinates);
    } else if (f.geometry.type === "MultiPolygon") {
      polygons.push(...f.geometry.coordinates);
    }
  }
  provinceFeatures.push({
    type: "Feature",
    properties: { id: `P${p}` },
    geometry: { type: "MultiPolygon", coordinates: polygons },
  });
}

const provincesCollection = { type: "FeatureCollection", features: provinceFeatures };
const provincesJson = JSON.stringify(provincesCollection);

fs.writeFileSync(
  path.join(OUT_DIR, "provinces.geo.ts"),
  `/**
 * Simplified province-level GeoJSON for Nepal (7 provinces).
 *
 * Each province is the union of its district polygons.
 *
 * Source: HDX cod-ab-npl (CC-BY 4.0).
 * Generated by scripts/build-geo.js — do not edit by hand.
 */

import type { ProvinceGeoFeatureCollection } from "./types.js";

export const NEPAL_PROVINCES_GEO: ProvinceGeoFeatureCollection = ${provincesJson};
`,
);

const provincesSize = fs.statSync(path.join(OUT_DIR, "provinces.geo.ts")).size;
console.log(`Wrote provinces.geo.ts: ${(provincesSize / 1024).toFixed(0)} KB`);

console.log("\nDone.");
