import { describe, expect, it } from "vitest";
import {
  computeBBox,
  findDistrictFeatureByCoords,
  findProvinceFeatureByCoords,
  pointInGeometry,
  toSvg,
} from "../src/index.js";
import { NEPAL_DISTRICTS_GEO } from "../src/geo/districts.geo.js";
import { NEPAL_PROVINCES_GEO } from "../src/geo/provinces.geo.js";

describe("GeoJSON data integrity", () => {
  it("districts FeatureCollection has 77 features", () => {
    expect(NEPAL_DISTRICTS_GEO.type).toBe("FeatureCollection");
    expect(NEPAL_DISTRICTS_GEO.features).toHaveLength(77);
  });

  it("provinces FeatureCollection has 7 features", () => {
    expect(NEPAL_PROVINCES_GEO.features).toHaveLength(7);
  });

  it("every district feature has expected properties", () => {
    for (const f of NEPAL_DISTRICTS_GEO.features) {
      expect(f.properties.id).toMatch(/^P[1-7]\.D\d{2}$/);
      expect(f.properties.provinceId).toMatch(/^P[1-7]$/);
      expect(f.properties.nameEn.length).toBeGreaterThan(0);
      expect(["Polygon", "MultiPolygon"]).toContain(f.geometry.type);
    }
  });

  it("every province feature has expected properties", () => {
    for (const f of NEPAL_PROVINCES_GEO.features) {
      expect(f.properties.id).toMatch(/^P[1-7]$/);
      expect(["Polygon", "MultiPolygon"]).toContain(f.geometry.type);
    }
  });
});

describe("computeBBox", () => {
  it("Nepal sits roughly in 80–88 E and 26–31 N", () => {
    const [minLng, minLat, maxLng, maxLat] = computeBBox(NEPAL_DISTRICTS_GEO);
    expect(minLng).toBeGreaterThan(79);
    expect(minLng).toBeLessThan(82);
    expect(maxLng).toBeGreaterThan(86);
    expect(maxLng).toBeLessThan(89);
    expect(minLat).toBeGreaterThan(25);
    expect(minLat).toBeLessThan(28);
    expect(maxLat).toBeGreaterThan(29);
    expect(maxLat).toBeLessThan(32);
  });
});

describe("chuche map (post-May-2020 boundary)", () => {
  // The May 2020 amendment added Kalapani, Lipulekh, and Limpiyadhura
  // (~335 km²) to Nepal's NW corner — administratively in Darchula district (P7).
  // These are excluded from the old HDX 2019 boundary but should be included here.

  it("chuche beak NW tip is inside Darchula district", () => {
    // (30.45°N, 80.60°E) — well inside the post-2020 western beak.
    // The pre-2020 HDX boundary stops at lat ~29.93 here, so this point would
    // return NOT FOUND on the old map. Verifies we shipped the chuche map.
    const f = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 30.45, 80.60);
    expect(f?.properties.nameEn).toBe("Darchula");
  });

  it("Darchula bbox extends past 30.4°N (chuche beak signature)", () => {
    const darchula = NEPAL_DISTRICTS_GEO.features.find(
      (f) => f.properties.nameEn === "Darchula",
    );
    expect(darchula).toBeDefined();
    let maxLat = -Infinity;
    function walk(coords: unknown): void {
      if (typeof (coords as number[])[0] === "number") return;
      const arr = coords as unknown[];
      if (typeof (arr[0] as number[])[0] === "number") {
        for (const [, y] of arr as [number, number][]) {
          if (y > maxLat) maxLat = y;
        }
      } else {
        for (const c of arr) walk(c);
      }
    }
    walk(darchula!.geometry.coordinates as unknown);
    // Old (pre-2020) Darchula maxLat ≈ 29.93. Chuche maxLat ≈ 30.47.
    expect(maxLat).toBeGreaterThan(30.4);
  });

  it("Lipulekh area is inside Darchula district", () => {
    const f = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 30.222, 81.023);
    expect(f?.properties.nameEn).toBe("Darchula");
  });

  it("Kalapani area is inside Darchula district", () => {
    const f = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 30.20, 80.95);
    expect(f?.properties.nameEn).toBe("Darchula");
  });

  it("province bounding box extends past 30.4°N (chuche beak)", () => {
    const [, , , maxLat] = computeBBox(NEPAL_PROVINCES_GEO);
    expect(maxLat).toBeGreaterThan(30.4);
  });
});

