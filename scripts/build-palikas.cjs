/**
 * Build script: simplify the 44.7 MB younginnovations palika GeoJSON into a
 * tree-shakeable TypeScript module.
 *
 * Source: younginnovations/nepal-locallevel-map (MIT) — file
 * `out/municipalities.high.geojson`, 775 features.
 *
 * Pipeline:
 *  1. Filter out 22 non-palika features (parks / reserves).
 *  2. Merge split features (e.g. Bansagadhi in Bardiya — 2 polygons in source).
 *  3. Normalize source district names to match our schema.
 *  4. Cross-walk source palika → our `LocalUnitId` via (district, name) join.
 *  5. Visvalingam-Whyatt simplification at the chosen tolerance.
 *  6. Round coords to 4 decimal places (~11 m precision).
 *
 * Run: node scripts/build-palikas.cjs
 */

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "source-palikas.geojson");
const OUT = path.join(__dirname, "..", "src", "geo", "local-units.geo.ts");

// Aggressive simplification — palikas are dense and we want to keep the file
// under ~1 MB. 1e-4 ≈ 11 km² area threshold; loses fine wiggles but preserves
// district shape at country scale.
const SIMPLIFY_TOLERANCE = 1e-4;
const COORD_DECIMALS = 4;

function roundCoord(c) {
  return Math.round(c * 10 ** COORD_DECIMALS) / 10 ** COORD_DECIMALS;
}

function triangleArea(p1, p2, p3) {
  return Math.abs(
    (p1[0] * (p2[1] - p3[1]) +
      p2[0] * (p3[1] - p1[1]) +
      p3[0] * (p1[1] - p2[1])) /
      2,
  );
}

