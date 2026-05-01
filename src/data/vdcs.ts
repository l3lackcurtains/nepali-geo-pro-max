/**
 * Village Development Committees (गाउँ विकास समिति, VDCs).
 *
 * **Abolished in 2017** when Nepal restructured local governance into 753
 * gaupalika / nagarpalika. Pre-2017, Nepal had **~3,915 VDCs** (the exact
 * number varied across reorganizations) plus a smaller set of municipalities,
 * each with the standard 9-ward subdivision.
 *
 * v1 ships the **types and lookup API** for VDCs but the dataset itself is
 * empty by default. The full ~3,915-row VDC table is large and authoritative
 * sources (CBS Census 2011, MoFAGA archives) require careful ingestion.
 *
 * Adding VDC data — recommended workflow:
 *  1. Source from CBS 2011 census tables or `cbs.gov.np` district profiles.
 *  2. Append to `LEGACY_VDCS` with verified bilingual names.
 *  3. Cross-reference `legacyDistrictId` against `LEGACY_DISTRICTS`.
 *  4. PR with citation in description.
 *
 * Alternatively, register an external dataset at runtime:
 *
 * ```ts
 * import { registerVdcs } from "nepali-geo-pro-max";
 * import myVdcs from "./my-vdc-data.json";
 * registerVdcs(myVdcs);
 * ```
 */

import type { Vdc } from "../types.js";

let mutableVdcs: Vdc[] = [];

/** All VDCs known to the registry. v1 ships this empty unless populated via PR or `registerVdcs`. */
export function getAllVdcs(): readonly Vdc[] {
  return mutableVdcs;
}

/** Append VDCs to the registry at runtime. Returns the new total count. */
export function registerVdcs(vdcs: readonly Vdc[]): number {
  mutableVdcs = mutableVdcs.concat(vdcs);
  return mutableVdcs.length;
}

/** Replace the registry wholesale. */
export function setVdcs(vdcs: readonly Vdc[]): number {
  mutableVdcs = [...vdcs];
  return mutableVdcs.length;
}

/** Clear the VDC registry. */
export function clearVdcs(): void {
  mutableVdcs = [];
}

/**
 * Approximate nationwide VDC count pre-2017. Exact number fluctuated across
 * reorganizations — common references cite **3,915** (2011 census era).
 */
export const APPROX_TOTAL_VDCS = 3_915;
