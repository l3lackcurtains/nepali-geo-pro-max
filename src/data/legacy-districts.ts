/**
 * The 75 legacy districts of Nepal (pre-2017 federal restructuring).
 *
 * Two of the legacy districts were split when the new constitution took
 * effect:
 *  - **Nawalparasi** → **Nawalpur** (now in Gandaki / P4) + **Parasi** /
 *    Nawalparasi-West (now in Lumbini / P5).
 *  - **Rukum** → **Eastern Rukum** (in Lumbini / P5) + **Western Rukum**
 *    (in Karnali / P6).
 *
 * Net: 75 legacy → 73 unchanged + 2 splits = 77 current districts. ✓
 *
 * IDs are LD01..LD75 in zone order (Mechi → Koshi → … → Mahakali).
 *
 * `currentDistrictIds` cross-references each legacy district to its modern
 * equivalents — useful for migrating archived data.
 */

import type { LegacyDistrict } from "../types.js";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w]+/g, "-");
}

interface Seed {
  readonly nameEn: string;
  readonly nameNe: string;
  readonly zoneId: import("../types.js").ZoneId;
  readonly currentDistrictIds: readonly import("../types.js").DistrictId[];
  readonly aliases?: readonly string[];
}

const SEED: readonly Seed[] = [
  // Mechi (Z01)
  { nameEn: "Jhapa",        nameNe: "झापा",       zoneId: "Z01",     currentDistrictIds: ["P1.D04"] },
  { nameEn: "Ilam",         nameNe: "इलाम",        zoneId: "Z01",          currentDistrictIds: ["P1.D03"] },
  { nameEn: "Panchthar",    nameNe: "पाँचथर",     zoneId: "Z01",        currentDistrictIds: ["P1.D08"] },
  { nameEn: "Taplejung",    nameNe: "ताप्लेजुङ",   zoneId: "Z01",     currentDistrictIds: ["P1.D12"] },

  // Koshi (Z02)
  { nameEn: "Morang",       nameNe: "मोरङ",        zoneId: "Z02",    currentDistrictIds: ["P1.D06"] },
  { nameEn: "Sunsari",      nameNe: "सुनसरी",      zoneId: "Z02",       currentDistrictIds: ["P1.D11"] },
  { nameEn: "Dhankuta",     nameNe: "धनकुटा",      zoneId: "Z02",      currentDistrictIds: ["P1.D02"] },
  { nameEn: "Terhathum",    nameNe: "तेह्रथुम",    zoneId: "Z02",     currentDistrictIds: ["P1.D13"], aliases: ["Tehrathum"] },
  { nameEn: "Sankhuwasabha",nameNe: "संखुवासभा",  zoneId: "Z02",     currentDistrictIds: ["P1.D09"] },
  { nameEn: "Bhojpur",      nameNe: "भोजपुर",     zoneId: "Z02",       currentDistrictIds: ["P1.D01"] },

  // Sagarmatha (Z03)
  { nameEn: "Saptari",      nameNe: "सप्तरी",      zoneId: "Z03",      currentDistrictIds: ["P2.D06"] },
  { nameEn: "Siraha",       nameNe: "सिराहा",      zoneId: "Z03",        currentDistrictIds: ["P2.D08"] },
  { nameEn: "Udayapur",     nameNe: "उदयपुर",      zoneId: "Z03",       currentDistrictIds: ["P1.D14"] },
  { nameEn: "Khotang",      nameNe: "खोटाङ",       zoneId: "Z03",        currentDistrictIds: ["P1.D05"] },
  { nameEn: "Okhaldhunga",  nameNe: "ओखलढुङ्गा",  zoneId: "Z03",   currentDistrictIds: ["P1.D07"] },
  { nameEn: "Solukhumbu",   nameNe: "सोलुखुम्बु",  zoneId: "Z03",       currentDistrictIds: ["P1.D10"] },

  // Janakpur (Z04)
  { nameEn: "Dhanusha",     nameNe: "धनुषा",       zoneId: "Z04",      currentDistrictIds: ["P2.D02"] },
  { nameEn: "Mahottari",    nameNe: "महोत्तरी",    zoneId: "Z04",     currentDistrictIds: ["P2.D03"] },
  { nameEn: "Sarlahi",      nameNe: "सर्लाही",      zoneId: "Z04",     currentDistrictIds: ["P2.D07"] },
  { nameEn: "Ramechhap",    nameNe: "रामेछाप",     zoneId: "Z04",      currentDistrictIds: ["P3.D10"] },
  { nameEn: "Dolakha",      nameNe: "दोलखा",       zoneId: "Z04",      currentDistrictIds: ["P3.D04"] },
  { nameEn: "Sindhuli",     nameNe: "सिन्धुली",    zoneId: "Z04",  currentDistrictIds: ["P3.D12"] },

  // Bagmati (Z05)
  { nameEn: "Kathmandu",    nameNe: "काठमाडौँ",   zoneId: "Z05",     currentDistrictIds: ["P3.D05"], aliases: ["KTM"] },
  { nameEn: "Lalitpur",     nameNe: "ललितपुर",     zoneId: "Z05",      currentDistrictIds: ["P3.D07"], aliases: ["Patan"] },
  { nameEn: "Bhaktapur",    nameNe: "भक्तपुर",     zoneId: "Z05",     currentDistrictIds: ["P3.D01"] },
  { nameEn: "Kavrepalanchok",nameNe: "काभ्रेपलाञ्चोक",zoneId: "Z05",currentDistrictIds: ["P3.D06"], aliases: ["Kavre", "Kabhre"] },
  { nameEn: "Sindhupalchok",nameNe: "सिन्धुपाल्चोक",zoneId: "Z05",currentDistrictIds: ["P3.D13"] },
  { nameEn: "Nuwakot",      nameNe: "नुवाकोट",     zoneId: "Z05",         currentDistrictIds: ["P3.D09"] },
  { nameEn: "Rasuwa",       nameNe: "रसुवा",        zoneId: "Z05",       currentDistrictIds: ["P3.D11"] },
  { nameEn: "Dhading",      nameNe: "धादिङ",       zoneId: "Z05",  currentDistrictIds: ["P3.D03"] },

  // Narayani (Z06)
  { nameEn: "Bara",         nameNe: "बारा",         zoneId: "Z06",       currentDistrictIds: ["P2.D01"] },
  { nameEn: "Parsa",        nameNe: "पर्सा",        zoneId: "Z06",       currentDistrictIds: ["P2.D04"] },
  { nameEn: "Rautahat",     nameNe: "रौतहट",        zoneId: "Z06",          currentDistrictIds: ["P2.D05"] },
  { nameEn: "Chitwan",      nameNe: "चितवन",       zoneId: "Z06",     currentDistrictIds: ["P3.D02"] },
  { nameEn: "Makwanpur",    nameNe: "मकवानपुर",    zoneId: "Z06",       currentDistrictIds: ["P3.D08"] },

  // Gandaki (Z07)
  { nameEn: "Gorkha",       nameNe: "गोरखा",       zoneId: "Z07",        currentDistrictIds: ["P4.D02"] },
  { nameEn: "Lamjung",      nameNe: "लमजुङ",       zoneId: "Z07",     currentDistrictIds: ["P4.D04"] },
  { nameEn: "Tanahun",      nameNe: "तनहुँ",        zoneId: "Z07",       currentDistrictIds: ["P4.D11"] },
  { nameEn: "Syangja",      nameNe: "स्याङ्जा",     zoneId: "Z07",       currentDistrictIds: ["P4.D10"] },
  { nameEn: "Kaski",        nameNe: "कास्की",       zoneId: "Z07",       currentDistrictIds: ["P4.D03"] },
  { nameEn: "Manang",       nameNe: "मनाङ",         zoneId: "Z07",         currentDistrictIds: ["P4.D05"] },

  // Lumbini (Z08)
  {
    nameEn: "Nawalparasi", nameNe: "नवलपरासी", zoneId: "Z08", 
    currentDistrictIds: ["P4.D08", "P5.D09"],
    aliases: ["Nawalparasi (legacy)", "Nawalparasi-pre-2017"],
  },
  { nameEn: "Rupandehi",    nameNe: "रुपन्देही",    zoneId: "Z08", currentDistrictIds: ["P5.D12"], aliases: ["Bhairahawa"] },
  { nameEn: "Kapilvastu",   nameNe: "कपिलवस्तु",   zoneId: "Z08",     currentDistrictIds: ["P5.D07"] },
  { nameEn: "Palpa",        nameNe: "पाल्पा",       zoneId: "Z08",        currentDistrictIds: ["P5.D08"] },
  { nameEn: "Arghakhanchi", nameNe: "अर्घाखाँची",  zoneId: "Z08",  currentDistrictIds: ["P5.D01"] },
  { nameEn: "Gulmi",        nameNe: "गुल्मी",       zoneId: "Z08",       currentDistrictIds: ["P5.D06"] },

  // Dhaulagiri (Z09)
  { nameEn: "Mustang",      nameNe: "मुस्ताङ",     zoneId: "Z09",        currentDistrictIds: ["P4.D06"] },
  { nameEn: "Myagdi",       nameNe: "म्याग्दी",     zoneId: "Z09",          currentDistrictIds: ["P4.D07"] },
  { nameEn: "Parbat",       nameNe: "पर्बत",        zoneId: "Z09",        currentDistrictIds: ["P4.D09"] },
  { nameEn: "Baglung",      nameNe: "बाग्लुङ",     zoneId: "Z09",       currentDistrictIds: ["P4.D01"] },

  // Rapti (Z10)
  { nameEn: "Pyuthan",      nameNe: "प्युठान",     zoneId: "Z10",       currentDistrictIds: ["P5.D10"] },
  { nameEn: "Salyan",       nameNe: "सल्यान",       zoneId: "Z10",        currentDistrictIds: ["P6.D08"] },
  { nameEn: "Rolpa",        nameNe: "रोल्पा",       zoneId: "Z10",        currentDistrictIds: ["P5.D11"] },
  {
    nameEn: "Rukum", nameNe: "रुकुम", zoneId: "Z10", 
    currentDistrictIds: ["P5.D05", "P6.D10"],
    aliases: ["Rukum (legacy)", "Rukum-pre-2017"],
  },
  { nameEn: "Dang",         nameNe: "दाङ",          zoneId: "Z10",       currentDistrictIds: ["P5.D04"], aliases: ["Dang Deukhuri"] },

  // Bheri (Z11)
  { nameEn: "Banke",        nameNe: "बाँके",        zoneId: "Z11",     currentDistrictIds: ["P5.D02"] },
  { nameEn: "Bardiya",      nameNe: "बर्दिया",     zoneId: "Z11",      currentDistrictIds: ["P5.D03"] },
  { nameEn: "Surkhet",      nameNe: "सुर्खेत",     zoneId: "Z11", currentDistrictIds: ["P6.D09"] },
  { nameEn: "Dailekh",      nameNe: "दैलेख",       zoneId: "Z11",       currentDistrictIds: ["P6.D01"] },
  { nameEn: "Jajarkot",     nameNe: "जाजरकोट",     zoneId: "Z11",      currentDistrictIds: ["P6.D04"] },

  // Karnali (Z12)
  { nameEn: "Jumla",        nameNe: "जुम्ला",       zoneId: "Z12",         currentDistrictIds: ["P6.D05"] },
  { nameEn: "Kalikot",      nameNe: "कालिकोट",     zoneId: "Z12",         currentDistrictIds: ["P6.D06"] },
  { nameEn: "Mugu",         nameNe: "मुगु",          zoneId: "Z12",      currentDistrictIds: ["P6.D07"] },
  { nameEn: "Humla",        nameNe: "हुम्ला",       zoneId: "Z12",       currentDistrictIds: ["P6.D03"] },
  { nameEn: "Dolpa",        nameNe: "डोल्पा",       zoneId: "Z12",         currentDistrictIds: ["P6.D02"] },

  // Seti (Z13)
  { nameEn: "Kailali",      nameNe: "कैलाली",       zoneId: "Z13",     currentDistrictIds: ["P7.D08"] },
  { nameEn: "Achham",       nameNe: "अछाम",         zoneId: "Z13",     currentDistrictIds: ["P7.D01"] },
  { nameEn: "Doti",         nameNe: "डोटी",          zoneId: "Z13", currentDistrictIds: ["P7.D07"] },
  { nameEn: "Bajura",       nameNe: "बाजुरा",       zoneId: "Z13",       currentDistrictIds: ["P7.D04"] },
  { nameEn: "Bajhang",      nameNe: "बझाङ",          zoneId: "Z13",      currentDistrictIds: ["P7.D03"] },

  // Mahakali (Z14)
  { nameEn: "Kanchanpur",   nameNe: "कञ्चनपुर",    zoneId: "Z14",     currentDistrictIds: ["P7.D09"], aliases: ["Mahendranagar"] },
  { nameEn: "Dadeldhura",   nameNe: "डडेल्धुरा",   zoneId: "Z14",    currentDistrictIds: ["P7.D05"] },
  { nameEn: "Baitadi",      nameNe: "बैतडी",        zoneId: "Z14",       currentDistrictIds: ["P7.D02"] },
  { nameEn: "Darchula",     nameNe: "दार्चुला",    zoneId: "Z14",      currentDistrictIds: ["P7.D06"] },
];

export const LEGACY_DISTRICTS: readonly LegacyDistrict[] = SEED.map((seed, idx) => {
  const id = `LD${String(idx + 1).padStart(2, "0")}` as import("../types.js").LegacyDistrictId;
  return {
    id,
    nameEn: seed.nameEn,
    nameNe: seed.nameNe,
    zoneId: seed.zoneId,
    currentDistrictIds: seed.currentDistrictIds,
    slug: slugify(seed.nameEn),
    aliases: seed.aliases ?? [],
  };
});

/** Total count = 75. */
export const TOTAL_LEGACY_DISTRICTS = 75;
