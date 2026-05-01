import { describe, expect, it } from "vitest";
import {
  DISTRICTS,
  DISTRICTS_BY_PROVINCE_COUNT,
  LOCAL_UNITS,
  LOCAL_UNIT_TYPE_COUNTS,
  PROVINCES,
  TOTAL_LOCAL_UNITS,
} from "../src/index.js";

describe("invariants", () => {
  it("7 provinces", () => {
    expect(PROVINCES).toHaveLength(7);
  });

  it("77 districts", () => {
    expect(DISTRICTS).toHaveLength(77);
  });

  it("districts per province", () => {
    expect(DISTRICTS.filter((d) => d.provinceId === "P1")).toHaveLength(14);
    expect(DISTRICTS.filter((d) => d.provinceId === "P2")).toHaveLength(8);
    expect(DISTRICTS.filter((d) => d.provinceId === "P3")).toHaveLength(13);
    expect(DISTRICTS.filter((d) => d.provinceId === "P4")).toHaveLength(11);
    expect(DISTRICTS.filter((d) => d.provinceId === "P5")).toHaveLength(12);
    expect(DISTRICTS.filter((d) => d.provinceId === "P6")).toHaveLength(10);
    expect(DISTRICTS.filter((d) => d.provinceId === "P7")).toHaveLength(9);
    const total = Object.values(DISTRICTS_BY_PROVINCE_COUNT).reduce((a, b) => a + b, 0);
    expect(total).toBe(77);
  });

  it("every province has unique non-empty bilingual names", () => {
    const seenEn = new Set<string>();
    const seenNe = new Set<string>();
    for (const p of PROVINCES) {
      expect(p.nameEn.length).toBeGreaterThan(0);
      expect(p.nameNe.length).toBeGreaterThan(0);
      expect(seenEn.has(p.nameEn)).toBe(false);
      expect(seenNe.has(p.nameNe)).toBe(false);
      seenEn.add(p.nameEn);
      seenNe.add(p.nameNe);
    }
  });

  it("every district has unique non-empty bilingual names", () => {
    for (const d of DISTRICTS) {
      expect(d.nameEn.length).toBeGreaterThan(0);
      expect(d.nameNe.length).toBeGreaterThan(0);
    }
  });

  it("every district references a valid province", () => {
    const provinceIds = new Set(PROVINCES.map((p) => p.id));
    for (const d of DISTRICTS) {
      expect(provinceIds.has(d.provinceId)).toBe(true);
    }
  });

  it("every local unit references a valid district", () => {
    const districtIds = new Set(DISTRICTS.map((d) => d.id));
    for (const u of LOCAL_UNITS) {
      expect(districtIds.has(u.districtId)).toBe(true);
    }
  });

  it("17 metro/sub-metro shipped in v1", () => {
    const metro = LOCAL_UNITS.filter((u) => u.type === "metropolitan");
    const sub = LOCAL_UNITS.filter((u) => u.type === "sub-metropolitan");
    expect(metro).toHaveLength(6);
    expect(sub).toHaveLength(11);
  });

  it("nationwide totals match Nepal Election Commission", () => {
    expect(TOTAL_LOCAL_UNITS).toBe(753);
    expect(LOCAL_UNIT_TYPE_COUNTS.metropolitan).toBe(6);
    expect(LOCAL_UNIT_TYPE_COUNTS["sub-metropolitan"]).toBe(11);
    expect(LOCAL_UNIT_TYPE_COUNTS.municipality).toBe(276);
    expect(LOCAL_UNIT_TYPE_COUNTS["rural-municipality"]).toBe(460);
    const total = Object.values(LOCAL_UNIT_TYPE_COUNTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(TOTAL_LOCAL_UNITS);
  });

  it("province ids are P1..P7", () => {
    expect(PROVINCES.map((p) => p.id)).toEqual([
      "P1", "P2", "P3", "P4", "P5", "P6", "P7",
    ]);
  });

  it("every district id starts with its province id", () => {
    for (const d of DISTRICTS) {
      expect(d.id.startsWith(`${d.provinceId}.`)).toBe(true);
    }
  });

  it("every local unit id starts with its district id", () => {
    for (const u of LOCAL_UNITS) {
      expect(u.id.startsWith(`${u.districtId}.`)).toBe(true);
    }
  });
});
