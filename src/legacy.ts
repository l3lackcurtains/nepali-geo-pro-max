/**
 * Legacy admin layer — bidirectional cross-walk between the pre-2017 hierarchy
 * (Region → Zone → District) and the modern federal hierarchy (Province →
 * District → Local-level unit).
 *
 * Use when migrating archived datasets (HMIS, old census, voter rolls).
 * Nothing more, nothing less.
 *
 * @example
 * getRegion("Western");                                  // R3
 * getZone("Bagmati");                                    // Z05
 * getLegacyDistrict("Kathmandu");                        // LD23
 * getCurrentDistrictsForLegacyDistrict("Nawalparasi");   // [<Nawalpur>, <Parasi>]  (split)
 * getLegacyDistrictForCurrentDistrict("Nawalpur");       // <Nawalparasi>
 * crossWalk("Kathmandu");                                // { legacy, current, zone, region }
 */

import { DISTRICTS } from "./data/districts.js";
import { LEGACY_DISTRICTS } from "./data/legacy-districts.js";
import { REGIONS } from "./data/regions.js";
import { ZONES } from "./data/zones.js";
import type {
  CrossWalkResult,
  District,
  DistrictId,
  LegacyDistrict,
  LegacyDistrictId,
  Region,
  RegionId,
  Zone,
  ZoneId,
} from "./types.js";
import { fold } from "./util.js";

// ---------- Regions ----------

/** All 5 development regions. */
export function getRegions(): readonly Region[] {
  return REGIONS;
}

/** Lookup a region by id, number 1-5, slug, English/Nepali name, or alias. */
export function getRegion(query: string | number | RegionId): Region | undefined {
  if (typeof query === "number") {
    return REGIONS.find((r) => r.number === query);
  }
  const q = fold(query);
  return REGIONS.find(
    (r) =>
      r.id === query ||
      r.slug === q ||
      fold(r.nameEn) === q ||
      r.nameNe === query ||
      r.aliases.some((a) => fold(a) === q),
  );
}

// ---------- Zones ----------

/** All 14 zones. */
export function getZones(): readonly Zone[] {
  return ZONES;
}

/** Lookup a zone by id, slug, English/Nepali name, or alias. */
export function getZone(query: string | ZoneId): Zone | undefined {
  const q = fold(query);
  return ZONES.find(
    (z) =>
      z.id === query ||
      z.slug === q ||
      fold(z.nameEn) === q ||
      z.nameNe === query ||
      z.aliases.some((a) => fold(a) === q),
  );
}

/** Zones inside a region. */
export function getZonesByRegion(region: string | number | RegionId): readonly Zone[] {
  const r = getRegion(region);
  if (!r) return [];
  return ZONES.filter((z) => z.regionId === r.id);
}

// ---------- Legacy districts ----------

/** All 75 legacy (pre-2017) districts. */
export function getLegacyDistricts(): readonly LegacyDistrict[] {
  return LEGACY_DISTRICTS;
}

/** Lookup a legacy district by id, slug, English/Nepali name, or alias. */
export function getLegacyDistrict(
  query: string | LegacyDistrictId,
): LegacyDistrict | undefined {
  const q = fold(query);
  return LEGACY_DISTRICTS.find(
    (d) =>
      d.id === query ||
      d.slug === q ||
      fold(d.nameEn) === q ||
      d.nameNe === query ||
      d.aliases.some((a) => fold(a) === q),
  );
}

/** Legacy districts inside a zone. */
export function getLegacyDistrictsByZone(
  zone: string | ZoneId,
): readonly LegacyDistrict[] {
  const z = getZone(zone);
  if (!z) return [];
  return LEGACY_DISTRICTS.filter((d) => d.zoneId === z.id);
}

/** Legacy districts inside a development region (across all its zones). */
export function getLegacyDistrictsByRegion(
  region: string | number | RegionId,
): readonly LegacyDistrict[] {
  const r = getRegion(region);
  if (!r) return [];
  const zoneIds = new Set(ZONES.filter((z) => z.regionId === r.id).map((z) => z.id));
  return LEGACY_DISTRICTS.filter((d) => zoneIds.has(d.zoneId));
}

// ---------- Cross-walks (legacy ↔ current) ----------

/**
 * Resolve the modern post-2017 districts for a legacy district. For most
 * legacy districts this returns a single-element array; **Nawalparasi** and
 * **Rukum** return two each (the splits).
 */
export function getCurrentDistrictsForLegacyDistrict(
  legacy: string | LegacyDistrictId,
): readonly District[] {
  const ld = getLegacyDistrict(legacy);
  if (!ld) return [];
  const idSet = new Set(ld.currentDistrictIds);
  return DISTRICTS.filter((d) => idSet.has(d.id));
}

/**
 * Resolve the legacy district for a modern district. The modern split
 * districts (Nawalpur, Parasi, Eastern Rukum, Western Rukum) all map back
 * to the appropriate legacy parent.
 */
export function getLegacyDistrictForCurrentDistrict(
  current: string | DistrictId,
): LegacyDistrict | undefined {
  const q = fold(current);
  const d = DISTRICTS.find(
    (x) =>
      x.id === current ||
      fold(x.nameEn) === q ||
      x.nameNe === current ||
      x.slug === q ||
      x.aliases.some((a) => fold(a) === q),
  );
  if (!d) return undefined;
  return LEGACY_DISTRICTS.find((ld) => ld.currentDistrictIds.includes(d.id));
}

/**
 * Full cross-walk for a legacy district — legacy unit + zone + region +
 * modern district equivalents.
 */
export function crossWalk(legacy: string | LegacyDistrictId): CrossWalkResult {
  const ld = getLegacyDistrict(legacy);
  if (!ld) return {};
  const zone = getZone(ld.zoneId);
  return {
    legacy: ld,
    current: getCurrentDistrictsForLegacyDistrict(ld.id),
    zone,
    region: zone ? getRegion(zone.regionId) : undefined,
  };
}

// ---------- Validation predicates ----------

export function isValidRegion(query: string | number): boolean {
  return getRegion(query) !== undefined;
}

export function isValidZone(query: string): boolean {
  return getZone(query) !== undefined;
}

export function isValidLegacyDistrict(query: string): boolean {
  return getLegacyDistrict(query) !== undefined;
}

// ---------- Iterators ----------

export function* eachRegion(): IterableIterator<Region> {
  for (const r of REGIONS) yield r;
}

export function* eachZone(): IterableIterator<Zone> {
  for (const z of ZONES) yield z;
}

export function* eachLegacyDistrict(): IterableIterator<LegacyDistrict> {
  for (const d of LEGACY_DISTRICTS) yield d;
}
