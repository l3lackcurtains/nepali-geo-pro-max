/**
 * Map / GeoJSON helpers — entry point for `nepali-geo-pro-max/geo`.
 *
 * Helpers (small, in main bundle):
 *   `toSvg(...)`, `computeBBox(...)`, point-in-polygon utilities.
 *
 * Data (heavy, separate subpath imports):
 *   `nepali-geo-pro-max/geo/districts` → `NEPAL_DISTRICTS_GEO`  (~150 KB)
 *   `nepali-geo-pro-max/geo/provinces` → `NEPAL_PROVINCES_GEO`  (~140 KB)
 */

export {
  type BBox,
  type SvgPath,
  type SvgPathsResult,
  type ToSvgOptions,
  computeBBox,
  toSvg,
  toSvgPaths,
} from "./svg.js";

export {
  findDistrictFeatureByCoords,
  findFeatureByCoords,
  findLocalUnitFeatureByCoords,
  findProvinceFeatureByCoords,
  pointInGeometry,
} from "./point-in-polygon.js";

export type {
  AdminFeature,
  DistrictGeoFeature,
  DistrictGeoFeatureCollection,
  LocalUnitGeoFeature,
  LocalUnitGeoFeatureCollection,
  MultiPolygon,
  Polygon,
  PolygonGeometry,
  Position,
  ProvinceGeoFeature,
  ProvinceGeoFeatureCollection,
  Ring,
} from "./types.js";
