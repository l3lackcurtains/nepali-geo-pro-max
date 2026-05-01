/**
 * The 5 development regions of Nepal (विकास क्षेत्र).
 *
 * **Abolished in 2015** by the new federal constitution. Many older datasets
 * (HMIS, pre-2015 census, archived NGO reports) still index by these.
 *
 * Order is **east-to-west** as per traditional Nepalese administrative ordering.
 */

import type { Region } from "../types.js";

export const REGIONS: readonly Region[] = [
  {
    id: "R1",
    number: 1,
    nameEn: "Eastern Development Region",
    nameNe: "पूर्वाञ्चल विकास क्षेत्र",
    capital: "Dhankuta",
    capitalNe: "धनकुटा",
    slug: "eastern",
    aliases: ["Eastern", "Eastern Region", "Purbanchal", "पूर्वाञ्चल", "Purwanchal"],
  },
  {
    id: "R2",
    number: 2,
    nameEn: "Central Development Region",
    nameNe: "मध्यमाञ्चल विकास क्षेत्र",
    capital: "Kathmandu",
    capitalNe: "काठमाडौँ",
    slug: "central",
    aliases: ["Central", "Central Region", "Madhyamanchal", "मध्यमाञ्चल"],
  },
  {
    id: "R3",
    number: 3,
    nameEn: "Western Development Region",
    nameNe: "पश्चिमाञ्चल विकास क्षेत्र",
    capital: "Pokhara",
    capitalNe: "पोखरा",
    slug: "western",
    aliases: ["Western", "Western Region", "Paschimanchal", "पश्चिमाञ्चल"],
  },
  {
    id: "R4",
    number: 4,
    nameEn: "Mid-Western Development Region",
    nameNe: "मध्य-पश्चिमाञ्चल विकास क्षेत्र",
    capital: "Birendranagar",
    capitalNe: "वीरेन्द्रनगर",
    slug: "mid-western",
    aliases: [
      "Mid-Western",
      "Mid-West",
      "Mid Western Region",
      "Madhya-Paschimanchal",
      "मध्य-पश्चिमाञ्चल",
    ],
  },
  {
    id: "R5",
    number: 5,
    nameEn: "Far-Western Development Region",
    nameNe: "सुदूर-पश्चिमाञ्चल विकास क्षेत्र",
    capital: "Dipayal Silgadhi",
    capitalNe: "दिपायल सिलगढी",
    slug: "far-western",
    aliases: [
      "Far-Western",
      "Far Western",
      "Far-West",
      "Sudur-Paschimanchal",
      "Sudurpaschimanchal",
      "सुदूर-पश्चिमाञ्चल",
    ],
  },
];
