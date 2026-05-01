/**
 * Local-level units (palika) of Nepal.
 *
 * Total nationwide: **753** = 6 metropolitan + 11 sub-metropolitan + 276
 * municipalities + 460 rural municipalities. v1.0 ships **all 17 metro /
 * sub-metropolitan cities** with verified bilingual data; the full 736
 * municipalities and rural municipalities will follow in v1.x via additional
 * data files (PRs welcome).
 *
 * Sources: MoFAGA, Election Commission of Nepal, Wikipedia "Metropolitan
 * cities of Nepal" / "Sub-metropolitan cities of Nepal".
 */

import { DISTRICTS } from "./districts.js";
import type { DistrictId, LocalUnit, LocalUnitId, LocalUnitType } from "../types.js";

interface LocalUnitSeed {
  readonly nameEn: string;
  readonly nameNe: string;
  readonly type: LocalUnitType;
  readonly districtNameEn: string;
  readonly wards: number;
  readonly coords?: { lat: number; lng: number };
  readonly postalCode?: string;
  readonly aliases?: readonly string[];
}

const SEED: readonly LocalUnitSeed[] = [
  // 6 Metropolitan Cities
  {
    nameEn: "Kathmandu Metropolitan City",
    nameNe: "काठमाडौँ महानगरपालिका",
    type: "metropolitan",
    districtNameEn: "Kathmandu",
    wards: 32,
    coords: { lat: 27.7172, lng: 85.3240 },
    postalCode: "44600",
    aliases: ["Kathmandu", "KMC", "काठमाडौँ"],
  },
  {
    nameEn: "Pokhara Metropolitan City",
    nameNe: "पोखरा महानगरपालिका",
    type: "metropolitan",
    districtNameEn: "Kaski",
    wards: 33,
    coords: { lat: 28.2096, lng: 83.9856 },
    postalCode: "33700",
    aliases: ["Pokhara", "Pokhara Lekhnath"],
  },
  {
    nameEn: "Lalitpur Metropolitan City",
    nameNe: "ललितपुर महानगरपालिका",
    type: "metropolitan",
    districtNameEn: "Lalitpur",
    wards: 29,
    coords: { lat: 27.6710, lng: 85.3250 },
    postalCode: "44700",
    aliases: ["Lalitpur", "Patan", "LMC"],
  },
  {
    nameEn: "Bharatpur Metropolitan City",
    nameNe: "भरतपुर महानगरपालिका",
    type: "metropolitan",
    districtNameEn: "Chitwan",
    wards: 29,
    coords: { lat: 27.6770, lng: 84.4344 },
    postalCode: "44200",
    aliases: ["Bharatpur"],
  },
  {
    nameEn: "Biratnagar Metropolitan City",
    nameNe: "विराटनगर महानगरपालिका",
    type: "metropolitan",
    districtNameEn: "Morang",
    wards: 19,
    coords: { lat: 26.4525, lng: 87.2718 },
    postalCode: "56600",
    aliases: ["Biratnagar"],
  },
  {
    nameEn: "Birgunj Metropolitan City",
    nameNe: "वीरगञ्ज महानगरपालिका",
    type: "metropolitan",
    districtNameEn: "Parsa",
    wards: 32,
    coords: { lat: 27.0104, lng: 84.8770 },
    postalCode: "44300",
    aliases: ["Birgunj", "Birganj"],
  },

  // 11 Sub-metropolitan cities
  {
    nameEn: "Janakpurdham Sub-Metropolitan City",
    nameNe: "जनकपुरधाम उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Dhanusha",
    wards: 24,
    coords: { lat: 26.7271, lng: 85.9407 },
    postalCode: "45600",
    aliases: ["Janakpur", "Janakpurdham"],
  },
  {
    nameEn: "Hetauda Sub-Metropolitan City",
    nameNe: "हेटौँडा उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Makwanpur",
    wards: 19,
    coords: { lat: 27.4287, lng: 85.0322 },
    postalCode: "44100",
    aliases: ["Hetauda"],
  },
  {
    nameEn: "Dhangadhi Sub-Metropolitan City",
    nameNe: "धनगढी उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Kailali",
    wards: 19,
    coords: { lat: 28.7032, lng: 80.5887 },
    postalCode: "10900",
    aliases: ["Dhangadi", "Dhangadhi"],
  },
  {
    nameEn: "Tulsipur Sub-Metropolitan City",
    nameNe: "तुलसीपुर उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Dang",
    wards: 19,
    coords: { lat: 28.1316, lng: 82.2967 },
    postalCode: "22400",
    aliases: ["Tulsipur"],
  },
  {
    nameEn: "Itahari Sub-Metropolitan City",
    nameNe: "इटहरी उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Sunsari",
    wards: 20,
    coords: { lat: 26.6651, lng: 87.2718 },
    postalCode: "56700",
    aliases: ["Itahari"],
  },
  {
    nameEn: "Nepalgunj Sub-Metropolitan City",
    nameNe: "नेपालगञ्ज उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Banke",
    wards: 23,
    coords: { lat: 28.0569, lng: 81.6167 },
    postalCode: "21900",
    aliases: ["Nepalganj", "Nepalgunj"],
  },
  {
    nameEn: "Butwal Sub-Metropolitan City",
    nameNe: "बुटवल उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Rupandehi",
    wards: 19,
    coords: { lat: 27.6866, lng: 83.4324 },
    postalCode: "32907",
    aliases: ["Butwal"],
  },
  {
    nameEn: "Dharan Sub-Metropolitan City",
    nameNe: "धरान उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Sunsari",
    wards: 20,
    coords: { lat: 26.8147, lng: 87.2769 },
    postalCode: "56700",
    aliases: ["Dharan"],
  },
  {
    nameEn: "Ghorahi Sub-Metropolitan City",
    nameNe: "घोराही उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Dang",
    wards: 19,
    coords: { lat: 28.0379, lng: 82.4953 },
    postalCode: "22414",
    aliases: ["Ghorahi"],
  },
  {
    nameEn: "Kalaiya Sub-Metropolitan City",
    nameNe: "कलैया उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Bara",
    wards: 27,
    coords: { lat: 27.0331, lng: 85.0078 },
    postalCode: "44400",
    aliases: ["Kalaiya"],
  },
  {
    nameEn: "Jeetpur Simara Sub-Metropolitan City",
    nameNe: "जीतपुर सिमरा उपमहानगरपालिका",
    type: "sub-metropolitan",
    districtNameEn: "Bara",
    wards: 24,
    aliases: ["Jeetpur Simara", "Jitpur Simara"],
  },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Resolve district by English name, throwing if absent. */
function findDistrictId(nameEn: string): DistrictId {
  const d = DISTRICTS.find((x) => x.nameEn === nameEn);
  if (!d) {
    throw new Error(`local-units seed references unknown district "${nameEn}"`);
  }
  return d.id;
}

/** Per-district running counter for stable IDs. */
function buildLocalUnits(): readonly LocalUnit[] {
  const perDistrict = new Map<DistrictId, number>();
  return SEED.map((seed): LocalUnit => {
    const districtId = findDistrictId(seed.districtNameEn);
    const next = (perDistrict.get(districtId) ?? 0) + 1;
    perDistrict.set(districtId, next);
    const id = `${districtId}.L${String(next).padStart(2, "0")}` as LocalUnitId;
    return {
      id,
      nameEn: seed.nameEn,
      nameNe: seed.nameNe,
      type: seed.type,
      districtId,
      wards: seed.wards,
      ...(seed.coords && { coords: seed.coords }),
      ...(seed.postalCode !== undefined && { postalCode: seed.postalCode }),
      slug: slugify(seed.nameEn.replace(/\s*(metropolitan|sub-metropolitan|municipality|rural municipality).*/i, "")),
      aliases: seed.aliases ?? [],
    };
  });
}

export const LOCAL_UNITS: readonly LocalUnit[] = buildLocalUnits();

/** Counts of local-unit types Nepal-wide (per Election Commission). */
export const LOCAL_UNIT_TYPE_COUNTS: Readonly<Record<LocalUnitType, number>> = {
  metropolitan: 6,
  "sub-metropolitan": 11,
  municipality: 276,
  "rural-municipality": 460,
};

/** Total local-level units in Nepal (= 753). */
export const TOTAL_LOCAL_UNITS = 753;
