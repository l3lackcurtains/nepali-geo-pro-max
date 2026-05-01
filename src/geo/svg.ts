/**
 * Render Nepal admin boundaries to SVG — zero deps, no D3, works in Node and
 * the browser.
 *
 * Uses a simple equirectangular projection (lat/lng → x/y) which is fine for
 * country-scale Nepal maps. For globe-grade accuracy, project the GeoJSON
 * with d3-geo before passing to this helper.
 *
 * @example
 * ```ts
 * import { toSvg } from "nepali-geo-pro-max";
 * import { NEPAL_DISTRICTS_GEO } from "nepali-geo-pro-max/geo/districts";
 *
 * const svg = toSvg(NEPAL_DISTRICTS_GEO, {
 *   width: 800,
 *   fill: (f) => f.properties.provinceId === "P3" ? "#ff5252" : "#e0e0e0",
 *   stroke: "#fff",
 *   strokeWidth: 0.5,
 * });
 * ```
 */

import type {
  AdminFeature,
  DistrictGeoFeatureCollection,
  PolygonGeometry,
  Position,
  ProvinceGeoFeatureCollection,
} from "./types.js";

/** Bounding box `[minLng, minLat, maxLng, maxLat]`. */
export type BBox = readonly [number, number, number, number];

/** Compute bbox of a feature collection. */
export function computeBBox(
  fc: DistrictGeoFeatureCollection | ProvinceGeoFeatureCollection,
): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const f of fc.features) {
    walkPositions(f.geometry, ([x, y]) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });
  }
  return [minX, minY, maxX, maxY];
}

function walkPositions(geom: PolygonGeometry, fn: (p: Position) => void): void {
  if (geom.type === "Polygon") {
    for (const ring of geom.coordinates) {
      for (const p of ring) fn(p);
    }
  } else {
    for (const poly of geom.coordinates) {
      for (const ring of poly) {
        for (const p of ring) fn(p);
      }
    }
  }
}

/** Options for `toSvg`. */
export interface ToSvgOptions {
  /** Desired SVG width in pixels (default 800). Height is computed to preserve aspect ratio. */
  readonly width?: number;
  /** Override height (px). If unset, derived from width + bbox aspect ratio. */
  readonly height?: number;
  /** Padding around the map (px). Default 8. */
  readonly padding?: number;
  /** Fill colour: `string` or `(feature) => string`. Default `"#e0e0e0"`. */
  readonly fill?: string | ((feature: AdminFeature) => string);
  /** Stroke colour. Default `"#fff"`. */
  readonly stroke?: string;
  /** Stroke width (px). Default `0.5`. */
  readonly strokeWidth?: number;
  /** Background colour for the `<svg>` element. Default `"none"`. */
  readonly background?: string;
  /** Optional accessible title. */
  readonly title?: string;
  /** Extra attributes injected onto the root `<svg>` element. */
  readonly svgAttrs?: Readonly<Record<string, string | number>>;
  /** Hook to add per-feature `<path>` attributes (e.g. `data-id`, `class`). */
  readonly featureAttrs?: (feature: AdminFeature) => Record<string, string | number>;
  /** ID prefix for `<path>` elements (default `"path"`). */
  readonly idPrefix?: string;
}

/**
 * Convert a Nepal admin GeoJSON FeatureCollection into a self-contained SVG
 * string. Equirectangular projection (lng/lat → x/y).
 */
export function toSvg(
  fc: DistrictGeoFeatureCollection | ProvinceGeoFeatureCollection,
  options: ToSvgOptions = {},
): string {
  const {
    width = 800,
    height,
    padding = 8,
    fill = "#e0e0e0",
    stroke = "#fff",
    strokeWidth = 0.5,
    background = "none",
    title,
    svgAttrs = {},
    featureAttrs,
    idPrefix = "path",
  } = options;

  const bbox = computeBBox(fc);
  const [minX, minY, maxX, maxY] = bbox;
  const dx = maxX - minX;
  const dy = maxY - minY;
  if (dx <= 0 || dy <= 0) {
    throw new RangeError("toSvg: empty or degenerate FeatureCollection");
  }

  // Account for latitude flipping (SVG y grows down).
  const innerW = width - 2 * padding;
  const aspect = dx / dy;
  const actualHeight = height ?? Math.round(innerW / aspect + 2 * padding);
  const innerH = actualHeight - 2 * padding;
  const scale = Math.min(innerW / dx, innerH / dy);
  const offsetX = padding + (innerW - dx * scale) / 2;
  const offsetY = padding + (innerH - dy * scale) / 2;

  function project([lng, lat]: Position): [number, number] {
    const x = (lng - minX) * scale + offsetX;
    const y = (maxY - lat) * scale + offsetY;
    return [round(x), round(y)];
  }

  function geometryToPath(geom: PolygonGeometry): string {
    const parts: string[] = [];
    if (geom.type === "Polygon") {
      ringToPath(geom.coordinates, parts);
    } else {
      for (const poly of geom.coordinates) ringToPath(poly, parts);
    }
    return parts.join(" ");
  }

  function ringToPath(rings: readonly (readonly Position[])[], out: string[]): void {
    for (const ring of rings) {
      if (ring.length === 0) continue;
      const first = project(ring[0]!);
      let s = `M${first[0]} ${first[1]}`;
      for (let i = 1; i < ring.length; i++) {
        const [x, y] = project(ring[i]!);
        s += `L${x} ${y}`;
      }
      s += "Z";
      out.push(s);
    }
  }

  function attrString(attrs: Record<string, string | number>): string {
    return Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${escapeAttr(String(v))}"`)
      .join("");
  }

  const paths = fc.features
    .map((f, i): string => {
      const d = geometryToPath(f.geometry);
      const fillVal = typeof fill === "function" ? fill(f) : fill;
      const idVal = ("id" in f.properties ? f.properties.id : `${idPrefix}-${i}`) as string;
      const baseAttrs: Record<string, string | number> = {
        id: idVal,
        d,
        fill: fillVal,
        stroke,
        "stroke-width": strokeWidth,
      };
      const extra = featureAttrs ? featureAttrs(f) : {};
      return `<path${attrString({ ...baseAttrs, ...extra })}/>`;
    })
    .join("");

  const titleEl = title ? `<title>${escapeText(title)}</title>` : "";
  const bgEl = background !== "none"
    ? `<rect width="100%" height="100%" fill="${escapeAttr(background)}"/>`
    : "";

  const svgRootAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 ${width} ${actualHeight}`,
    width,
    height: actualHeight,
    role: "img",
    ...svgAttrs,
  };

  return (
    `<svg${attrString(svgRootAttrs)}>` +
    titleEl +
    bgEl +
    paths +
    `</svg>`
  );
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
