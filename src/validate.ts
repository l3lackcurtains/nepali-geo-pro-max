/**
 * Address validation — checks each field is recognized and that the
 * province/district/local-unit hierarchy is consistent.
 */

import { getDistrict, getLocalUnit, getProvince } from "./lookup.js";
import type { AddressParts, AddressValidationResult } from "./types.js";

/** Validate a structured address. */
export function validateAddress(parts: AddressParts): AddressValidationResult {
  const errors: AddressValidationResult["errors"] = [];
  const resolved: AddressValidationResult["resolved"] = {};

  if (parts.province) {
    const p = getProvince(parts.province);
    if (!p) {
      (errors as Array<typeof errors[number]>).push({
        field: "province",
        code: "unknown",
        message: `Unknown province: "${parts.province}"`,
      });
    } else {
      (resolved as { -readonly [K in keyof typeof resolved]: typeof resolved[K] }).province = p;
    }
  }

  if (parts.district) {
    const d = getDistrict(parts.district);
    if (!d) {
      (errors as Array<typeof errors[number]>).push({
        field: "district",
        code: "unknown",
        message: `Unknown district: "${parts.district}"`,
      });
    } else {
      (resolved as { -readonly [K in keyof typeof resolved]: typeof resolved[K] }).district = d;
      if (resolved.province && d.provinceId !== resolved.province.id) {
        (errors as Array<typeof errors[number]>).push({
          field: "district",
          code: "mismatch",
          message: `District "${d.nameEn}" is not in province "${resolved.province.nameEn}"`,
        });
      }
    }
  }

  if (parts.localUnit) {
    const u = getLocalUnit(parts.localUnit);
    if (!u) {
      (errors as Array<typeof errors[number]>).push({
        field: "localUnit",
        code: "unknown",
        message: `Unknown local unit: "${parts.localUnit}"`,
      });
    } else {
      (resolved as { -readonly [K in keyof typeof resolved]: typeof resolved[K] }).localUnit = u;
      if (resolved.district && u.districtId !== resolved.district.id) {
        (errors as Array<typeof errors[number]>).push({
          field: "localUnit",
          code: "mismatch",
          message: `Local unit "${u.nameEn}" is not in district "${resolved.district.nameEn}"`,
        });
      }
    }
  }

  if (typeof parts.ward === "number" && resolved.localUnit) {
    if (parts.ward < 1 || parts.ward > resolved.localUnit.wards) {
      (errors as Array<typeof errors[number]>).push({
        field: "ward",
        code: "unknown",
        message: `Ward ${parts.ward} out of range — "${resolved.localUnit.nameEn}" has wards 1..${resolved.localUnit.wards}`,
      });
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    resolved,
  };
}
