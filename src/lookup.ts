/**
 * Hierarchy lookups: provinces → districts → local-units.
 *
 * All lookups are O(n) over the small in-memory tables. Indexed by `id`,
 * `nameEn` (case-insensitive), `nameNe`, slug, and aliases.
 */

import { DISTRICTS } from "./data/districts.js";
import { LOCAL_UNITS } from "./data/local-units.js";
import { PROVINCES } from "./data/provinces.js";
import type {
  District,
  DistrictId,
  LocalUnit,
  LocalUnitId,
  Province,
  ProvinceId,
} from "./types.js";
import { containsFolded, fold } from "./util.js";

// ---------- Provinces ----------

/** All provinces. */
export function getProvinces(): readonly Province[] {
  return PROVINCES;
}

/** Lookup a province by canonical id, number, slug, English/Nepali name, or alias. */
export function getProvince(query: string | number | ProvinceId): Province | undefined {
  if (typeof query === "number") {
    return PROVINCES.find((p) => p.number === query);
  }
  const q = fold(query);
  return PROVINCES.find(
    (p) =>
      p.id === query ||
      p.slug === q ||
      fold(p.nameEn) === q ||
      p.nameNe === query ||
      p.aliases.some((a) => fold(a) === q),
  );
}

// ---------- Districts ----------

/** All districts. */
export function getDistricts(): readonly District[] {
  return DISTRICTS;
}

/** Districts belonging to a given province. */
export function getDistrictsByProvince(
  province: string | number | ProvinceId,
): readonly District[] {
  const p = getProvince(province);
  if (!p) return [];
  return DISTRICTS.filter((d) => d.provinceId === p.id);
}

/** Lookup a district by id, English/Nepali name, slug, or alias. */
export function getDistrict(query: string | DistrictId): District | undefined {
  const q = fold(query);
  return DISTRICTS.find(
    (d) =>
      d.id === query ||
      d.slug === q ||
      fold(d.nameEn) === q ||
      d.nameNe === query ||
      d.aliases.some((a) => fold(a) === q),
  );
}

// ---------- Local Units ----------

/** All local-level units shipped in this version (17 metro/sub-metro). */
export function getLocalUnits(): readonly LocalUnit[] {
  return LOCAL_UNITS;
}

/** Local units inside a given district. */
export function getLocalUnitsByDistrict(
  district: string | DistrictId,
): readonly LocalUnit[] {
  const d = getDistrict(district);
  if (!d) return [];
  return LOCAL_UNITS.filter((u) => u.districtId === d.id);
}

/** Local units inside a given province (across all its districts). */
export function getLocalUnitsByProvince(
  province: string | number | ProvinceId,
): readonly LocalUnit[] {
  const p = getProvince(province);
  if (!p) return [];
  const districtIds = new Set(
    DISTRICTS.filter((d) => d.provinceId === p.id).map((d) => d.id),
  );
  return LOCAL_UNITS.filter((u) => districtIds.has(u.districtId));
}

/** Lookup a local unit by id, English/Nepali name, slug, or alias. */
export function getLocalUnit(
  query: string | LocalUnitId,
): LocalUnit | undefined {
  const q = fold(query);
  return LOCAL_UNITS.find(
    (u) =>
      u.id === query ||
      u.slug === q ||
      fold(u.nameEn) === q ||
      u.nameNe === query ||
      u.aliases.some((a) => fold(a) === q) ||
      containsFolded(u.nameEn, query),
  );
}

/** Lookup a local unit by postal code. */
export function findByPostalCode(code: string): LocalUnit | undefined {
  return LOCAL_UNITS.find((u) => u.postalCode === code);
}

// ---------- Reverse / hierarchy walk ----------

/** Get the parent chain `(province, district, localUnit)` from a leaf id. */
export function getParents(id: DistrictId | LocalUnitId): {
  province?: Province;
  district?: District;
  localUnit?: LocalUnit;
} {
  const dotCount = (id.match(/\./g) ?? []).length;
  if (dotCount === 1) {
    // District id
    const d = getDistrict(id as DistrictId);
    if (!d) return {};
    return { province: getProvince(d.provinceId), district: d };
  }
  if (dotCount === 2) {
    // Local unit id
    const u = getLocalUnit(id as LocalUnitId);
    if (!u) return {};
    const d = getDistrict(u.districtId);
    if (!d) return { localUnit: u };
    return {
      province: getProvince(d.provinceId),
      district: d,
      localUnit: u,
    };
  }
  return {};
}

// ---------- Iterators ----------

/** Iterate every province. */
export function* eachProvince(): IterableIterator<Province> {
  for (const p of PROVINCES) yield p;
}

/** Iterate every district. */
export function* eachDistrict(): IterableIterator<District> {
  for (const d of DISTRICTS) yield d;
}

/** Iterate every local unit currently in the registry. */
export function* eachLocalUnit(): IterableIterator<LocalUnit> {
  for (const u of LOCAL_UNITS) yield u;
}

// ---------- Validation predicates ----------

export function isValidProvince(query: string | number): boolean {
  return getProvince(query) !== undefined;
}

export function isValidDistrict(query: string): boolean {
  return getDistrict(query) !== undefined;
}

export function isValidLocalUnit(query: string): boolean {
  return getLocalUnit(query) !== undefined;
}

export function isValidWard(localUnit: string | LocalUnitId, ward: number): boolean {
  const u = getLocalUnit(localUnit);
  if (!u) return false;
  return Number.isInteger(ward) && ward >= 1 && ward <= u.wards;
}

// Re-export raw arrays for convenience.
export { DISTRICTS, LOCAL_UNITS, PROVINCES };
