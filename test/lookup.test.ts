import { describe, expect, it } from "vitest";
import {
  findByPostalCode,
  getDistrict,
  getDistrictsByProvince,
  getLocalUnit,
  getLocalUnitsByDistrict,
  getLocalUnitsByProvince,
  getParents,
  getProvince,
  isValidDistrict,
  isValidLocalUnit,
  isValidProvince,
  isValidWard,
} from "../src/index.js";

describe("getProvince", () => {
  it("by id", () => {
    expect(getProvince("P3")?.nameEn).toBe("Bagmati");
  });
  it("by number", () => {
    expect(getProvince(3)?.nameEn).toBe("Bagmati");
  });
  it("by English name", () => {
    expect(getProvince("Bagmati")?.id).toBe("P3");
  });
  it("by Devanagari name", () => {
    expect(getProvince("बागमती")?.id).toBe("P3");
  });
  it("by alias", () => {
    expect(getProvince("Province 3")?.id).toBe("P3");
    expect(getProvince("Far-Western")?.id).toBe("P7");
  });
  it("returns undefined for unknown", () => {
    expect(getProvince("Atlantis")).toBeUndefined();
  });
});

describe("getDistrict", () => {
  it("by English name", () => {
    expect(getDistrict("Kathmandu")?.provinceId).toBe("P3");
    expect(getDistrict("Kaski")?.provinceId).toBe("P4");
    expect(getDistrict("Jhapa")?.provinceId).toBe("P1");
  });
  it("by Devanagari name", () => {
    expect(getDistrict("काठमाडौँ")?.id).toMatch(/^P3\.D/);
  });
  it("by alias", () => {
    expect(getDistrict("Kavre")?.nameEn).toBe("Kavrepalanchok");
    expect(getDistrict("KTM")?.nameEn).toBe("Kathmandu");
  });
});

describe("getDistrictsByProvince", () => {
  it("Bagmati has 13", () => {
    expect(getDistrictsByProvince("Bagmati")).toHaveLength(13);
  });
  it("Madhesh has 8", () => {
    expect(getDistrictsByProvince(2)).toHaveLength(8);
  });
});

describe("getLocalUnit", () => {
  it("by English name", () => {
    expect(getLocalUnit("Kathmandu Metropolitan City")?.type).toBe("metropolitan");
  });
  it("by Devanagari name", () => {
    expect(getLocalUnit("काठमाडौँ महानगरपालिका")?.id).toMatch(/^P3/);
  });
  it("by alias", () => {
    expect(getLocalUnit("KMC")?.nameEn).toBe("Kathmandu Metropolitan City");
    expect(getLocalUnit("Patan")?.nameEn).toBe("Lalitpur Metropolitan City");
  });
});

describe("getLocalUnitsByDistrict / Province", () => {
  it("Kathmandu has 1 (KMC)", () => {
    const units = getLocalUnitsByDistrict("Kathmandu");
    expect(units.length).toBeGreaterThanOrEqual(1);
    expect(units[0]?.nameEn).toBe("Kathmandu Metropolitan City");
  });
  it("Bagmati has multiple metros + sub-metros", () => {
    const units = getLocalUnitsByProvince("Bagmati");
    expect(units.length).toBeGreaterThanOrEqual(4);  // KMC, LMC, BMC, Hetauda
  });
});

describe("findByPostalCode", () => {
  it("Kathmandu 44600", () => {
    expect(findByPostalCode("44600")?.nameEn).toBe("Kathmandu Metropolitan City");
  });
  it("Pokhara 33700", () => {
    expect(findByPostalCode("33700")?.nameEn).toBe("Pokhara Metropolitan City");
  });
});

describe("getParents", () => {
  it("from district id", () => {
    const ktm = getDistrict("Kathmandu")!;
    const parents = getParents(ktm.id);
    expect(parents.province?.nameEn).toBe("Bagmati");
    expect(parents.district?.nameEn).toBe("Kathmandu");
  });
  it("from local unit id", () => {
    const kmc = getLocalUnit("Kathmandu Metropolitan City")!;
    const parents = getParents(kmc.id);
    expect(parents.province?.nameEn).toBe("Bagmati");
    expect(parents.district?.nameEn).toBe("Kathmandu");
    expect(parents.localUnit?.nameEn).toBe("Kathmandu Metropolitan City");
  });
});

describe("validation predicates", () => {
  it("isValidProvince", () => {
    expect(isValidProvince("Bagmati")).toBe(true);
    expect(isValidProvince(3)).toBe(true);
    expect(isValidProvince("Atlantis")).toBe(false);
  });
  it("isValidDistrict", () => {
    expect(isValidDistrict("Kathmandu")).toBe(true);
    expect(isValidDistrict("Foo")).toBe(false);
  });
  it("isValidLocalUnit", () => {
    expect(isValidLocalUnit("KMC")).toBe(true);
    expect(isValidLocalUnit("Foo")).toBe(false);
  });
  it("isValidWard", () => {
    expect(isValidWard("KMC", 5)).toBe(true);
    expect(isValidWard("KMC", 32)).toBe(true);   // KMC has 32 wards
    expect(isValidWard("KMC", 33)).toBe(false);
    expect(isValidWard("KMC", 0)).toBe(false);
  });
});
