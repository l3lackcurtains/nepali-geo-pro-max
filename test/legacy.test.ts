import { describe, expect, it } from "vitest";
import {
  APPROX_TOTAL_VDCS,
  LEGACY_DISTRICTS,
  REGIONS,
  TOTAL_LEGACY_DISTRICTS,
  ZONES,
  clearVdcs,
  crossWalk,
  getCurrentDistrictsForLegacyDistrict,
  getLegacyDistrict,
  getLegacyDistrictForCurrentDistrict,
  getLegacyDistrictsByRegion,
  getLegacyDistrictsByZone,
  getRegion,
  getRegions,
  getVdc,
  getVdcs,
  getZone,
  getZones,
  getZonesByRegion,
  isValidLegacyDistrict,
  isValidRegion,
  isValidZone,
  registerVdcs,
  setVdcs,
} from "../src/index.js";

describe("legacy invariants", () => {
  it("5 development regions", () => {
    expect(REGIONS).toHaveLength(5);
  });

  it("14 zones", () => {
    expect(ZONES).toHaveLength(14);
  });

  it("75 legacy districts", () => {
    expect(LEGACY_DISTRICTS).toHaveLength(75);
    expect(TOTAL_LEGACY_DISTRICTS).toBe(75);
  });

  it("zones per region (3-3-3-3-2)", () => {
    expect(ZONES.filter((z) => z.regionId === "R1")).toHaveLength(3);
    expect(ZONES.filter((z) => z.regionId === "R2")).toHaveLength(3);
    expect(ZONES.filter((z) => z.regionId === "R3")).toHaveLength(3);
    expect(ZONES.filter((z) => z.regionId === "R4")).toHaveLength(3);
    expect(ZONES.filter((z) => z.regionId === "R5")).toHaveLength(2);
  });

  it("legacy district counts per zone match the canonical map", () => {
    const expected: Record<string, number> = {
      Z01: 4,  // Mechi
      Z02: 6,  // Koshi
      Z03: 6,  // Sagarmatha
      Z04: 6,  // Janakpur
      Z05: 8,  // Bagmati
      Z06: 5,  // Narayani
      Z07: 6,  // Gandaki
      Z08: 6,  // Lumbini
      Z09: 4,  // Dhaulagiri
      Z10: 5,  // Rapti
      Z11: 5,  // Bheri
      Z12: 5,  // Karnali
      Z13: 5,  // Seti
      Z14: 4,  // Mahakali
    };
    for (const [zoneId, count] of Object.entries(expected)) {
      expect(LEGACY_DISTRICTS.filter((d) => d.zoneId === zoneId)).toHaveLength(count);
    }
  });

  it("every legacy district has at least 1 currentDistrictId", () => {
    for (const d of LEGACY_DISTRICTS) {
      expect(d.currentDistrictIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("Nawalparasi splits into 2 modern districts", () => {
    const nawal = LEGACY_DISTRICTS.find((d) => d.nameEn === "Nawalparasi");
    expect(nawal?.currentDistrictIds).toHaveLength(2);
    expect(nawal?.currentDistrictIds).toContain("P4.D08");  // Nawalpur
    expect(nawal?.currentDistrictIds).toContain("P5.D09");  // Parasi
  });

  it("Rukum splits into 2 modern districts", () => {
    const rukum = LEGACY_DISTRICTS.find((d) => d.nameEn === "Rukum");
    expect(rukum?.currentDistrictIds).toHaveLength(2);
    expect(rukum?.currentDistrictIds).toContain("P5.D05");  // Eastern Rukum
    expect(rukum?.currentDistrictIds).toContain("P6.D10");  // Western Rukum
  });

  it("union of all currentDistrictIds = 77 (matches modern districts)", () => {
    const all = new Set<string>();
    for (const d of LEGACY_DISTRICTS) {
      for (const id of d.currentDistrictIds) all.add(id);
    }
    expect(all.size).toBe(77);
  });

  it("region & zone names are unique", () => {
    expect(new Set(REGIONS.map((r) => r.nameEn)).size).toBe(REGIONS.length);
    expect(new Set(ZONES.map((z) => z.nameEn)).size).toBe(ZONES.length);
  });
});

describe("getRegion", () => {
  it("by id", () => {
    expect(getRegion("R3")?.nameEn).toBe("Western Development Region");
  });
  it("by number", () => {
    expect(getRegion(3)?.id).toBe("R3");
  });
  it("by alias", () => {
    expect(getRegion("Far-West")?.id).toBe("R5");
    expect(getRegion("Purbanchal")?.id).toBe("R1");
  });
  it("by Devanagari", () => {
    expect(getRegion("पूर्वाञ्चल")?.id).toBe("R1");
  });
});

describe("getZone", () => {
  it("by name", () => {
    expect(getZone("Bagmati")?.regionId).toBe("R2");
    expect(getZone("Mechi")?.regionId).toBe("R1");
  });
  it("by id", () => {
    expect(getZone("Z05")?.nameEn).toBe("Bagmati");
  });
  it("by Devanagari", () => {
    expect(getZone("कोशी")?.id).toBe("Z02");
  });
});

describe("getZonesByRegion", () => {
  it("R1 has Mechi, Koshi, Sagarmatha", () => {
    const zones = getZonesByRegion("R1");
    const names = zones.map((z) => z.nameEn);
    expect(names).toEqual(["Mechi", "Koshi", "Sagarmatha"]);
  });
  it("R5 has Seti, Mahakali", () => {
    const zones = getZonesByRegion("Far-Western");
    expect(zones.map((z) => z.nameEn)).toEqual(["Seti", "Mahakali"]);
  });
});

describe("getLegacyDistrict", () => {
  it("by name", () => {
    expect(getLegacyDistrict("Kathmandu")?.zoneId).toBe("Z05");
  });
  it("by Devanagari", () => {
    expect(getLegacyDistrict("काठमाडौँ")?.zoneId).toBe("Z05");
  });
  it("by alias", () => {
    expect(getLegacyDistrict("Kavre")?.nameEn).toBe("Kavrepalanchok");
  });
});

describe("getLegacyDistrictsByZone / Region", () => {
  it("Bagmati zone has 8", () => {
    expect(getLegacyDistrictsByZone("Bagmati")).toHaveLength(8);
  });
  it("Eastern region has 16 (4+6+6)", () => {
    expect(getLegacyDistrictsByRegion("R1")).toHaveLength(16);
  });
  it("Mid-Western region has 15 (5+5+5)", () => {
    expect(getLegacyDistrictsByRegion("Mid-Western")).toHaveLength(15);
  });
});

describe("cross-walks", () => {
  it("legacy → current (single)", () => {
    const dists = getCurrentDistrictsForLegacyDistrict("Kathmandu");
    expect(dists).toHaveLength(1);
    expect(dists[0]?.id).toBe("P3.D05");
  });

  it("legacy → current (Nawalparasi splits)", () => {
    const dists = getCurrentDistrictsForLegacyDistrict("Nawalparasi");
    expect(dists).toHaveLength(2);
    expect(dists.map((d) => d.nameEn).sort()).toEqual(["Nawalpur", "Parasi"]);
  });

  it("legacy → current (Rukum splits)", () => {
    const dists = getCurrentDistrictsForLegacyDistrict("Rukum");
    expect(dists).toHaveLength(2);
    expect(dists.map((d) => d.nameEn).sort()).toEqual(["Eastern Rukum", "Western Rukum"]);
  });

  it("current → legacy (Nawalpur → Nawalparasi)", () => {
    expect(getLegacyDistrictForCurrentDistrict("Nawalpur")?.nameEn).toBe("Nawalparasi");
    expect(getLegacyDistrictForCurrentDistrict("Parasi")?.nameEn).toBe("Nawalparasi");
  });

  it("current → legacy (Eastern Rukum → Rukum)", () => {
    expect(getLegacyDistrictForCurrentDistrict("Eastern Rukum")?.nameEn).toBe("Rukum");
    expect(getLegacyDistrictForCurrentDistrict("Western Rukum")?.nameEn).toBe("Rukum");
  });

  it("current → legacy (1:1)", () => {
    expect(getLegacyDistrictForCurrentDistrict("Kathmandu")?.nameEn).toBe("Kathmandu");
  });

  it("crossWalk full chain", () => {
    const cw = crossWalk("Kathmandu");
    expect(cw.legacy?.nameEn).toBe("Kathmandu");
    expect(cw.zone?.nameEn).toBe("Bagmati");
    expect(cw.region?.id).toBe("R2");  // Central
    expect(cw.current?.[0]?.nameEn).toBe("Kathmandu");
  });
});

describe("validation predicates", () => {
  it("isValidRegion", () => {
    expect(isValidRegion("Western")).toBe(true);
    expect(isValidRegion(99)).toBe(false);
  });
  it("isValidZone", () => {
    expect(isValidZone("Bagmati")).toBe(true);
    expect(isValidZone("Foo")).toBe(false);
  });
  it("isValidLegacyDistrict", () => {
    expect(isValidLegacyDistrict("Nawalparasi")).toBe(true);
    expect(isValidLegacyDistrict("Foo")).toBe(false);
  });
});

describe("VDCs", () => {
  it("default registry is empty", () => {
    clearVdcs();
    expect(getVdcs()).toEqual([]);
  });

  it("registerVdcs appends", () => {
    clearVdcs();
    registerVdcs([
      {
        id: "LD23.V001",
        nameEn: "TestVDC",
        nameNe: "परीक्षण",
        legacyDistrictId: "LD23",
        wards: 9,
        slug: "testvdc",
        aliases: [],
      },
    ]);
    expect(getVdcs()).toHaveLength(1);
    expect(getVdc("TestVDC")?.legacyDistrictId).toBe("LD23");
  });

  it("setVdcs replaces", () => {
    clearVdcs();
    setVdcs([
      {
        id: "LD23.V001",
        nameEn: "First",
        nameNe: "पहिलो",
        legacyDistrictId: "LD23",
        wards: 9,
        slug: "first",
        aliases: [],
      },
      {
        id: "LD23.V002",
        nameEn: "Second",
        nameNe: "दोस्रो",
        legacyDistrictId: "LD23",
        wards: 9,
        slug: "second",
        aliases: [],
      },
    ]);
    expect(getVdcs()).toHaveLength(2);
  });

  it("APPROX_TOTAL_VDCS is documented", () => {
    expect(APPROX_TOTAL_VDCS).toBe(3915);
  });
});

describe("getRegions / getZones (count)", () => {
  it("getRegions", () => {
    expect(getRegions()).toHaveLength(5);
  });
  it("getZones", () => {
    expect(getZones()).toHaveLength(14);
  });
});
