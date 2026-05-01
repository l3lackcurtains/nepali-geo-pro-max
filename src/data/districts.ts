/**
 * 77 districts of Nepal (post-2017 federal restructuring).
 *
 * Distribution: Koshi 14, Madhesh 8, Bagmati 13, Gandaki 11, Lumbini 12,
 * Karnali 10, Sudurpashchim 9. Total = 77. ✓
 *
 * Distribution constants are exposed as `DISTRICTS_BY_PROVINCE_COUNT` for
 * test invariants.
 *
 * Sources: Wikipedia "List of districts of Nepal", MoFAGA, ECN.
 */

import type { District, DistrictId, ProvinceId } from "../types.js";

interface DistrictSeed {
  readonly nameEn: string;
  readonly nameNe: string;
  readonly headquarters: string;
  readonly headquartersNe?: string;
  readonly aliases?: readonly string[];
}

interface ProvinceDistricts {
  readonly provinceId: ProvinceId;
  readonly districts: readonly DistrictSeed[];
}

const SEED: readonly ProvinceDistricts[] = [
  {
    provinceId: "P1",
    districts: [
      { nameEn: "Bhojpur", nameNe: "भोजपुर", headquarters: "Bhojpur" },
      { nameEn: "Dhankuta", nameNe: "धनकुटा", headquarters: "Dhankuta" },
      { nameEn: "Ilam", nameNe: "इलाम", headquarters: "Ilam" },
      { nameEn: "Jhapa", nameNe: "झापा", headquarters: "Bhadrapur" },
      { nameEn: "Khotang", nameNe: "खोटाङ", headquarters: "Diktel" },
      { nameEn: "Morang", nameNe: "मोरङ", headquarters: "Biratnagar" },
      { nameEn: "Okhaldhunga", nameNe: "ओखलढुङ्गा", headquarters: "Okhaldhunga" },
      { nameEn: "Panchthar", nameNe: "पाँचथर", headquarters: "Phidim" },
      { nameEn: "Sankhuwasabha", nameNe: "संखुवासभा", headquarters: "Khandbari" },
      { nameEn: "Solukhumbu", nameNe: "सोलुखुम्बु", headquarters: "Salleri" },
      { nameEn: "Sunsari", nameNe: "सुनसरी", headquarters: "Inaruwa" },
      { nameEn: "Taplejung", nameNe: "ताप्लेजुङ", headquarters: "Phungling" },
      { nameEn: "Terhathum", nameNe: "तेह्रथुम", headquarters: "Myanglung", aliases: ["Tehrathum"] },
      { nameEn: "Udayapur", nameNe: "उदयपुर", headquarters: "Triyuga" },
    ],
  },
  {
    provinceId: "P2",
    districts: [
      { nameEn: "Bara", nameNe: "बारा", headquarters: "Kalaiya" },
      { nameEn: "Dhanusha", nameNe: "धनुषा", headquarters: "Janakpur" },
      { nameEn: "Mahottari", nameNe: "महोत्तरी", headquarters: "Jaleshwar" },
      { nameEn: "Parsa", nameNe: "पर्सा", headquarters: "Birgunj" },
      { nameEn: "Rautahat", nameNe: "रौतहट", headquarters: "Gaur" },
      { nameEn: "Saptari", nameNe: "सप्तरी", headquarters: "Rajbiraj" },
      { nameEn: "Sarlahi", nameNe: "सर्लाही", headquarters: "Malangwa" },
      { nameEn: "Siraha", nameNe: "सिराहा", headquarters: "Siraha" },
    ],
  },
  {
    provinceId: "P3",
    districts: [
      { nameEn: "Bhaktapur", nameNe: "भक्तपुर", headquarters: "Bhaktapur" },
      { nameEn: "Chitwan", nameNe: "चितवन", headquarters: "Bharatpur" },
      { nameEn: "Dhading", nameNe: "धादिङ", headquarters: "Dhading Besi" },
      { nameEn: "Dolakha", nameNe: "दोलखा", headquarters: "Charikot" },
      { nameEn: "Kathmandu", nameNe: "काठमाडौँ", headquarters: "Kathmandu", aliases: ["KTM"] },
      { nameEn: "Kavrepalanchok", nameNe: "काभ्रेपलाञ्चोक", headquarters: "Dhulikhel", aliases: ["Kavre", "Kabhre"] },
      { nameEn: "Lalitpur", nameNe: "ललितपुर", headquarters: "Lalitpur", aliases: ["Patan"] },
      { nameEn: "Makwanpur", nameNe: "मकवानपुर", headquarters: "Hetauda" },
      { nameEn: "Nuwakot", nameNe: "नुवाकोट", headquarters: "Bidur" },
      { nameEn: "Ramechhap", nameNe: "रामेछाप", headquarters: "Manthali" },
      { nameEn: "Rasuwa", nameNe: "रसुवा", headquarters: "Dhunche" },
      { nameEn: "Sindhuli", nameNe: "सिन्धुली", headquarters: "Sindhulimadi" },
      { nameEn: "Sindhupalchok", nameNe: "सिन्धुपाल्चोक", headquarters: "Chautara" },
    ],
  },
  {
    provinceId: "P4",
    districts: [
      { nameEn: "Baglung", nameNe: "बाग्लुङ", headquarters: "Baglung" },
      { nameEn: "Gorkha", nameNe: "गोरखा", headquarters: "Gorkha" },
      { nameEn: "Kaski", nameNe: "कास्की", headquarters: "Pokhara" },
      { nameEn: "Lamjung", nameNe: "लमजुङ", headquarters: "Besisahar" },
      { nameEn: "Manang", nameNe: "मनाङ", headquarters: "Chame" },
      { nameEn: "Mustang", nameNe: "मुस्ताङ", headquarters: "Jomsom" },
      { nameEn: "Myagdi", nameNe: "म्याग्दी", headquarters: "Beni" },
      { nameEn: "Nawalpur", nameNe: "नवलपुर", headquarters: "Kawasoti", aliases: ["Nawalparasi East", "Nawalparasi (Bardaghat-Susta East)"] },
      { nameEn: "Parbat", nameNe: "पर्बत", headquarters: "Kushma" },
      { nameEn: "Syangja", nameNe: "स्याङ्जा", headquarters: "Syangja" },
      { nameEn: "Tanahun", nameNe: "तनहुँ", headquarters: "Damauli" },
    ],
  },
  {
    provinceId: "P5",
    districts: [
      { nameEn: "Arghakhanchi", nameNe: "अर्घाखाँची", headquarters: "Sandhikharka" },
      { nameEn: "Banke", nameNe: "बाँके", headquarters: "Nepalgunj" },
      { nameEn: "Bardiya", nameNe: "बर्दिया", headquarters: "Gulariya" },
      { nameEn: "Dang", nameNe: "दाङ", headquarters: "Ghorahi" },
      { nameEn: "Eastern Rukum", nameNe: "पूर्वी रुकुम", headquarters: "Rukumkot", aliases: ["Rukum East", "Rukum Purba"] },
      { nameEn: "Gulmi", nameNe: "गुल्मी", headquarters: "Tamghas" },
      { nameEn: "Kapilvastu", nameNe: "कपिलवस्तु", headquarters: "Taulihawa" },
      { nameEn: "Palpa", nameNe: "पाल्पा", headquarters: "Tansen" },
      { nameEn: "Parasi", nameNe: "परासी", headquarters: "Ramgram", aliases: ["Nawalparasi West", "Nawalparasi (Bardaghat-Susta West)"] },
      { nameEn: "Pyuthan", nameNe: "प्युठान", headquarters: "Pyuthan" },
      { nameEn: "Rolpa", nameNe: "रोल्पा", headquarters: "Liwang" },
      { nameEn: "Rupandehi", nameNe: "रुपन्देही", headquarters: "Siddharthanagar", aliases: ["Bhairahawa"] },
    ],
  },
  {
    provinceId: "P6",
    districts: [
      { nameEn: "Dailekh", nameNe: "दैलेख", headquarters: "Narayan" },
      { nameEn: "Dolpa", nameNe: "डोल्पा", headquarters: "Dunai" },
      { nameEn: "Humla", nameNe: "हुम्ला", headquarters: "Simikot" },
      { nameEn: "Jajarkot", nameNe: "जाजरकोट", headquarters: "Khalanga" },
      { nameEn: "Jumla", nameNe: "जुम्ला", headquarters: "Jumla" },
      { nameEn: "Kalikot", nameNe: "कालिकोट", headquarters: "Manma" },
      { nameEn: "Mugu", nameNe: "मुगु", headquarters: "Gamgadhi" },
      { nameEn: "Salyan", nameNe: "सल्यान", headquarters: "Salyan" },
      { nameEn: "Surkhet", nameNe: "सुर्खेत", headquarters: "Birendranagar" },
      { nameEn: "Western Rukum", nameNe: "पश्चिमी रुकुम", headquarters: "Musikot", aliases: ["Rukum West", "Rukum Pashchim"] },
    ],
  },
  {
    provinceId: "P7",
    districts: [
      { nameEn: "Achham", nameNe: "अछाम", headquarters: "Mangalsen" },
      { nameEn: "Baitadi", nameNe: "बैतडी", headquarters: "Baitadi" },
      { nameEn: "Bajhang", nameNe: "बझाङ", headquarters: "Chainpur" },
      { nameEn: "Bajura", nameNe: "बाजुरा", headquarters: "Martadi" },
      { nameEn: "Dadeldhura", nameNe: "डडेल्धुरा", headquarters: "Dadeldhura" },
      { nameEn: "Darchula", nameNe: "दार्चुला", headquarters: "Khalanga" },
      { nameEn: "Doti", nameNe: "डोटी", headquarters: "Dipayal Silgadhi" },
      { nameEn: "Kailali", nameNe: "कैलाली", headquarters: "Dhangadhi" },
      { nameEn: "Kanchanpur", nameNe: "कञ्चनपुर", headquarters: "Bhimdatta", aliases: ["Mahendranagar"] },
    ],
  },
];

/** Expected district count per province (used in tests). */
export const DISTRICTS_BY_PROVINCE_COUNT: Readonly<Record<ProvinceId, number>> = {
  P1: 14, P2: 8, P3: 13, P4: 11, P5: 12, P6: 10, P7: 9,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const DISTRICTS: readonly District[] = SEED.flatMap((bucket) =>
  bucket.districts.map((d, idx): District => {
    const seq = String(idx + 1).padStart(2, "0");
    const id = `${bucket.provinceId}.D${seq}` as DistrictId;
    return {
      id,
      nameEn: d.nameEn,
      nameNe: d.nameNe,
      provinceId: bucket.provinceId,
      headquarters: d.headquarters,
      ...(d.headquartersNe !== undefined && { headquartersNe: d.headquartersNe }),
      slug: slugify(d.nameEn),
      aliases: d.aliases ?? [],
    };
  }),
);
