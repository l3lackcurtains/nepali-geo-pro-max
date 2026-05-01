/**
 * Address formatting — produce a human-readable address string from
 * structured `AddressParts`.
 *
 * Three styles:
 *  - `"short"` — `"Ward 5, Kathmandu, Bagmati"`
 *  - `"long"`  — `"Ward 5, Kathmandu Metropolitan City, Kathmandu, Bagmati Province"`
 *  - `"postal"` — `"Ward 5, Kathmandu Metropolitan City, Kathmandu, 44600 Bagmati"`
 *
 * Two locales: `"en"` and `"ne"`.
 */

import { getDistrict, getLocalUnit, getProvince } from "./lookup.js";
import type { AddressParts } from "./types.js";

/** Options for `formatAddress`. */
export interface FormatAddressOptions {
  /** Output language (default `"en"`). */
  readonly locale?: "en" | "ne";
  /** Style preset (default `"long"`). */
  readonly style?: "short" | "long" | "postal";
  /** Field separator (default `", "`). */
  readonly separator?: string;
}

/** Format a structured address into a single string. */
export function formatAddress(
  parts: AddressParts,
  options: FormatAddressOptions = {},
): string {
  const { locale = "en", style = "long", separator = ", " } = options;
  const segments: string[] = [];

  if (parts.house) segments.push(parts.house);
  if (parts.tole) segments.push(parts.tole);

  if (typeof parts.ward === "number") {
    segments.push(locale === "ne" ? `वडा ${toDevanagariDigits(parts.ward)}` : `Ward ${parts.ward}`);
  }

  if (parts.localUnit) {
    const u = getLocalUnit(parts.localUnit);
    if (u) {
      segments.push(locale === "ne" ? u.nameNe : (style === "short" ? simplifyLocalUnitName(u.nameEn) : u.nameEn));
    } else {
      segments.push(parts.localUnit);
    }
  }

  if (parts.district) {
    const d = getDistrict(parts.district);
    if (d) {
      segments.push(locale === "ne" ? d.nameNe : d.nameEn);
    } else {
      segments.push(parts.district);
    }
  }

  if (style === "postal" && parts.postalCode) {
    segments.push(parts.postalCode);
  }

  if (parts.province) {
    const p = getProvince(parts.province);
    if (p) {
      const name = locale === "ne" ? p.nameNe : p.nameEn;
      segments.push(style === "long" && locale === "en" ? `${name} Province` : name);
    } else {
      segments.push(parts.province);
    }
  }

  return segments.filter(Boolean).join(separator);
}

/** Trim "Metropolitan City" / "Sub-Metropolitan City" suffix from a name. */
function simplifyLocalUnitName(name: string): string {
  return name.replace(
    /\s+(metropolitan city|sub-metropolitan city|municipality|rural municipality)$/i,
    "",
  );
}

const DEV_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

function toDevanagariDigits(n: number): string {
  return String(n)
    .split("")
    .map((c) => {
      const d = parseInt(c, 10);
      return Number.isInteger(d) ? DEV_DIGITS[d]! : c;
    })
    .join("");
}
