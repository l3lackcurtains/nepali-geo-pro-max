/**
 * Point-in-polygon — ray-casting algorithm. No external deps.
 *
 * Used by `getProvinceByCoords` / `getDistrictByCoords` to resolve
 * which admin unit a `(lat, lng)` falls inside.
 */

import type {
  AdminFeature,
  DistrictGeoFeatureCollection,
  LocalUnitGeoFeatureCollection,
  PolygonGeometry,
  Position,
  ProvinceGeoFeatureCollection,
} from "./types.js";

/** True if point `[lng, lat]` is inside any polygon in `geom`. */
export function pointInGeometry(point: Position, geom: PolygonGeometry): boolean {
  if (geom.type === "Polygon") {
    return pointInPolygon(point, geom.coordinates);
  }
  for (const poly of geom.coordinates) {
    if (pointInPolygon(point, poly)) return true;
  }
  return false;
}

/** Standard ray-casting in lng/lat space — fine at country scale. */
function pointInPolygon(
  point: Position,
  polygon: readonly (readonly Position[])[],
): boolean {
  // First ring = exterior; subsequent = holes.
  const exterior = polygon[0];
  if (!exterior || !pointInRing(point, exterior)) return false;
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(point, polygon[i]!)) return false;  // inside a hole
  }
  return true;
}

function pointInRing(point: Position, ring: readonly Position[]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/**
 * Find the first feature in `fc` whose geometry contains `(lat, lng)`.
 * Returns `undefined` if no match (e.g. point outside Nepal).
 */
export function findFeatureByCoords<F extends AdminFeature>(
  fc: { readonly features: readonly F[] },
  lat: number,
  lng: number,
): F | undefined {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  const point: Position = [lng, lat];
  for (const f of fc.features) {
    if (pointInGeometry(point, f.geometry)) return f;
  }
  return undefined;
}

/**
 * Convenience wrappers — these accept the bundled FeatureCollections from
 * the `nepali-geo-pro-max/geo/*` subpath imports.
 */
export function findProvinceFeatureByCoords(
  provinces: ProvinceGeoFeatureCollection,
  lat: number,
  lng: number,
) {
  return findFeatureByCoords(provinces, lat, lng);
}

export function findDistrictFeatureByCoords(
  districts: DistrictGeoFeatureCollection,
  lat: number,
  lng: number,
) {
  return findFeatureByCoords(districts, lat, lng);
}

export function findLocalUnitFeatureByCoords(
  localUnits: LocalUnitGeoFeatureCollection,
  lat: number,
  lng: number,
) {
  return findFeatureByCoords(localUnits, lat, lng);
}
