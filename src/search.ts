/**
 * Fuzzy search across provinces, districts, and local-level units.
 *
 * Matches across **English names, Devanagari names, slugs, and aliases**.
 * Bilingual queries are supported — `search("ललितपुर")` and
 * `search("Lalitpur")` both find the same record.
 *
 * Uses Levenshtein distance + substring containment for ranking. No external
 * dependencies (small in-house implementation).
 */

import { DISTRICTS } from "./data/districts.js";
import { LOCAL_UNITS } from "./data/local-units.js";
import { PROVINCES } from "./data/provinces.js";
import type { District, LocalUnit, Province, SearchHit } from "./types.js";
import { fold, similarity } from "./util.js";

/** Options for the fuzzy `search` function. */
export interface SearchOptions {
  /** Restrict to specific levels (default = all). */
  readonly levels?: ReadonlyArray<"province" | "district" | "local-unit">;
  /** Maximum hits returned (default 10). */
  readonly limit?: number;
  /** Minimum similarity score `0..1` (default 0.4). */
  readonly threshold?: number;
}

/** Score a record's name fields against a query. */
function scoreName(
  query: string,
  fields: readonly string[],
): number {
  const q = fold(query);
  let best = 0;
  for (const raw of fields) {
    if (!raw) continue;
    const f = fold(raw);
    if (f === q) return 1;
    if (f.includes(q)) {
      // Substring hits get a strong score; longer matches score better.
      const s = 0.7 + 0.2 * (q.length / f.length);
      if (s > best) best = s;
    } else {
      const sim = similarity(f, q);
      if (sim > best) best = sim;
    }
    // Also try Devanagari-equivalent direct contains (no fold).
    if (raw.includes(query) && !best) best = 0.85;
  }
  return best;
}

const PROVINCE_FIELDS = (p: Province): string[] => [p.nameEn, p.nameNe, p.slug, ...p.aliases];
const DISTRICT_FIELDS = (d: District): string[] => [d.nameEn, d.nameNe, d.slug, ...d.aliases, d.headquarters];
const LOCAL_UNIT_FIELDS = (u: LocalUnit): string[] => [u.nameEn, u.nameNe, u.slug, ...u.aliases];

/**
 * Fuzzy-search across all administrative levels.
 *
 * @example
 * search("Lalitpur");          // finds Lalitpur district + Lalitpur Metropolitan
 * search("ललितपुर");           // same — bilingual search
 * search("Janakpur", { levels: ["local-unit"] });
 */
export function search(query: string, options: SearchOptions = {}): SearchHit[] {
  const { levels = ["province", "district", "local-unit"], limit = 10, threshold = 0.4 } = options;
  if (!query || !query.trim()) return [];
  const hits: SearchHit[] = [];

  if (levels.includes("province")) {
    for (const p of PROVINCES) {
      const score = scoreName(query, PROVINCE_FIELDS(p));
      if (score >= threshold) hits.push({ level: "province", record: p, score });
    }
  }
  if (levels.includes("district")) {
    for (const d of DISTRICTS) {
      const score = scoreName(query, DISTRICT_FIELDS(d));
      if (score >= threshold) hits.push({ level: "district", record: d, score });
    }
  }
  if (levels.includes("local-unit")) {
    for (const u of LOCAL_UNITS) {
      const score = scoreName(query, LOCAL_UNIT_FIELDS(u));
      if (score >= threshold) hits.push({ level: "local-unit", record: u, score });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
