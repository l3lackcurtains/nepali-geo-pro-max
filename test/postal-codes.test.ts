import { describe, expect, it } from "vitest";
import {
  DISTRICT_POSTCODE_PREFIXES,
  LOCAL_UNITS,
  POSTAL_CODES,
  POSTAL_CODES_2025,
  POSTAL_CODE_BRANCHES,
  findByPostalCode,
  getLocalUnit,
} from "../src/index.js";

describe("postal-code data", () => {
  it("POSTAL_CODES has at least 400 entries (target: ~409 after v1.3 expansion)", () => {
    expect(Object.keys(POSTAL_CODES).length).toBeGreaterThanOrEqual(400);
  });

  it("every postal code is exactly 5 ASCII digits", () => {
    for (const [, code] of Object.entries(POSTAL_CODES)) {
      expect(code).toMatch(/^\d{5}$/);
    }
  });

  it("all 77 districts have a postcode prefix", () => {
    expect(Object.keys(DISTRICT_POSTCODE_PREFIXES).length).toBe(77);
    for (const [, prefix] of Object.entries(DISTRICT_POSTCODE_PREFIXES)) {
      expect(prefix).toMatch(/^\d{2}$/);
    }
  });

  it("branch lists contain only valid 5-digit codes", () => {
    for (const [, branches] of Object.entries(POSTAL_CODE_BRANCHES)) {
      for (const c of branches) {
        expect(c).toMatch(/^\d{5}$/);
      }
    }
  });
});

describe("POSTAL_CODES_2025 (new GPO federal-aligned)", () => {
  it("has 750+ entries (target: 752)", () => {
    expect(Object.keys(POSTAL_CODES_2025).length).toBeGreaterThanOrEqual(750);
  });

  it("Kathmandu Metropolitan = 30608 (anchor)", () => {
    expect(POSTAL_CODES_2025["kathmandu metropolitan city"]).toBe("30608");
  });

  it("every code is exactly 5 digits", () => {
    for (const code of Object.values(POSTAL_CODES_2025)) {
      expect(code).toMatch(/^\d{5}$/);
    }
  });

  it("first digit encodes province (1-7)", () => {
    for (const code of Object.values(POSTAL_CODES_2025)) {
      const provinceDigit = code[0];
      expect(["1", "2", "3", "4", "5", "6", "7"]).toContain(provinceDigit);
    }
  });

  it("all 5-digit codes are unique", () => {
    const codes = Object.values(POSTAL_CODES_2025);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("LOCAL_UNITS postal-code merging", () => {
  it("at least 100 palikas now carry a postalCode", () => {
    const withCodes = LOCAL_UNITS.filter((u) => u.postalCode);
    expect(withCodes.length).toBeGreaterThanOrEqual(100);
  });

  it("anchor metropolitan codes preserved (Kathmandu 44600, Pokhara 33700)", () => {
    expect(getLocalUnit("Kathmandu Metropolitan City")?.postalCode).toBe("44600");
    expect(getLocalUnit("Pokhara Metropolitan City")?.postalCode).toBe("33700");
    expect(getLocalUnit("Lalitpur Metropolitan City")?.postalCode).toBe("44700");
    expect(getLocalUnit("Bharatpur Metropolitan City")?.postalCode).toBe("44200");
    expect(getLocalUnit("Biratnagar Metropolitan City")?.postalCode).toBe("56600");
    expect(getLocalUnit("Birgunj Metropolitan City")?.postalCode).toBe("44300");
  });

  it("findByPostalCode resolves anchor codes", () => {
    expect(findByPostalCode("44600")?.nameEn).toBe("Kathmandu Metropolitan City");
    expect(findByPostalCode("33700")?.nameEn).toBe("Pokhara Metropolitan City");
  });
});
