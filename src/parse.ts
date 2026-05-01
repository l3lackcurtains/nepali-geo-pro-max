/**
 * Best-effort free-form address parser. Looks for province, district, and
 * local unit names in the input string and extracts structured parts.
 *
 * Confidence is heuristic — high if all four levels resolved unambiguously.
 */

import { getDistrict, getLocalUnit, getProvince } from "./lookup.js";
import type { AddressParts } from "./types.js";
import { fold } from "./util.js";

/** Result of `parseAddress`. */
export interface ParsedAddress {
  readonly parts: AddressParts;
  /** 0..1 confidence score. */
  readonly confidence: number;
  /** Tokens we couldn't classify. */
  readonly unmatched: readonly string[];
}

/** Parse a free-form address string into structured parts. */
export function parseAddress(raw: string): ParsedAddress {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return {
      parts: {},
      confidence: 0,
      unmatched: [],
    };
  }

  // Tokenize on commas and whitespace, but keep multi-word phrases by also
  // doing a sliding-window search for known names.
  const trimmed = raw.trim();
  const tokens = trimmed.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);

  const out: { -readonly [K in keyof AddressParts]: AddressParts[K] } = {};
  const unmatched: string[] = [];

  for (const tok of tokens) {
    // Ward — matches "Ward N", "वडा N", "W-N", "ward no. N"
    const wardMatch = tok.match(/^(?:ward|वडा|w[- .]?(?:no\.?\s*)?)\s*([0-9०-९]+)$/i);
    if (wardMatch) {
      out.ward = parseInt(asciify(wardMatch[1]!), 10);
      continue;
    }

    // Postal code — 5-digit pattern
    if (/^\d{5}$/.test(tok)) {
      out.postalCode = tok;
      continue;
    }

    // Try province
    if (!out.province) {
      const p = getProvince(tok) || getProvince(tok.replace(/\s+province$/i, ""));
      if (p) {
        out.province = p.id;
        continue;
      }
    }

    // Try district
    if (!out.district) {
      const d = getDistrict(tok);
      if (d) {
        out.district = d.id;
        continue;
      }
    }

    // Try local unit
    if (!out.localUnit) {
      const u = getLocalUnit(tok);
      if (u) {
        out.localUnit = u.id;
        continue;
      }
    }

    unmatched.push(tok);
  }

  // If we found a local unit but not its parents, fill them in.
  if (out.localUnit) {
    const u = getLocalUnit(out.localUnit)!;
    if (!out.district) out.district = u.districtId;
    const d = getDistrict(u.districtId);
    if (d && !out.province) out.province = d.provinceId;
  } else if (out.district && !out.province) {
    const d = getDistrict(out.district)!;
    out.province = d.provinceId;
  }

  // Confidence heuristic.
  let confidence = 0;
  if (out.province) confidence += 0.25;
  if (out.district) confidence += 0.25;
  if (out.localUnit) confidence += 0.3;
  if (typeof out.ward === "number") confidence += 0.1;
  if (out.postalCode) confidence += 0.1;
  confidence = Math.min(1, confidence);

  return {
    parts: out as AddressParts,
    confidence,
    unmatched,
  };
}

const DEV_TO_ASCII: Record<string, string> = {
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};

function asciify(s: string): string {
  return s
    .split("")
    .map((c) => DEV_TO_ASCII[c] ?? c)
    .join("");
}

// Use fold to avoid unused-import warning (re-export for power users).
export { fold };
