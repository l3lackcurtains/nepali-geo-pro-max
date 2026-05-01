/**
 * GeoJSON types for the bundled Nepal admin boundaries.
 *
 * These are slim, tree-shakeable, and self-contained — no `@types/geojson`
 * dependency. If you want full GeoJSON spec types, cast at the call site.
 */

import type { DistrictId, ProvinceId } from "../types.js";

/** A `[lng, lat]` coordinate pair. */
export type Position = readonly [number, number];

/** Polygon ring: closed list of positions (first === last). */
export type Ring = readonly Position[];

/** Polygon geometry. First ring is exterior; subsequent are holes. */
export interface Polygon {
  readonly type: "Polygon";
  readonly coordinates: readonly Ring[];
}

/** MultiPolygon geometry — a list of polygons. */
export interface MultiPolygon {
  readonly type: "MultiPolygon";
  readonly coordinates: readonly (readonly Ring[])[];
}

export type PolygonGeometry = Polygon | MultiPolygon;

/** Feature with a province-level geometry. */
export interface ProvinceGeoFeature {
  readonly type: "Feature";
  readonly properties: {
    readonly id: ProvinceId;
  };
  readonly geometry: PolygonGeometry;
}

/** Feature with a district-level geometry. */
export interface DistrictGeoFeature {
  readonly type: "Feature";
  readonly properties: {
    readonly id: DistrictId;
    readonly provinceId: ProvinceId;
    readonly nameEn: string;
  };
  readonly geometry: PolygonGeometry;
}

/** Province-level FeatureCollection. */
export interface ProvinceGeoFeatureCollection {
  readonly type: "FeatureCollection";
  readonly features: readonly ProvinceGeoFeature[];
}

/** District-level FeatureCollection. */
export interface DistrictGeoFeatureCollection {
  readonly type: "FeatureCollection";
  readonly features: readonly DistrictGeoFeature[];
}

/** Union of geometric features the SVG / point-in-polygon helpers accept. */
export type AdminFeature = ProvinceGeoFeature | DistrictGeoFeature;
