/**
 * The 5 development regions of Nepal (विकास क्षेत्र), abolished in 2015.
 *
 * Shipped here only to support cross-walking legacy datasets to the modern
 * federal hierarchy. Order is east-to-west.
 */

import type { Region } from "../types.js";

export const REGIONS: readonly Region[] = [
  {
    id: "R1",
    number: 1,
    nameEn: "Eastern Development Region",
    nameNe: "पूर्वाञ्चल विकास क्षेत्र",
    slug: "eastern",
    aliases: ["Eastern", "Eastern Region", "Purbanchal", "पूर्वाञ्चल", "Purwanchal"],
  },
  {
    id: "R2",
    number: 2,
    nameEn: "Central Development Region",
    nameNe: "मध्यमाञ्चल विकास क्षेत्र",
    slug: "central",
    aliases: ["Central", "Central Region", "Madhyamanchal", "मध्यमाञ्चल"],
  },
  {
    id: "R3",
    number: 3,
    nameEn: "Western Development Region",
    nameNe: "पश्चिमाञ्चल विकास क्षेत्र",
    slug: "western",
    aliases: ["Western", "Western Region", "Paschimanchal", "पश्चिमाञ्चल"],
  },
  {
    id: "R4",
    number: 4,
    nameEn: "Mid-Western Development Region",
    nameNe: "मध्य-पश्चिमाञ्चल विकास क्षेत्र",
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
