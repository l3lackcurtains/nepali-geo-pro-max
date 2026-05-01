/**
 * Internal helpers — string normalization, fuzzy distance, transliteration
 * folding for cross-script search.
 */

/** Lowercase + strip accents (Latin) and Devanagari combining marks. */
export function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")        // Latin combining marks
    .replace(/[॑-॔]/g, "")        // Vedic accent marks
    .replace(/[‌‍]/g, "")        // ZWNJ / ZWJ
    .trim();
}

/** Levenshtein edit distance, iterative. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const m = a.length;
  const n = b.length;
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j]! + 1,
        curr[j - 1]! + 1,
        prev[j - 1]! + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n]!;
}

/**
 * Similarity score in [0, 1]. 1 = exact match. Uses Levenshtein normalized
 * by the longer string.
 */
export function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 && b.length === 0) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/** True if `q` (folded) appears as substring inside `s` (folded). */
export function containsFolded(s: string, q: string): boolean {
  return fold(s).includes(fold(q));
}
