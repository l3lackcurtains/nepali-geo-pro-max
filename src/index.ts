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
export {
  DISTRICT_POSTCODE_PREFIXES,
  POSTAL_CODES,
  POSTAL_CODE_BRANCHES,
} from "./data/postal-codes.js";
export { POSTAL_CODES_2025 } from "./data/postal-codes-2025.js";

// ---------- Data — legacy admin layer (pre-2015 regions/zones, pre-2017 districts) ----------
export { REGIONS } from "./data/regions.js";
export { ZONES } from "./data/zones.js";
export {
  LEGACY_DISTRICTS,
  TOTAL_LEGACY_DISTRICTS,
} from "./data/legacy-districts.js";

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

// ---------- Legacy admin layer (bidirectional cross-walk: regions / zones / legacy districts) ----------
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
  getZone,
  getZones,
  getZonesByRegion,
  isValidLegacyDistrict,
  isValidRegion,
  isValidZone,
} from "./legacy.js";

// ---------- Map / GeoJSON helpers (bundled GeoJSON data ships via subpath imports) ----------
export {
  type AdminFeature,
  type BBox,
  type DistrictGeoFeature,
  type DistrictGeoFeatureCollection,
  type LocalUnitGeoFeature,
  type LocalUnitGeoFeatureCollection,
  type MultiPolygon,
  type Polygon,
  type PolygonGeometry,
  type Position,
  type ProvinceGeoFeature,
  type ProvinceGeoFeatureCollection,
  type Ring,
  type SvgPath,
  type SvgPathsResult,
  type ToSvgOptions,
  computeBBox,
  findDistrictFeatureByCoords,
  findFeatureByCoords,
  findLocalUnitFeatureByCoords,
  findProvinceFeatureByCoords,
  pointInGeometry,
  toSvg,
  toSvgPaths,
} from "./geo/index.js";

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
  Ward,
  WardId,
  Zone,
  ZoneId,
} from "./types.js";
