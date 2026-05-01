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
  type ToSvgOptions,
  computeBBox,
  toSvg,
} from "./svg.js";

export {
  findDistrictFeatureByCoords,
  findFeatureByCoords,
  findProvinceFeatureByCoords,
  pointInGeometry,
} from "./point-in-polygon.js";

export type {
  AdminFeature,
  DistrictGeoFeature,
  DistrictGeoFeatureCollection,
  MultiPolygon,
  Polygon,
  PolygonGeometry,
  Position,
  ProvinceGeoFeature,
  ProvinceGeoFeatureCollection,
  Ring,
} from "./types.js";