describe("toSvg", () => {
  it("emits a valid SVG root", () => {
    const svg = toSvg(NEPAL_PROVINCES_GEO, { width: 200 });
    expect(svg.startsWith("<svg ")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 200');
    // 7 paths, one per province
    const pathCount = (svg.match(/<path /g) || []).length;
    expect(pathCount).toBe(7);
  });

  it("supports per-feature fill function", () => {
    const svg = toSvg(NEPAL_PROVINCES_GEO, {
      width: 200,
      fill: (f) => (f.properties.id === "P3" ? "#f00" : "#ccc"),
    });
    expect(svg).toContain('fill="#f00"');
    expect(svg).toContain('fill="#ccc"');
  });

  it("includes title and background", () => {
    const svg = toSvg(NEPAL_PROVINCES_GEO, {
      width: 100,
      title: "My Map",
      background: "#000",
    });
    expect(svg).toContain("<title>My Map</title>");
    expect(svg).toContain('fill="#000"');
  });

  it("featureAttrs hook injects custom attributes", () => {
    const svg = toSvg(NEPAL_DISTRICTS_GEO, {
      width: 100,
      featureAttrs: (f) => ({ "data-name": f.properties.nameEn }),
    });
    expect(svg).toContain('data-name="Kathmandu"');
  });

  it("rejects empty FeatureCollection", () => {
    expect(() =>
      toSvg({ type: "FeatureCollection", features: [] } as never, { width: 100 }),
    ).toThrow();
  });
});

describe("point-in-polygon", () => {
  it("Kathmandu (27.7172, 85.3240) → P3 / Kathmandu district", () => {
    const province = findProvinceFeatureByCoords(NEPAL_PROVINCES_GEO, 27.7172, 85.3240);
    expect(province?.properties.id).toBe("P3");
    const district = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 27.7172, 85.3240);
    expect(district?.properties.nameEn).toBe("Kathmandu");
  });

  it("Pokhara (28.2096, 83.9856) → P4 / Kaski district", () => {
    const province = findProvinceFeatureByCoords(NEPAL_PROVINCES_GEO, 28.2096, 83.9856);
    expect(province?.properties.id).toBe("P4");
    const district = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 28.2096, 83.9856);
    expect(district?.properties.nameEn).toBe("Kaski");
  });

  it("Biratnagar (26.4525, 87.2718) → P1 / Morang district", () => {
    const district = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 26.4525, 87.2718);
    expect(district?.properties.nameEn).toBe("Morang");
    expect(district?.properties.provinceId).toBe("P1");
  });

  it("Janakpur (26.7271, 85.9407) → P2 / Dhanusha district", () => {
    const district = findDistrictFeatureByCoords(NEPAL_DISTRICTS_GEO, 26.7271, 85.9407);
    expect(district?.properties.nameEn).toBe("Dhanusha");
    expect(district?.properties.provinceId).toBe("P2");
  });

  it("Far outside Nepal (e.g. Delhi 28.6, 77.2) → undefined", () => {
    const province = findProvinceFeatureByCoords(NEPAL_PROVINCES_GEO, 28.6, 77.2);
    expect(province).toBeUndefined();
  });

  it("non-finite coords → undefined", () => {
    expect(findProvinceFeatureByCoords(NEPAL_PROVINCES_GEO, NaN, 85)).toBeUndefined();
    expect(findProvinceFeatureByCoords(NEPAL_PROVINCES_GEO, 27, Infinity)).toBeUndefined();
  });

  it("pointInGeometry works on raw geometries", () => {
    const ktm = NEPAL_DISTRICTS_GEO.features.find((f) => f.properties.nameEn === "Kathmandu");
    expect(pointInGeometry([85.3240, 27.7172], ktm!.geometry)).toBe(true);
    expect(pointInGeometry([0, 0], ktm!.geometry)).toBe(false);
  });
});
