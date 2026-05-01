/**
 * `nepali-geo-pro-max` — Nepal administrative divisions library.
 *
 * 7 provinces, 77 districts, and (in v1) all 17 metro/sub-metropolitan
 * cities — with bilingual names, capitals, postal codes, fuzzy search,
 * address formatter, address parser, and validation. TypeScript-first,
 * zero dependencies.
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import { getProvinces, search, formatAddress } from "nepali-geo-pro-max";
 *
 * getProvinces();                              // 7 provinces
 * search("ललितपुर");                            // [{ level: "district", record: ..., score: 1 }, ...]
 * formatAddress({
 *   province: "Bagmati",
 *   district: "Kathmandu",
 *   localUnit: "Kathmandu Metropolitan City",
 *   ward: 5,
 * });
 * // "Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati Province"
 * ```
 */

// ---------- Data — current (post-2015 / 2017) ----------
export { PROVINCES } from "./data/provinces.js";
export { DISTRICTS, DISTRICTS_BY_PROVINCE_COUNT } from "./data/districts.js";
export {
  LOCAL_UNITS,
  LOCAL_UNIT_TYPE_COUNTS,
  TOTAL_LOCAL_UNITS,
} from "./data/local-units.js";

// ---------- Data — legacy (pre-2015 regions/zones, pre-2017 districts/VDCs) ----------
export { REGIONS } from "./data/regions.js";
export { ZONES } from "./data/zones.js";
export {
  LEGACY_DISTRICTS,
  TOTAL_LEGACY_DISTRICTS,
} from "./data/legacy-districts.js";
export {
  APPROX_TOTAL_VDCS,
  clearVdcs,
  getAllVdcs,
  registerVdcs,
  setVdcs,
} from "./data/vdcs.js";

// ---------- Lookups ----------
export {
  eachDistrict,
  eachLocalUnit,
  eachProvince,
  findByPostalCode,
  getDistrict,
  getDistricts,
  getDistrictsByProvince,
  getLocalUnit,
  getLocalUnits,
  getLocalUnitsByDistrict,
  getLocalUnitsByProvince,
  getParents,
  getProvince,
  getProvinces,
  isValidDistrict,
  isValidLocalUnit,
  isValidProvince,
  isValidWard,
} from "./lookup.js";

// ---------- Legacy lookups (regions, zones, legacy districts, VDCs) ----------
export {
  crossWalk,
  eachLegacyDistrict,
  eachRegion,
  eachZone,
  getCurrentDistrictsForLegacyDistrict,
  getLegacyDistrict,
  getLegacyDistrictForCurrentDistrict,
  getLegacyDistricts,
  getLegacyDistrictsByRegion,
  getLegacyDistrictsByZone,
  getRegion,
  getRegions,
  getVdc,
  getVdcs,
  getVdcsByLegacyDistrict,
  getZone,
  getZones,
  getZonesByRegion,
  isValidLegacyDistrict,
  isValidRegion,
  isValidZone,
} from "./legacy.js";

// ---------- Search ----------
export { type SearchOptions, search } from "./search.js";

// ---------- Format / parse / validate ----------
export { type FormatAddressOptions, formatAddress } from "./format.js";
export { type ParsedAddress, parseAddress } from "./parse.js";
export { validateAddress } from "./validate.js";

// ---------- Types ----------
export type {
  AddressParts,
  AddressValidationResult,
  CrossWalkResult,
  District,
  DistrictId,
  LatLng,
  LegacyDistrict,
  LegacyDistrictId,
  LocalUnit,
  LocalUnitId,
  LocalUnitType,
  Province,
  ProvinceId,
  Region,
  RegionId,
  SearchHit,
  Vdc,
  VdcId,
  Ward,
  WardId,
  Zone,
  ZoneId,
} from "./types.js";
