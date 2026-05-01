/**
 * The 14 zones of Nepal (अञ्चल), abolished in 2015.
 *
 * Region → Zone count: R1 (3), R2 (3), R3 (3), R4 (3), R5 (2). Total = 14.
 */

import type { Zone } from "../types.js";

export const ZONES: readonly Zone[] = [
  // Eastern (R1)
  { id: "Z01", nameEn: "Mechi", nameNe: "मेची", regionId: "R1", slug: "mechi", aliases: ["Mechi Zone"] },
  { id: "Z02", nameEn: "Koshi", nameNe: "कोशी", regionId: "R1", slug: "koshi-zone", aliases: ["Koshi Zone", "Kosi"] },
  { id: "Z03", nameEn: "Sagarmatha", nameNe: "सगरमाथा", regionId: "R1", slug: "sagarmatha", aliases: ["Sagarmatha Zone"] },
  // Central (R2)
  { id: "Z04", nameEn: "Janakpur", nameNe: "जनकपुर", regionId: "R2", slug: "janakpur-zone", aliases: ["Janakpur Zone"] },
  { id: "Z05", nameEn: "Bagmati", nameNe: "बागमती", regionId: "R2", slug: "bagmati-zone", aliases: ["Bagmati Zone"] },
  { id: "Z06", nameEn: "Narayani", nameNe: "नारायणी", regionId: "R2", slug: "narayani", aliases: ["Narayani Zone"] },
  // Western (R3)
  { id: "Z07", nameEn: "Gandaki", nameNe: "गण्डकी", regionId: "R3", slug: "gandaki-zone", aliases: ["Gandaki Zone"] },
  { id: "Z08", nameEn: "Lumbini", nameNe: "लुम्बिनी", regionId: "R3", slug: "lumbini-zone", aliases: ["Lumbini Zone"] },
  { id: "Z09", nameEn: "Dhaulagiri", nameNe: "धौलागिरी", regionId: "R3", slug: "dhaulagiri", aliases: ["Dhaulagiri Zone"] },
  // Mid-Western (R4)
  { id: "Z10", nameEn: "Rapti", nameNe: "राप्ती", regionId: "R4", slug: "rapti", aliases: ["Rapti Zone"] },
  { id: "Z11", nameEn: "Bheri", nameNe: "भेरी", regionId: "R4", slug: "bheri", aliases: ["Bheri Zone"] },
  { id: "Z12", nameEn: "Karnali", nameNe: "कर्णाली", regionId: "R4", slug: "karnali-zone", aliases: ["Karnali Zone"] },
  // Far-Western (R5)
  { id: "Z13", nameEn: "Seti", nameNe: "सेती", regionId: "R5", slug: "seti", aliases: ["Seti Zone"] },
  { id: "Z14", nameEn: "Mahakali", nameNe: "महाकाली", regionId: "R5", slug: "mahakali", aliases: ["Mahakali Zone"] },
];
