<div align="center">

# nepali-geo-pro-max

### नेपाली भूगोल — pro-max edition

The complete Nepal administrative-divisions library. **7 provinces, 77 districts, metropolitan / sub-metropolitan / municipalities / rural municipalities — with bilingual names, postal codes, capital coordinates, fuzzy search, address formatter, parser, and validator.**

[![npm version](https://img.shields.io/npm/v/nepali-geo-pro-max.svg)](https://www.npmjs.com/package/nepali-geo-pro-max)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Zero deps](https://img.shields.io/badge/dependencies-0-success)
![Bilingual](https://img.shields.io/badge/bilingual-EN_+_NE-orange)

</div>

---

## 📑 Table of Contents

1. [Highlights](#-highlights)
2. [Install](#-install)
3. [Quick Start](#-quick-start)
4. [Coverage](#-coverage)
5. [Mental Model](#-mental-model)
6. [Lookups](#-lookups)
7. [Fuzzy Search](#-fuzzy-search)
8. [Address Formatting](#-address-formatting)
9. [Address Parsing](#-address-parsing)
10. [Address Validation](#-address-validation)
11. [Legacy Admin Layer](#-legacy-admin-layer-pre-2015--pre-2017) (5 regions, 14 zones, 75 districts, VDCs)
12. [Full API Reference](#-full-api-reference)
13. [Recipes](#-recipes)
14. [Roadmap](#-roadmap)
15. [Contributing](#-contributing)

---

## ✨ Highlights

- 🇳🇵 **Bilingual everywhere** — every record has `nameEn` (Roman) + `nameNe` (Devanagari)
- 📍 **All 7 provinces + 77 districts** (post-2017 federal restructuring)
- 🏙️ **All 17 metropolitan + sub-metropolitan cities** with postal codes & capital coordinates
- 🏛️ **Full legacy layer** — 5 development regions, 14 zones, **75 pre-2017 districts** with cross-walks to current districts (VDC API too)
- 🔍 **Fuzzy search** — Levenshtein-based, bilingual queries, alias-aware (`KMC` → KMC, `Patan` → Lalitpur)
- 📮 **Postal-code lookup** — find a city by 5-digit code
- 📝 **Address formatter** — short / long / postal styles, English or Nepali output
- 📥 **Address parser** — free-form input → structured parts with confidence score
- ✅ **Address validator** — checks province/district/local-unit/ward consistency
- 🆔 **Stable canonical IDs** — `P3.D05.L01.W05` (modern) and `R2 / Z05 / LD23` (legacy)
- 📦 **Tree-shakeable** — pure ESM exports, `sideEffects: false`
- 🎯 **TypeScript-first** — strict mode, branded types, full JSDoc
- 🪶 **Zero dependencies** — Node, Deno, Bun, browsers, Workers

---

## 📦 Install

```bash
npm install nepali-geo-pro-max
pnpm add nepali-geo-pro-max
yarn add nepali-geo-pro-max
bun add nepali-geo-pro-max
```

Works with **Node ≥ 14**, modern browsers, Deno, Bun, Cloudflare Workers, Vercel Edge.

---

## ⚡ Quick Start

```ts
import {
  PROVINCES,
  getProvinces,
  getDistrictsByProvince,
  getLocalUnit,
  search,
  formatAddress,
  parseAddress,
  validateAddress,
} from "nepali-geo-pro-max";

// All 7 provinces
PROVINCES.length;                                    // 7

// Districts of Bagmati
getDistrictsByProvince("Bagmati").map((d) => d.nameEn);
// ["Bhaktapur", "Chitwan", "Dhading", ..., "Sindhupalchok"]

// Lookup by alias
getLocalUnit("KMC")?.nameEn;
// "Kathmandu Metropolitan City"

// Fuzzy + bilingual search
search("ललितपुर")[0]?.record.nameEn;                  // "Lalitpur"
search("Lalipur")[0]?.score;                          // ≈ 0.87  (typo tolerated)

// Format an address
formatAddress({
  province: "Bagmati",
  district: "Kathmandu",
  localUnit: "Kathmandu Metropolitan City",
  ward: 5,
});
// "Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati Province"

// Same address in Nepali
formatAddress(parts, { locale: "ne" });
// "वडा ५, काठमाडौँ महानगरपालिका, काठमाडौँ, बागमती"

// Parse free-form input
parseAddress("Ward 5, KMC, Kathmandu, Bagmati").parts;
// { ward: 5, localUnit: "P3.D05.L01", district: "P3.D05", province: "P3" }

// Validate
validateAddress({ province: "Bagmati", district: "Kaski" }).errors;
// [{ field: "district", code: "mismatch", message: "..." }]
```

---

## 📊 Coverage

### Current (post-2015 / 2017 federal)

| Level | v1.0 | Total in Nepal | Notes |
|---|---|---|---|
| Provinces | **7 / 7** ✅ | 7 | Full bilingual + capital + area + population |
| Districts | **77 / 77** ✅ | 77 | Full bilingual + headquarters + aliases |
| Metropolitan cities | **6 / 6** ✅ | 6 | Postal codes + coordinates |
| Sub-metropolitan cities | **11 / 11** ✅ | 11 | Postal codes + coordinates |
| Municipalities | 0 / 276 ⏳ | 276 | v1.x — PRs welcome |
| Rural municipalities | 0 / 460 ⏳ | 460 | v1.x — PRs welcome |
| Wards (1–35 per palika) | 0 / ~6,743 ⏳ | ~6,743 | v2 — derived from palika data |

### Legacy (pre-2015 / pre-2017)

| Level | v1.0 | Total | Notes |
|---|---|---|---|
| Development Regions | **5 / 5** ✅ | 5 | Abolished 2015 — Eastern, Central, Western, Mid-Western, Far-Western |
| Zones | **14 / 14** ✅ | 14 | Abolished 2015 — Mechi, Koshi, Sagarmatha, Janakpur, Bagmati, Narayani, Gandaki, Lumbini, Dhaulagiri, Rapti, Bheri, Karnali, Seti, Mahakali |
| Legacy districts | **75 / 75** ✅ | 75 | Pre-2017 — with cross-walks to current 77 (Nawalparasi → Nawalpur+Parasi; Rukum → Eastern+Western Rukum) |
| VDCs (`registerVdcs` API) | 0 / ~3,915 ⏳ | ~3,915 | Types + lookup API ready — register your dataset via `registerVdcs()` |

**v1.0 ships verified data only.** Adding the remaining 736 palikas requires authoritative MoFAGA / Election Commission datasets — see [Contributing](#-contributing) for the data-add process.

---

## 🧠 Mental Model

| Rule | Why |
|---|---|
| **Hierarchy is strictly Province → District → LocalUnit → Ward.** | Matches Nepal's federal structure. |
| **Every record has bilingual names.** | Forms in Nepal often need Devanagari display + Roman storage. |
| **Lookups are name-tolerant.** | `Kavre` finds "Kavrepalanchok"; `Province 3` finds "Bagmati"; `Patan` finds "Lalitpur". |
| **IDs are stable and hierarchical.** | `P3.D05.L01.W05` survives renames. Use IDs for storage; show names to users. |
| **Search is bilingual + fuzzy.** | `search("ललितपुर")` and `search("Lalipur")` both succeed. |
| **The parser stores IDs, the formatter displays names.** | Round-trip: `formatAddress(parseAddress(s).parts)` regenerates clean text. |
| **Postal codes are 5-digit per Nepal Postal Service.** | Kathmandu = 44600, Pokhara = 33700, Lalitpur = 44700, Bharatpur = 44200. |

---

## 🔎 Lookups

```ts
// Provinces
getProvinces();                               // all 7
getProvince("Bagmati");                       // by English name
getProvince(3);                               // by number 1-7
getProvince("बागमती");                         // by Devanagari
getProvince("Province 3");                    // by alias
getProvince("P3");                            // by id

// Districts
getDistricts();                               // all 77
getDistrict("Kathmandu");
getDistrict("Kavre");                         // alias resolves to Kavrepalanchok
getDistrictsByProvince("Bagmati");            // 13 districts

// Local units (palikas)
getLocalUnits();                              // 17 (metro + sub-metro in v1)
getLocalUnit("KMC");                          // alias
getLocalUnit("काठमाडौँ महानगरपालिका");
getLocalUnitsByDistrict("Kathmandu");
getLocalUnitsByProvince("Bagmati");

// Postal codes
findByPostalCode("44600")?.nameEn;            // "Kathmandu Metropolitan City"

// Hierarchy walk
getParents("P3.D05.L01");
// { province: <Bagmati>, district: <Kathmandu>, localUnit: <KMC> }

// Iterators
for (const p of eachProvince()) console.log(p.nameEn);

// Validation predicates
isValidProvince("Bagmati");                   // true
isValidWard("KMC", 5);                        // true (KMC has 32 wards)
isValidWard("KMC", 99);                       // false
```

---

## 🔍 Fuzzy Search

```ts
search("Lalitpur");
// [
//   { level: "district", record: <Lalitpur>, score: 1 },
//   { level: "local-unit", record: <Lalitpur Metropolitan City>, score: ~0.85 },
// ]

search("ललितपुर");                              // bilingual — same hits
search("Lalipur");                            // typo → "Lalitpur" wins with score ~0.87
search("KMC");                                // alias → KMC

// Filter by level
search("Janakpur", { levels: ["local-unit"] });

// Tune fuzzy threshold
search("xyz", { threshold: 0.6, limit: 5 });
```

---

## 📝 Address Formatting

```ts
const parts = {
  province: "Bagmati",
  district: "Kathmandu",
  localUnit: "Kathmandu Metropolitan City",
  ward: 5,
  postalCode: "44600",
};

formatAddress(parts);
// "Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati Province"

formatAddress(parts, { style: "short" });
// "Ward 5, Kathmandu, Kathmandu, Bagmati"

formatAddress(parts, { style: "postal" });
// "Ward 5, Kathmandu Metropolitan City, Kathmandu, 44600, Bagmati Province"

formatAddress(parts, { locale: "ne" });
// "वडा ५, काठमाडौँ महानगरपालिका, काठमाडौँ, बागमती"

formatAddress(
  { house: "12", tole: "Thamel", ward: 26, district: "Kathmandu", province: "Bagmati" },
);
// "12, Thamel, Ward 26, Kathmandu, Bagmati Province"
```

---

## 📥 Address Parsing

```ts
parseAddress("Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati");
// {
//   parts: { ward: 5, localUnit: "P3.D05.L01", district: "P3.D05", province: "P3" },
//   confidence: 0.9,
//   unmatched: [],
// }

parseAddress("वडा १०, काठमाडौँ").parts.ward;       // 10  (Devanagari ward number)
parseAddress("KMC").parts.province;                  // "P3"  (parents auto-filled)
parseAddress("44600, Kathmandu").parts.postalCode;   // "44600"

// Re-format from parsed parts:
const r = parseAddress("Ward 5, KMC, Kathmandu");
formatAddress(r.parts);
// "Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati Province"
```

---

## ✅ Address Validation

```ts
validateAddress({
  province: "Bagmati",
  district: "Kathmandu",
  localUnit: "KMC",
  ward: 5,
});
// { ok: true, errors: [], resolved: { province, district, localUnit } }

validateAddress({ province: "Bagmati", district: "Kaski" });
// { ok: false, errors: [{ field: "district", code: "mismatch",
//   message: 'District "Kaski" is not in province "Bagmati"' }], ... }

validateAddress({ localUnit: "KMC", ward: 99 });
// { ok: false, errors: [{ field: "ward", code: "unknown",
//   message: 'Ward 99 out of range — "Kathmandu Metropolitan City" has wards 1..32' }] }
```

---

## 🏛️ Legacy Admin Layer (pre-2015 / pre-2017)

Nepal's federal restructuring (2015 constitution + 2017 local-level reorganization) replaced an older system that many existing datasets still use:

- **5 Development Regions** (विकास क्षेत्र) — abolished 2015
- **14 Zones** (अञ्चल) — abolished 2015
- **75 Districts** (pre-2017, before Nawalparasi & Rukum splits)
- **~3,915 VDCs** (गाउँ विकास समिति) — abolished 2017, replaced by gaupalika / nagarpalika

This package ships the legacy hierarchy alongside the current one, with **bidirectional cross-walks** so you can migrate archived data.

```ts
import {
  getRegions, getZones, getLegacyDistricts,
  getRegion, getZone, getLegacyDistrict,
  getZonesByRegion, getLegacyDistrictsByZone, getLegacyDistrictsByRegion,
  getCurrentDistrictsForLegacyDistrict,
  getLegacyDistrictForCurrentDistrict,
  crossWalk,
  registerVdcs, getVdcs, getVdc,
} from "nepali-geo-pro-max";

// 5 regions, 14 zones, 75 districts
getRegions().length;            // 5
getZones().length;               // 14
getLegacyDistricts().length;     // 75

// Lookup
getRegion("Western")?.id;                                     // "R3"
getRegion("पूर्वाञ्चल")?.id;                                   // "R1"
getZone("Bagmati")?.regionId;                                  // "R2" (Central)
getLegacyDistrict("Kathmandu")?.zoneId;                        // "Z05" (Bagmati)
getLegacyDistrict("Kavre")?.nameEn;                            // "Kavrepalanchok" (alias)

// Hierarchy
getZonesByRegion("R1").map((z) => z.nameEn);
// ["Mechi", "Koshi", "Sagarmatha"]

getLegacyDistrictsByZone("Bagmati").length;                    // 8
getLegacyDistrictsByRegion("Mid-Western").length;              // 15  (Rapti 5 + Bheri 5 + Karnali 5)

// Cross-walks (legacy ↔ current)
getCurrentDistrictsForLegacyDistrict("Kathmandu").map((d) => d.nameEn);
// ["Kathmandu"]

getCurrentDistrictsForLegacyDistrict("Nawalparasi").map((d) => d.nameEn);
// ["Nawalpur", "Parasi"]    ← the 2017 split

getCurrentDistrictsForLegacyDistrict("Rukum").map((d) => d.nameEn);
// ["Eastern Rukum", "Western Rukum"]

getLegacyDistrictForCurrentDistrict("Nawalpur")?.nameEn;       // "Nawalparasi"
getLegacyDistrictForCurrentDistrict("Eastern Rukum")?.nameEn;  // "Rukum"

// Full chain
crossWalk("Kathmandu");
// {
//   legacy: <Kathmandu>,
//   current: [<Kathmandu (P3.D05)>],
//   zone: <Bagmati>,
//   region: <Central>,
// }
```

### Region → Zone → Districts

| Region | Zones | Pre-2017 Districts |
|---|---|---|
| **R1 Eastern** (पूर्वाञ्चल) | Mechi · Koshi · Sagarmatha | 4 + 6 + 6 = 16 |
| **R2 Central** (मध्यमाञ्चल) | Janakpur · Bagmati · Narayani | 6 + 8 + 5 = 19 |
| **R3 Western** (पश्चिमाञ्चल) | Gandaki · Lumbini · Dhaulagiri | 6 + 6 + 4 = 16 |
| **R4 Mid-Western** (मध्य-पश्चिमाञ्चल) | Rapti · Bheri · Karnali | 5 + 5 + 5 = 15 |
| **R5 Far-Western** (सुदूर-पश्चिमाञ्चल) | Seti · Mahakali | 5 + 4 = 9 |
| **Total** | **14 zones** | **75 districts** ✓ |

### VDCs

The full ~3,915 VDC dataset is large and authoritative ingestion (CBS Census 2011 / MoFAGA archives) is non-trivial. v1 ships the **types and lookup API**, with the registry empty by default. Register your dataset at runtime:

```ts
import { registerVdcs, getVdc } from "nepali-geo-pro-max";

registerVdcs([
  {
    id: "LD23.V001",
    nameEn: "Sankhu",
    nameNe: "साँखु",
    legacyDistrictId: "LD23",  // Kathmandu (legacy)
    wards: 9,
    slug: "sankhu",
    aliases: [],
  },
  // ... your verified dataset
]);

getVdc("Sankhu");  // → registered record
```

PRs to seed `data/vdcs.ts` with verified, district-by-district data are very welcome — see [Contributing](#-contributing).

---

## 🧰 Full API Reference

<details open>
<summary><strong>Lookups</strong></summary>

| Function | Description |
|---|---|
| `getProvinces()` | All 7 provinces |
| `getProvince(query)` | By id / number / name (any language) / alias |
| `getDistricts()` | All 77 districts |
| `getDistrict(query)` | By id / name / alias |
| `getDistrictsByProvince(p)` | Districts in a province |
| `getLocalUnits()` | All shipped local units |
| `getLocalUnit(query)` | By id / name / alias |
| `getLocalUnitsByDistrict(d)` | Local units in a district |
| `getLocalUnitsByProvince(p)` | Local units in a province |
| `findByPostalCode(code)` | Local unit by 5-digit code |
| `getParents(id)` | Walk parent chain to province |

</details>

<details open>
<summary><strong>Iterators</strong></summary>

| Function | Description |
|---|---|
| `eachProvince()` | Iterable of provinces |
| `eachDistrict()` | Iterable of districts |
| `eachLocalUnit()` | Iterable of local units |

</details>

<details open>
<summary><strong>Validation predicates</strong></summary>

| Function | Description |
|---|---|
| `isValidProvince(q)` | True if recognized |
| `isValidDistrict(q)` | True if recognized |
| `isValidLocalUnit(q)` | True if recognized |
| `isValidWard(localUnit, ward)` | True if ward in range |

</details>

<details open>
<summary><strong>Search</strong></summary>

| Function | Description |
|---|---|
| `search(query, opts?)` | Fuzzy + bilingual cross-level search |

`SearchOptions`: `{ levels?: ["province" \| "district" \| "local-unit"], limit?, threshold? }`.

</details>

<details open>
<summary><strong>Address formatter / parser / validator</strong></summary>

| Function | Description |
|---|---|
| `formatAddress(parts, opts?)` | Structured → string |
| `parseAddress(raw)` | String → `{ parts, confidence, unmatched }` |
| `validateAddress(parts)` | `{ ok, errors, resolved }` |

`FormatAddressOptions`: `{ locale?: "en" \| "ne", style?: "short" \| "long" \| "postal", separator? }`.

</details>

<details open>
<summary><strong>Legacy lookups (pre-2015 / pre-2017)</strong></summary>

| Function | Description |
|---|---|
| `getRegions()` | All 5 development regions |
| `getRegion(query)` | By id / number 1-5 / name / alias |
| `getZones()` | All 14 zones |
| `getZone(query)` | By id / name / alias |
| `getZonesByRegion(region)` | Zones inside a region |
| `getLegacyDistricts()` | All 75 pre-2017 districts |
| `getLegacyDistrict(query)` | By id / name / alias |
| `getLegacyDistrictsByZone(zone)` | Districts inside a zone |
| `getLegacyDistrictsByRegion(region)` | Districts inside a region |
| `getCurrentDistrictsForLegacyDistrict(legacy)` | 1 or 2 modern districts |
| `getLegacyDistrictForCurrentDistrict(current)` | Reverse map |
| `crossWalk(legacy)` | `{ legacy, current[], zone, region }` |
| `getVdcs()` | All registered VDCs |
| `getVdc(query)` | By id / name / alias |
| `getVdcsByLegacyDistrict(d)` | VDCs in a legacy district |
| `registerVdcs(arr)` | Append VDCs at runtime |
| `setVdcs(arr)` | Replace VDC registry |
| `clearVdcs()` | Reset registry |
| `eachRegion / eachZone / eachLegacyDistrict()` | Iterators |
| `isValidRegion / isValidZone / isValidLegacyDistrict` | Predicates |

</details>

<details open>
<summary><strong>Constants & data</strong></summary>

| Constant | Description |
|---|---|
| `PROVINCES` | All 7 provinces |
| `DISTRICTS` | All 77 districts |
| `LOCAL_UNITS` | Shipped local units |
| `REGIONS` | All 5 development regions |
| `ZONES` | All 14 zones |
| `LEGACY_DISTRICTS` | All 75 pre-2017 districts |
| `DISTRICTS_BY_PROVINCE_COUNT` | `{ P1: 14, P2: 8, ... }` |
| `LOCAL_UNIT_TYPE_COUNTS` | Nepal-wide counts |
| `TOTAL_LOCAL_UNITS` | 753 |
| `TOTAL_LEGACY_DISTRICTS` | 75 |
| `APPROX_TOTAL_VDCS` | 3,915 |

</details>

<details open>
<summary><strong>Types</strong></summary>

Current: `Province`, `District`, `LocalUnit`, `Ward`, `LocalUnitType`, `ProvinceId`, `DistrictId`, `LocalUnitId`, `WardId`, `LatLng`, `AddressParts`, `AddressValidationResult`, `SearchHit`.

Legacy: `Region`, `Zone`, `LegacyDistrict`, `Vdc`, `RegionId`, `ZoneId`, `LegacyDistrictId`, `VdcId`, `CrossWalkResult`.

</details>

---

## 🎯 Recipes

### Province / district dropdown

```tsx
import { getProvinces, getDistrictsByProvince } from "nepali-geo-pro-max";

function AddressForm() {
  const [provinceId, setProvinceId] = useState("");
  const provinces = getProvinces();
  const districts = provinceId ? getDistrictsByProvince(provinceId) : [];

  return (
    <>
      <select onChange={(e) => setProvinceId(e.target.value)}>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>{p.nameEn} ({p.nameNe})</option>
        ))}
      </select>
      <select disabled={!provinceId}>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>{d.nameEn} ({d.nameNe})</option>
        ))}
      </select>
    </>
  );
}
```

### Address autocomplete

```ts
import { search } from "nepali-geo-pro-max";

function suggestions(query: string) {
  return search(query, { limit: 8, threshold: 0.5 }).map((hit) => ({
    label: hit.record.nameEn + " (" + hit.record.nameNe + ")",
    value: hit.record.id,
    level: hit.level,
    score: hit.score,
  }));
}
```

### Round-trip validation

```ts
import { parseAddress, validateAddress, formatAddress } from "nepali-geo-pro-max";

const userInput = "Ward 5, KMC, Kathmandu, Bagmati";
const { parts, confidence } = parseAddress(userInput);
const { ok, errors } = validateAddress(parts);

if (ok && confidence > 0.7) {
  const cleaned = formatAddress(parts);
  // Save `parts` (canonical IDs), display `cleaned`.
}
```

### Postal-code reverse lookup

```ts
import { findByPostalCode, getParents } from "nepali-geo-pro-max";

const unit = findByPostalCode("44600");
if (unit) {
  const { province, district } = getParents(unit.id);
  console.log(`${unit.nameEn}, ${district?.nameEn}, ${province?.nameEn}`);
}
```

---

## 🛣️ Roadmap

- **v1.1** — All 276 municipalities (per-province PRs welcome)
- **v1.2** — All 460 rural municipalities
- **v1.3** — Postal-code lookups for every palika
- **v1.x** — Seed `LEGACY_VDCS` with verified VDC data (PRs welcome)
- **v2.0** — Ward-level data + boundary GeoJSON via subpath imports (`/geo/provinces`, `/geo/districts`)
- **v2.x** — Point-in-polygon `getProvinceByCoords(lat, lng)` for geo-queries

---

## 🤝 Contributing

Adding a missing palika? PR template:

1. Open `src/data/local-units.ts`
2. Append a new entry to `SEED` with verified data:
   ```ts
   {
     nameEn: "Your Municipality Name",
     nameNe: "तपाईँको पालिकाको नाम",
     type: "municipality",
     districtNameEn: "Existing District Name",
     wards: <official ward count>,
     postalCode: "<5-digit>",  // optional
     coords: { lat: ..., lng: ... },  // optional
     aliases: [...],  // optional
   }
   ```
3. Cite source in PR description: MoFAGA list, Election Commission, or other authoritative dataset
4. Tests will run automatically; ID is auto-assigned

```bash
npm install
npm test
npm run typecheck
npm run build
```

### Authoritative sources

- 🏛️ [MoFAGA — Nepal new structure (gaupalika/nagarpalika)](http://lgcdp.gov.np/nepal-new-structure-gaupalika-nagarpalika-list)
- 🗳️ [Election Commission Nepal](https://election.gov.np/)
- 🌐 [HDX — Nepal Subnational Boundaries (cod-ab-npl)](https://data.humdata.org/dataset/cod-ab-npl)
- 📊 [Open Data Nepal — Local bodies & wards per district](https://opendatanepal.com/dataset/total-number-of-local-bodies-and-wards-per-district-of-nepal)
- 📕 [Census 2078 (CBS)](https://censusnepal.cbs.gov.np/)
- 📮 [Nepal Postal Service](https://nepalpost.gov.np/)

---

## 📜 License

MIT © 2026 [l3lackcurtains](https://github.com/l3lackcurtains)

---

<div align="center">

**Made with ❤️ for the Nepali developer community.**

बनाइएको नेपाली डेभलपर समुदायको लागि।

</div>