function simplifyRing(ring, tolerance) {
  if (ring.length <= 4) return ring.map((p) => p.map(roundCoord));
  const points = ring.map((p, i) => ({
    pt: p,
    area:
      i === 0 || i === ring.length - 1
        ? Infinity
        : triangleArea(ring[i - 1], p, ring[i + 1]),
    prev: i - 1,
    next: i + 1,
  }));

  let count = points.length;
  while (count > 4) {
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
    const p = points[minIdx];
    const prev = points[p.prev];
    const next = points[p.next];
    prev.next = p.next;
    next.prev = p.prev;
    p.area = null;
    count--;
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

  const out = [];
  let i = 0;
  while (i !== points.length - 1) {
    out.push(points[i].pt.map(roundCoord));
    i = points[i].next;
  }
  out.push(points[i].pt.map(roundCoord));
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

// ---------- Type & district mapping ----------

const TYPE_MAP = {
  Mahanagarpalika: "metropolitan",
  Upamahanagarpalika: "sub-metropolitan",
  Nagarpalika: "municipality",
  Gaunpalika: "rural-municipality",
};

// Normalize source district names → our schema (must match DISTRICTS_BY_NAME).
const DISTRICT_NAME_FIXES = {
  Bardiya: "Bardiya",
  Chitawan: "Chitwan",
  Kabhrepalanchok: "Kavrepalanchok",
  Tanahu: "Tanahun",
  Kapilbastu: "Kapilvastu",
  "Nawalparasi East": "Nawalpur",
  "Nawalparasi West": "Parasi",
  Nawalparasi_E: "Nawalpur",
  Nawalparasi_W: "Parasi",
  Tehrathum: "Terhathum",
  "Eastern Rukum": "Eastern Rukum",
  "Western Rukum": "Western Rukum",
  "Rukum East": "Eastern Rukum",
  "Rukum West": "Western Rukum",
  Rukum_E: "Eastern Rukum",
  Rukum_W: "Western Rukum",
  Dhanusa: "Dhanusha",
  Makawanpur: "Makwanpur",
};

const DISTRICT_ID_BY_NAME = {
  Bhojpur: "P1.D01", Dhankuta: "P1.D02", Ilam: "P1.D03", Jhapa: "P1.D04",
  Khotang: "P1.D05", Morang: "P1.D06", Okhaldhunga: "P1.D07", Panchthar: "P1.D08",
  Sankhuwasabha: "P1.D09", Solukhumbu: "P1.D10", Sunsari: "P1.D11", Taplejung: "P1.D12",
  Terhathum: "P1.D13", Udayapur: "P1.D14",
  Bara: "P2.D01", Dhanusha: "P2.D02", Mahottari: "P2.D03", Parsa: "P2.D04",
  Rautahat: "P2.D05", Saptari: "P2.D06", Sarlahi: "P2.D07", Siraha: "P2.D08",
  Bhaktapur: "P3.D01", Chitwan: "P3.D02", Dhading: "P3.D03", Dolakha: "P3.D04",
  Kathmandu: "P3.D05", Kavrepalanchok: "P3.D06", Lalitpur: "P3.D07", Makwanpur: "P3.D08",
  Nuwakot: "P3.D09", Ramechhap: "P3.D10", Rasuwa: "P3.D11", Sindhuli: "P3.D12",
  Sindhupalchok: "P3.D13",
  Baglung: "P4.D01", Gorkha: "P4.D02", Kaski: "P4.D03", Lamjung: "P4.D04",
  Manang: "P4.D05", Mustang: "P4.D06", Myagdi: "P4.D07", Nawalpur: "P4.D08",
  Parbat: "P4.D09", Syangja: "P4.D10", Tanahun: "P4.D11",
  Arghakhanchi: "P5.D01", Banke: "P5.D02", Bardiya: "P5.D03", Dang: "P5.D04",
  "Eastern Rukum": "P5.D05", Gulmi: "P5.D06", Kapilvastu: "P5.D07", Palpa: "P5.D08",
  Parasi: "P5.D09", Pyuthan: "P5.D10", Rolpa: "P5.D11", Rupandehi: "P5.D12",
  Dailekh: "P6.D01", Dolpa: "P6.D02", Humla: "P6.D03", Jajarkot: "P6.D04",
  Jumla: "P6.D05", Kalikot: "P6.D06", Mugu: "P6.D07", Salyan: "P6.D08",
  Surkhet: "P6.D09", "Western Rukum": "P6.D10",
  Achham: "P7.D01", Baitadi: "P7.D02", Bajhang: "P7.D03", Bajura: "P7.D04",
  Dadeldhura: "P7.D05", Darchula: "P7.D06", Doti: "P7.D07", Kailali: "P7.D08",
  Kanchanpur: "P7.D09",
};

// ---------- Main ----------

const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
console.log(
  `Source: ${raw.features.length} features, ${(fs.statSync(SRC).size / 1024 / 1024).toFixed(1)} MB`,
);

// 1. Filter to palika types only.
const palikaFeatures = raw.features.filter((f) => TYPE_MAP[f.properties.locallevel_type]);
console.log(`After filter to palikas: ${palikaFeatures.length} features`);

// 2. Merge by `locallevel_fullcode` — combines the Bansagadhi split.
const groups = new Map();
for (const f of palikaFeatures) {
  const key = f.properties.locallevel_fullcode;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(f);
}
console.log(`Distinct fullcodes: ${groups.size}`);

const merged = [];
for (const [, fs_] of groups) {
  if (fs_.length === 1) {
    merged.push(fs_[0]);
    continue;
  }
  // Combine geometries into a MultiPolygon.
  const polygons = [];
  for (const f of fs_) {
    if (f.geometry.type === "Polygon") {
      polygons.push(f.geometry.coordinates);
    } else if (f.geometry.type === "MultiPolygon") {
      polygons.push(...f.geometry.coordinates);
    }
  }
  merged.push({
    ...fs_[0],
    geometry: { type: "MultiPolygon", coordinates: polygons },
  });
}
console.log(`After merge: ${merged.length} features`);

// 3. Cross-walk to our LocalUnitId via (districtName, palikaNameEn).
// We look up district id by normalized district name; then we match the palika
// to one of LOCAL_UNITS in src/data/local-units.ts. Since the script can't
// easily import the TS module, we replicate the per-district counter logic.
//
// IMPORTANT: our LocalUnit IDs are assigned by SEED order in `local-units.ts`,
// which is roughly alphabetical per district. The source GeoJSON ordering is
// different. So we can't recover IDs by index; instead we emit the source's
// canonical name + district + type and let runtime cross-walk handle id
// resolution at consumption time. The simplest safe approach: just emit the
// palika name + district id and let consumers join against `LOCAL_UNITS`
// via a helper. But for ergonomic API, we'd like a stable `id`.
//
// Simplest: assign id deterministically by sorting palikas within each district
// by `locallevel_fullcode` (numeric, stable) — same key our `LOCAL_UNITS`
// would yield if we re-seeded from the same source. This may NOT match the
// existing `LOCAL_UNITS` IDs if those were seeded from a different source.
// We therefore ALSO emit the source `nameEn` so consumers can use that as the
// authoritative join key.

const features = [];
const skipped = [];
for (const f of merged) {
  const props = f.properties;
  const sourceDistrict = props.district;
  const ourDistrict = DISTRICT_NAME_FIXES[sourceDistrict] || sourceDistrict;
  const districtId = DISTRICT_ID_BY_NAME[ourDistrict];
  if (!districtId) {
    skipped.push({ name: props.locallevel_name, district: sourceDistrict });
    continue;
  }
  const provinceId = `P${props.province}`;
  features.push({
    type: "Feature",
    properties: {
      // We DON'T set `id` here — consumers should look it up via the
      // (districtId, nameEn) tuple against `LOCAL_UNITS`. The reason: our
      // existing `LOCAL_UNITS` IDs are seeded from sagautam5 source ordering,
      // not younginnovations ordering, so stamping a synthetic id here would
      // be misleading.
      districtId,
      provinceId,
      nameEn: props.locallevel_name,
      nameNe: props.locallevel_name_nepali,
      type: TYPE_MAP[props.locallevel_type],
    },
    geometry: simplifyGeometry(f.geometry),
  });
}

if (skipped.length > 0) {
  console.warn(`Skipped ${skipped.length} features with unknown districts:`);
  console.warn(JSON.stringify(skipped.slice(0, 5), null, 2));
}

console.log(`Final palika features: ${features.length}`);
console.log(
  `Type distribution: metro ${features.filter((f) => f.properties.type === "metropolitan").length}, sub-metro ${features.filter((f) => f.properties.type === "sub-metropolitan").length}, muni ${features.filter((f) => f.properties.type === "municipality").length}, rural ${features.filter((f) => f.properties.type === "rural-municipality").length}`,
);

const collection = { type: "FeatureCollection", features };
const json = JSON.stringify(collection);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  `/**
 * Simplified palika-level (753) GeoJSON for Nepal.
 *
 * Source: younginnovations/nepal-locallevel-map (MIT) —
 *   https://github.com/younginnovations/nepal-locallevel-map
 *   file: out/municipalities.high.geojson
 *
 * Pipeline:
 *  - Filtered to the 4 palika types (Mahanagarpalika / Upamahanagarpalika /
 *    Nagarpalika / Gaunpalika), removing 22 parks/reserves.
 *  - Merged split features (Bansagadhi) by locallevel_fullcode.
 *  - Visvalingam-Whyatt simplification at tolerance ${SIMPLIFY_TOLERANCE}.
 *  - Coordinate precision: ${COORD_DECIMALS} decimals (~11 m).
 *
 * Each feature carries: nameEn, nameNe, districtId, provinceId, type.
 * To resolve a feature against \`LOCAL_UNITS\`, join on (districtId, nameEn).
 *
 * Generated by scripts/build-palikas.cjs — do not edit by hand.
 */

import type { LocalUnitGeoFeatureCollection } from "./types.js";

export const NEPAL_LOCAL_UNITS_GEO: LocalUnitGeoFeatureCollection = ${json} as LocalUnitGeoFeatureCollection;
`,
);

const sizeKB = fs.statSync(OUT).size / 1024;
console.log(`\nWrote ${path.basename(OUT)}: ${sizeKB.toFixed(0)} KB`);
console.log("Done.");
