import { describe, expect, it } from "vitest";
import {
  formatAddress,
  parseAddress,
  search,
  validateAddress,
} from "../src/index.js";

describe("search", () => {
  it("exact English province name", () => {
    const hits = search("Bagmati");
    expect(hits[0]?.level).toBe("province");
    expect(hits[0]?.score).toBe(1);
  });

  it("exact Devanagari name", () => {
    const hits = search("काठमाडौँ");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.level === "district")).toBe(true);
  });

  it("fuzzy typo", () => {
    const hits = search("Lalipur");   // missing 't'
    expect(hits[0]?.score).toBeGreaterThan(0.7);
  });

  it("alias hit", () => {
    const hits = search("KMC");
    expect(hits[0]?.level).toBe("local-unit");
    expect((hits[0]?.record as { nameEn: string }).nameEn).toBe("Kathmandu Metropolitan City");
  });

  it("respects level filter", () => {
    const hits = search("Lalitpur", { levels: ["district"] });
    expect(hits.every((h) => h.level === "district")).toBe(true);
  });

  it("returns empty for empty query", () => {
    expect(search("")).toEqual([]);
  });

  it("respects limit", () => {
    const hits = search("a", { limit: 3 });
    expect(hits.length).toBeLessThanOrEqual(3);
  });
});

describe("formatAddress", () => {
  it("long English", () => {
    const out = formatAddress({
      province: "Bagmati",
      district: "Kathmandu",
      localUnit: "Kathmandu Metropolitan City",
      ward: 5,
    });
    expect(out).toBe("Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati Province");
  });

  it("short English", () => {
    const out = formatAddress(
      {
        province: "Bagmati",
        district: "Kathmandu",
        localUnit: "Kathmandu Metropolitan City",
        ward: 5,
      },
      { style: "short" },
    );
    expect(out).toBe("Ward 5, Kathmandu, Kathmandu, Bagmati");
  });

  it("Nepali", () => {
    const out = formatAddress(
      {
        province: "Bagmati",
        district: "Kathmandu",
        localUnit: "Kathmandu Metropolitan City",
        ward: 5,
      },
      { locale: "ne" },
    );
    expect(out).toContain("वडा ५");
    expect(out).toContain("काठमाडौँ");
    expect(out).toContain("बागमती");
  });

  it("postal style", () => {
    const out = formatAddress(
      {
        province: "Bagmati",
        district: "Kathmandu",
        localUnit: "Kathmandu Metropolitan City",
        ward: 5,
        postalCode: "44600",
      },
      { style: "postal" },
    );
    expect(out).toContain("44600");
  });

  it("with tole and house", () => {
    const out = formatAddress({
      house: "12",
      tole: "Thamel",
      ward: 26,
      district: "Kathmandu",
      province: "Bagmati",
    });
    expect(out).toBe("12, Thamel, Ward 26, Kathmandu, Bagmati Province");
  });
});

describe("parseAddress", () => {
  it("parses standard format", () => {
    const r = parseAddress("Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati");
    expect(r.parts.ward).toBe(5);
    // Parser stores canonical ids
    expect(r.parts.localUnit).toMatch(/^P3\.D\d+\.L\d+$/);
    expect(r.parts.district).toMatch(/^P3\.D\d+$/);
    expect(r.parts.province).toBe("P3");
    expect(r.confidence).toBeGreaterThan(0.7);
  });

  it("parses Nepali ward", () => {
    const r = parseAddress("वडा १०, काठमाडौँ");
    expect(r.parts.ward).toBe(10);
  });

  it("infers parents from local unit alone", () => {
    const r = parseAddress("KMC");
    expect(r.parts.district).toBeDefined();
    expect(r.parts.province).toBe("P3");
  });

  it("captures postal code", () => {
    const r = parseAddress("44600, Kathmandu");
    expect(r.parts.postalCode).toBe("44600");
  });

  it("collects unmatched tokens", () => {
    const r = parseAddress("xyzfoo, Kathmandu");
    expect(r.unmatched).toContain("xyzfoo");
  });

  it("empty input", () => {
    expect(parseAddress("").confidence).toBe(0);
  });
});

describe("validateAddress", () => {
  it("ok for valid address", () => {
    const r = validateAddress({
      province: "Bagmati",
      district: "Kathmandu",
      localUnit: "Kathmandu Metropolitan City",
      ward: 5,
    });
    expect(r.ok).toBe(true);
    expect(r.errors).toHaveLength(0);
    expect(r.resolved?.province?.nameEn).toBe("Bagmati");
  });

  it("flags unknown district", () => {
    const r = validateAddress({ province: "Bagmati", district: "Atlantis" });
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.field).toBe("district");
    expect(r.errors[0]?.code).toBe("unknown");
  });

  it("flags province/district mismatch", () => {
    const r = validateAddress({ province: "Bagmati", district: "Kaski" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.code === "mismatch")).toBe(true);
  });

  it("flags out-of-range ward", () => {
    const r = validateAddress({
      localUnit: "Kathmandu Metropolitan City",
      ward: 99,
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "ward")).toBe(true);
  });
});
