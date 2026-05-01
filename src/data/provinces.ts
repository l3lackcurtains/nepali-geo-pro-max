/**
 * The 7 provinces of Nepal (post-2015 constitution).
 *
 * Province 1 was renamed **Koshi** by the provincial assembly on 1 March 2023.
 * All seven now have permanent names.
 *
 * Areas and populations from Census 2021 (CBS Nepal). Capital coordinates
 * from Wikipedia / OpenStreetMap (verified 2024-Q4).
 */

import type { Province } from "../types.js";

export const PROVINCES: readonly Province[] = [
  {
    id: "P1",
    number: 1,
    nameEn: "Koshi",
    nameNe: "कोशी",
    capital: "Biratnagar",
    capitalNe: "विराटनगर",
    capitalCoords: { lat: 26.4525, lng: 87.2718 },
    areaKm2: 25_905,
    population: 4_961_412,
    slug: "koshi",
    aliases: ["Province 1", "Province No. 1", "Koshi Pradesh", "प्रदेश १"],
  },
  {
    id: "P2",
    number: 2,
    nameEn: "Madhesh",
    nameNe: "मधेश",
    capital: "Janakpur",
    capitalNe: "जनकपुर",
    capitalCoords: { lat: 26.7271, lng: 85.9407 },
    areaKm2: 9_661,
    population: 6_114_600,
    slug: "madhesh",
    aliases: ["Province 2", "Madhesh Pradesh", "Madhes", "प्रदेश २"],
  },
  {
    id: "P3",
    number: 3,
    nameEn: "Bagmati",
    nameNe: "बागमती",
    capital: "Hetauda",
    capitalNe: "हेटौँडा",
    capitalCoords: { lat: 27.4287, lng: 85.0322 },
    areaKm2: 20_300,
    population: 6_116_866,
    slug: "bagmati",
    aliases: ["Province 3", "Bagmati Pradesh", "प्रदेश ३"],
  },
  {
    id: "P4",
    number: 4,
    nameEn: "Gandaki",
    nameNe: "गण्डकी",
    capital: "Pokhara",
    capitalNe: "पोखरा",
    capitalCoords: { lat: 28.2096, lng: 83.9856 },
    areaKm2: 21_504,
    population: 2_479_745,
    slug: "gandaki",
    aliases: ["Province 4", "Gandaki Pradesh", "प्रदेश ४"],
  },
  {
    id: "P5",
    number: 5,
    nameEn: "Lumbini",
    nameNe: "लुम्बिनी",
    capital: "Deukhuri",
    capitalNe: "देउखुरी",
    capitalCoords: { lat: 27.9927, lng: 82.5969 },
    areaKm2: 22_288,
    population: 5_124_225,
    slug: "lumbini",
    aliases: ["Province 5", "Lumbini Pradesh", "Butwal (interim)", "प्रदेश ५"],
  },
  {
    id: "P6",
    number: 6,
    nameEn: "Karnali",
    nameNe: "कर्णाली",
    capital: "Birendranagar",
    capitalNe: "वीरेन्द्रनगर",
    capitalCoords: { lat: 28.5990, lng: 81.6332 },
    areaKm2: 27_984,
    population: 1_694_889,
    slug: "karnali",
    aliases: ["Province 6", "Karnali Pradesh", "प्रदेश ६"],
  },
  {
    id: "P7",
    number: 7,
    nameEn: "Sudurpashchim",
    nameNe: "सुदूरपश्चिम",
    capital: "Godawari",
    capitalNe: "गोदावरी",
    capitalCoords: { lat: 28.9986, lng: 80.5847 },
    areaKm2: 19_539,
    population: 2_711_270,
    slug: "sudurpashchim",
    aliases: [
      "Province 7",
      "Sudurpashchim Pradesh",
      "Sudur Paschim",
      "Far-Western",
      "Far Western",
      "प्रदेश ७",
    ],
  },
];
