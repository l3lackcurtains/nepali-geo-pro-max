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
  LocalUnitGeoFeatureCollection,
  PolygonGeometry,
  Position,
  ProvinceGeoFeatureCollection,
} from "./types.js";

/** Bounding box `[minLng, minLat, maxLng, maxLat]`. */
export type BBox = readonly [number, number, number, number];

/** Compute bbox of a feature collection. */
export function computeBBox(
  fc:
    | DistrictGeoFeatureCollection
    | ProvinceGeoFeatureCollection
    | LocalUnitGeoFeatureCollection,
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
 * One projected SVG `<path>` worth of data — emitted by `toSvgPaths()`.
 * Designed to be rendered as a React/Vue/Svelte/Solid component:
 *
 * @example
 * ```tsx
 * const { paths, viewBox } = toSvgPaths(NEPAL_DISTRICTS_GEO, { width: 800 });
 * return (
 *   <svg viewBox={viewBox}>
 *     {paths.map((p) => (
 *       <path
 *         key={p.id}
 *         d={p.d}
 *         fill={p.fill}
 *         stroke="#fff"
 *         onClick={() => alert(p.feature.properties.nameEn)}
 *       />
 *     ))}
 *   </svg>
 * );
 * ```
 */
export interface SvgPath<F extends AdminFeature = AdminFeature> {
  /** Stable identifier — feature's `id` if present, else `<idPrefix>-<index>`. */
  readonly id: string;
  /** SVG path `d` attribute (`M…L…Z` commands). */
  readonly d: string;
  /** Resolved fill colour (after running the `fill` option). */
  readonly fill: string;
  /** The original GeoJSON feature this path was projected from. */
  readonly feature: F;
}

/** Output of `toSvgPaths` — projection metadata + per-feature paths. */
export interface SvgPathsResult<F extends AdminFeature = AdminFeature> {
  /** SVG `viewBox` string, e.g. `"0 0 800 412"`. */
  readonly viewBox: string;
  readonly width: number;
  readonly height: number;
  readonly bbox: BBox;
  readonly paths: readonly SvgPath<F>[];
}

type AnyFc =
  | DistrictGeoFeatureCollection
  | ProvinceGeoFeatureCollection
  | LocalUnitGeoFeatureCollection;

/**
 * Project a Nepal FeatureCollection into structured per-feature SVG path data.
 * Use this for **interactive React / Vue / Svelte / Solid maps** where you
 * want to render each path as a component with event handlers.
 *
 * For a one-shot SVG string (SSR, static files, emails), use `toSvg()`.
 */
export function toSvgPaths<F extends AdminFeature = AdminFeature>(
  fc: AnyFc,
  options: Pick<
    ToSvgOptions,
    "width" | "height" | "padding" | "fill" | "idPrefix"
  > = {},
): SvgPathsResult<F> {
  const { width = 800, height, padding = 8, fill = "#e0e0e0", idPrefix = "path" } = options;

  const bbox = computeBBox(fc);
  const [minX, minY, maxX, maxY] = bbox;
  const dx = maxX - minX;
  const dy = maxY - minY;
  if (dx <= 0 || dy <= 0) {
    throw new RangeError("toSvgPaths: empty or degenerate FeatureCollection");
  }

  const innerW = width - 2 * padding;
  const aspect = dx / dy;
  const actualHeight = height ?? Math.round(innerW / aspect + 2 * padding);
  const innerH = actualHeight - 2 * padding;
  const scale = Math.min(innerW / dx, innerH / dy);
  const offsetX = padding + (innerW - dx * scale) / 2;
  const offsetY = padding + (innerH - dy * scale) / 2;

  function project([lng, lat]: Position): [number, number] {
    return [
      round((lng - minX) * scale + offsetX),
      round((maxY - lat) * scale + offsetY),
    ];
  }

  function geometryToPath(geom: PolygonGeometry): string {
    const parts: string[] = [];
    const handle = (rings: readonly (readonly Position[])[]) => {
      for (const ring of rings) {
        if (ring.length === 0) continue;
        const first = project(ring[0]!);
        let s = `M${first[0]} ${first[1]}`;
        for (let i = 1; i < ring.length; i++) {
          const [x, y] = project(ring[i]!);
          s += `L${x} ${y}`;
        }
        s += "Z";
        parts.push(s);
      }
    };
    if (geom.type === "Polygon") handle(geom.coordinates);
    else for (const poly of geom.coordinates) handle(poly);
    return parts.join(" ");
  }

  const paths = fc.features.map((f, i): SvgPath<F> => {
    const d = geometryToPath(f.geometry);
    const fillVal = typeof fill === "function" ? fill(f as AdminFeature) : fill;
    const props = f.properties as Record<string, unknown>;
    const idVal =
      "id" in props && typeof props.id === "string"
        ? props.id
        : `${idPrefix}-${i}`;
    return { id: idVal, d, fill: fillVal, feature: f as F };
  });

  return {
    viewBox: `0 0 ${width} ${actualHeight}`,
    width,
    height: actualHeight,
    bbox,
    paths,
  };
}

/**
 * Convert a Nepal admin GeoJSON FeatureCollection into a self-contained SVG
 * string. Equirectangular projection (lng/lat → x/y). Best for SSR, static
 * file generation, emails, or `dangerouslySetInnerHTML` in React.
 *
 * For interactive React/Vue/Svelte rendering with per-feature event handlers,
 * use `toSvgPaths()` instead.
 */
export function toSvg(fc: AnyFc, options: ToSvgOptions = {}): string {
  const {
    stroke = "#fff",
    strokeWidth = 0.5,
    background = "none",
    title,
    svgAttrs = {},
    featureAttrs,
  } = options;

  const projected = toSvgPaths(fc, options);

  function attrString(attrs: Record<string, string | number>): string {
    return Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${escapeAttr(String(v))}"`)
      .join("");
  }

  // One <path> per line so editors and SVG previewers don't have to reflow
  // a single multi-hundred-KB line — VS Code's SVG preview is happier this way.
  const pathEls = projected.paths
    .map((p): string => {
      const baseAttrs: Record<string, string | number> = {
        id: p.id,
        d: p.d,
        fill: p.fill,
        stroke,
        "stroke-width": strokeWidth,
      };
      const extra = featureAttrs ? featureAttrs(p.feature) : {};
      return `  <path${attrString({ ...baseAttrs, ...extra })}/>`;
    })
    .join("\n");

  const titleEl = title ? `  <title>${escapeText(title)}</title>` : "";
  const bgEl = background !== "none"
    ? `  <rect width="100%" height="100%" fill="${escapeAttr(background)}"/>`
    : "";

  const svgRootAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: projected.viewBox,
    width: projected.width,
    height: projected.height,
    role: "img",
    ...svgAttrs,
  };

  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg${attrString(svgRootAttrs)}>`,
    ...(titleEl ? [titleEl] : []),
    ...(bgEl ? [bgEl] : []),
    pathEls,
    `</svg>`,
    "", // trailing newline
  ];
  return lines.join("\n");
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
