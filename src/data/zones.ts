/**
 * The 14 zones of Nepal (अञ्चल).
 *
 * **Abolished in 2015** along with development regions. Listed here to support
 * legacy datasets that still classify districts by zone.
 *
 * Region → Zone count:
 *  - R1 Eastern: 3 (Mechi, Koshi, Sagarmatha)
 *  - R2 Central: 3 (Janakpur, Bagmati, Narayani)
 *  - R3 Western: 3 (Gandaki, Lumbini, Dhaulagiri)
 *  - R4 Mid-Western: 3 (Rapti, Bheri, Karnali)
 *  - R5 Far-Western: 2 (Seti, Mahakali)
 *
 * IDs use 2-digit padding for stable lexicographic ordering: `Z01`..`Z14`.
 */

import type { Zone } from "../types.js";

export const ZONES: readonly Zone[] = [
  // Eastern (R1)
  {
    id: "Z01",
    nameEn: "Mechi",
    nameNe: "मेची",
    regionId: "R1",
    headquarters: "Ilam",
    slug: "mechi",
    aliases: ["Mechi Zone"],
  },
  {
    id: "Z02",
    nameEn: "Koshi",
    nameNe: "कोशी",
    regionId: "R1",
    headquarters: "Biratnagar",
    slug: "koshi-zone",
    aliases: ["Koshi Zone", "Kosi"],
  },
  {
    id: "Z03",
    nameEn: "Sagarmatha",
    nameNe: "सगरमाथा",
    regionId: "R1",
    headquarters: "Rajbiraj",
    slug: "sagarmatha",
    aliases: ["Sagarmatha Zone"],
  },
  // Central (R2)
  {
    id: "Z04",
    nameEn: "Janakpur",
    nameNe: "जनकपुर",
    regionId: "R2",
    headquarters: "Jaleshwar",
    slug: "janakpur-zone",
    aliases: ["Janakpur Zone"],
  },
  {
    id: "Z05",
    nameEn: "Bagmati",
    nameNe: "बागमती",
    regionId: "R2",
    headquarters: "Kathmandu",
    slug: "bagmati-zone",
    aliases: ["Bagmati Zone"],
  },
  {
    id: "Z06",
    nameEn: "Narayani",
    nameNe: "नारायणी",
    regionId: "R2",
    headquarters: "Birgunj",
    slug: "narayani",
    aliases: ["Narayani Zone"],
  },
  // Western (R3)
  {
    id: "Z07",
    nameEn: "Gandaki",
    nameNe: "गण्डकी",
    regionId: "R3",
    headquarters: "Pokhara",
    slug: "gandaki-zone",
    aliases: ["Gandaki Zone"],
  },
  {
    id: "Z08",
    nameEn: "Lumbini",
    nameNe: "लुम्बिनी",
    regionId: "R3",
    headquarters: "Butwal",
    slug: "lumbini-zone",
    aliases: ["Lumbini Zone"],
  },
  {
    id: "Z09",
    nameEn: "Dhaulagiri",
    nameNe: "धौलागिरी",
    regionId: "R3",
    headquarters: "Baglung",
    slug: "dhaulagiri",
    aliases: ["Dhaulagiri Zone"],
  },
  // Mid-Western (R4)
  {
    id: "Z10",
    nameEn: "Rapti",
    nameNe: "राप्ती",
    regionId: "R4",
    headquarters: "Tulsipur",
    slug: "rapti",
    aliases: ["Rapti Zone"],
  },
  {
    id: "Z11",
    nameEn: "Bheri",
    nameNe: "भेरी",
    regionId: "R4",
    headquarters: "Nepalgunj",
    slug: "bheri",
    aliases: ["Bheri Zone"],
  },
  {
    id: "Z12",
    nameEn: "Karnali",
    nameNe: "कर्णाली",
    regionId: "R4",
    headquarters: "Jumla",
    slug: "karnali-zone",
    aliases: ["Karnali Zone"],
  },
  // Far-Western (R5)
  {
    id: "Z13",
    nameEn: "Seti",
    nameNe: "सेती",
    regionId: "R5",
    headquarters: "Dipayal Silgadhi",
    slug: "seti",
    aliases: ["Seti Zone"],
  },
  {
    id: "Z14",
    nameEn: "Mahakali",
    nameNe: "महाकाली",
    regionId: "R5",
    headquarters: "Mahendranagar",
    slug: "mahakali",
    aliases: ["Mahakali Zone"],
  },
];
