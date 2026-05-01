/**
 * Shared types for Nepal administrative data.
 *
 * Hierarchy: Province → District → LocalUnit → Ward.
 * Counts (post-2017 federal restructuring):
 *   7 Provinces, 77 Districts, 753 Local-level units (6 metropolitan + 11
 *   sub-metropolitan + 276 municipality + 460 rural municipality), ~6,743 wards.
 */

/** Latitude / longitude pair (decimal degrees, WGS-84). */
export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

/** Stable canonical Province ID, e.g. `"P1"` for Koshi. */
export type ProvinceId = `P${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

/** Stable canonical District ID, e.g. `"P3.D05"` for Kathmandu. */
export type DistrictId = `${ProvinceId}.D${string}`;

/** Stable canonical LocalUnit ID, e.g. `"P3.D05.L01"` for KMC. */
export type LocalUnitId = `${DistrictId}.L${string}`;

/** Stable canonical Ward ID, e.g. `"P3.D05.L01.W05"`. */
export type WardId = `${LocalUnitId}.W${string}`;

/** Type of local-level unit (post-2017 federal structure). */
export type LocalUnitType =
  | "metropolitan"
  | "sub-metropolitan"
  | "municipality"
  | "rural-municipality";

/** A Nepali province. */
export interface Province {
  readonly id: ProvinceId;
  /** 1-7 sequence number. */
  readonly number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Romanized English name (e.g., `"Bagmati"`). */
  readonly nameEn: string;
  /** Devanagari name (e.g., `"बागमती"`). */
  readonly nameNe: string;
  /** Provincial capital city. */
  readonly capital: string;
  /** Capital city in Devanagari. */
  readonly capitalNe: string;
  /** Capital coordinates. */
  readonly capitalCoords: LatLng;
  /** Total area in km². */
  readonly areaKm2: number;
  /** Total population (Census 2021). */
  readonly population: number;
  /** Lower-case slug for URL/route use. */
  readonly slug: string;
  /** Alternate names / aliases (e.g., old "Province 3" for Bagmati). */
  readonly aliases: readonly string[];
}

/** A district within a province. */
export interface District {
  readonly id: DistrictId;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly provinceId: ProvinceId;
  readonly headquarters: string;
  readonly headquartersNe?: string;
  readonly slug: string;
  readonly aliases: readonly string[];
}

/** A local-level unit (palika). */
export interface LocalUnit {
  readonly id: LocalUnitId;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly type: LocalUnitType;
  readonly districtId: DistrictId;
  /** Total ward count. */
  readonly wards: number;
  /** Centroid / headquarters coordinates (optional — only the metro/sub-metro have these in v1). */
  readonly coords?: LatLng;
  /** Postal code if known. */
  readonly postalCode?: string;
  readonly slug: string;
  readonly aliases: readonly string[];
}

/** A specific ward. */
export interface Ward {
  readonly id: WardId;
  readonly number: number;
  readonly localUnitId: LocalUnitId;
}

// ----------------------------------------------------------------------
// Legacy admin structure — bidirectional cross-walk only
// ----------------------------------------------------------------------
//
// Pre-2015 hierarchy: Development Region → Zone → District.
//
// - 5 Development Regions   (विकास क्षेत्र) — abolished 2015.
// - 14 Zones                (अञ्चल)        — abolished 2015.
// - 75 Districts            (जिल्ला)       — pre-2017; same as current 77 minus
//                                            Nawalparasi → Nawalpur+Parasi split
//                                            and Rukum → Eastern+Western Rukum split.
//
// Purpose: convert legacy datasets (HMIS, old census, archived voter rolls)
// to the modern federal hierarchy and back. Nothing else. No coords, no HQs,
// no VDCs.

/** Stable canonical Region ID, e.g. `"R3"` for Western. */
export type RegionId = `R${1 | 2 | 3 | 4 | 5}`;

/** Stable canonical Zone ID, e.g. `"Z05"` for Bagmati Zone. */
export type ZoneId = `Z${string}`;

/** Stable canonical Legacy District ID, e.g. `"LD23"` for legacy Kathmandu. */
export type LegacyDistrictId = `LD${string}`;

/** A development region. */
export interface Region {
  readonly id: RegionId;
  readonly number: 1 | 2 | 3 | 4 | 5;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly slug: string;
  readonly aliases: readonly string[];
}

/** A zone. */
export interface Zone {
  readonly id: ZoneId;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly regionId: RegionId;
  readonly slug: string;
  readonly aliases: readonly string[];
}

/** A pre-2017 legacy district (75 total). Carries `currentDistrictIds` for cross-walk. */
export interface LegacyDistrict {
  readonly id: LegacyDistrictId;
  readonly nameEn: string;
  readonly nameNe: string;
  readonly zoneId: ZoneId;
  /** IDs of the modern (post-2017) districts that this legacy district mapped into. */
  readonly currentDistrictIds: readonly DistrictId[];
  readonly slug: string;
  readonly aliases: readonly string[];
}

/** Result of a legacy ↔ current cross-walk. */
export interface CrossWalkResult {
  readonly legacy?: LegacyDistrict;
  readonly current?: readonly District[];
  readonly zone?: Zone;
  readonly region?: Region;
}

/** Structured address parts (for formatter / parser). */
export interface AddressParts {
  /** Province name or id. */
  readonly province?: string;
  /** District name or id. */
  readonly district?: string;
  /** Local-level unit (palika) name or id. */
  readonly localUnit?: string;
  /** Ward number (e.g., 5). */
  readonly ward?: number;
  /** Free-text street/tole/marg. */
  readonly tole?: string;
  /** House/building number. */
  readonly house?: string;
  /** Postal code. */
  readonly postalCode?: string;
}

/** Validation result for `validateAddress`. */
export interface AddressValidationResult {
  readonly ok: boolean;
  readonly errors: ReadonlyArray<{
    readonly field: keyof AddressParts;
    readonly code: "missing" | "unknown" | "mismatch";
    readonly message: string;
  }>;
  /** Resolved canonical references when fields validate. */
  readonly resolved?: {
    readonly province?: Province;
    readonly district?: District;
    readonly localUnit?: LocalUnit;
  };
}

/** Search hit from the fuzzy search across levels. */
export interface SearchHit {
  readonly level: "province" | "district" | "local-unit";
  readonly record: Province | District | LocalUnit;
  readonly score: number;
}
