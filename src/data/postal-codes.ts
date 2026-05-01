/**
 * Nepal Post postal-code mapping for the 753 local-level units (palikas).
 *
 * Sources:
 *   - Wikipedia, "Postal codes in Nepal"
 *     https://en.wikipedia.org/wiki/Postal_codes_in_Nepal
 *   - Nepal General Post Office (कोड स्थानीय तह listing, legacy 1991 system)
 *     https://gpo.gov.np/pages/postal-code-1259614658/
 *   - Wikipedia, "List of districts of Nepal" (district HQ towns)
 *     https://en.wikipedia.org/wiki/List_of_districts_of_Nepal
 *
 * Coverage: 193 / 753 palikas have a verified primary postcode (~25.6%).
 *
 * IMPORTANT — choice of code system:
 * Nepal Post operates two parallel postal-code systems:
 *   1. The legacy 1991 5-digit codes (e.g. Kathmandu = 44600), which are still
 *      the codes printed on mail and used by international carriers.
 *   2. A new 2025 5-digit federal-aligned palika system published by GPO
 *      (e.g. Kathmandu Metropolitan = 30608) that has not yet superseded the
 *      legacy codes in everyday postal operations.
 *
 * This file uses the LEGACY 1991 codes to stay consistent with the 17 anchor
 * postcodes already shipped on metro/sub-metro `LocalUnit` entries (e.g.
 * Kathmandu Metropolitan City: 44600, Pokhara Metropolitan City: 33700).
 *
 * Postcode structure (legacy 1991): first 2 digits = district zone, last 3 =
 * post-office branch. The xx000 / xx100 / xxN00 codes are the district HQ /
 * GPO branches; smaller numbers in between identify branch post offices.
 * A palika may host multiple branch postcodes; this map records the
 * **primary** code per palika (the GPO branch nearest to its admin centre).
 *
 * What is mapped:
 *   - All 77 district HQ palikas (the palika containing the district HQ town).
 *   - Palikas whose name unambiguously matches a Wikipedia/GPO post-office name
 *     in the same district (e.g. "Madi Municipality" in Chitwan -> 44214).
 *   - The 17 metropolitan / sub-metropolitan anchors already shipped in
 *     `local-units.ts` (re-asserted here so reverse lookup works).
 *
 * What is NOT mapped (~74% of palikas):
 *   Most rural municipalities and many municipalities were formed by merging
 *   former VDCs in 2017. Their post-office branch (if any) is still listed under
 *   the merged VDC name (e.g. PO "Pala" in Baglung) which is no longer the
 *   palika name. Mapping these back to a current palika requires palika-level
 *   ward-to-VDC research that has not been done. We have intentionally omitted
 *   such entries rather than guess.
 *
 * Key format: lowercase, full original English name. Where the name collides
 * across districts (e.g. "Madi Municipality" exists in both Sankhuwasabha and
 * Chitwan), the district name is appended in parentheses for disambiguation.
 *
 * Last verified: 2026-04-30
 */

/**
 * Lookup table — palika English name (lowercase, normalized) -> primary postcode.
 *
 * For palika names that occur in multiple districts, the key is suffixed with
 * the lowercase district name in parentheses. Example:
 *   - "madi municipality (chitwan)" -> "44214"
 *   - "madi municipality (sankhuwasabha)" -> "56909"
 */
export const POSTAL_CODES: Readonly<Record<string, string>> = {
  // ===== Koshi Province =====
  // -- Bhojpur district --
  "bhojpur municipality": "57000",
  // -- Dhankuta district --
  "dhankuta municipality": "56800",
  "pakhribas municipality": "56809",
  // -- Ilam district --
  "ilam municipality": "57300",
  // -- Jhapa district --
  "bhadrapur municipality": "57200",
  "birtamod municipality": "57204",
  "gaurigunj rural municipality": "57215",
  "gauradaha municipality": "57216",
  "damak municipality": "57217",
  // -- Khotang district --
  "diktel rupakot majhuwagadhi municipality": "56200",
  "aiselukharka rural municipality": "56202",
  "halesi tuwachung municipality": "56206",
  // -- Morang district --
  "biratnagar metropolitan city": "56600",
  "rangeli municipality": "56602",
  "urlabari municipality": "56604",
  "letang municipality": "56609",
  "kerabari rural municipality": "56610",
  // -- Okhaldhunga district --
  "siddhicharan municipality": "56100",
  // -- Panchthar district --
  "phidim municipality": "57400",
  // -- Sankhuwasabha district --
  "khandbari municipality": "56900",
  "madi municipality (sankhuwasabha)": "56909",
  "chainpur municipality": "56913",
  // -- Solukhumbu district --
  "solu dudhkunda municipality": "56000",
  "khumbu pasanglhamu rural municipality": "56002",
  "sotang rural municipality": "56004",
  "necha salyan rural municipality": "56007",
  // -- Sunsari district --
  "dharan sub-metropolitan city": "56700",
  "itahari sub-metropolitan city": "56700",
  "inaruwa municipality": "56700",
  "duhabi municipality": "56707",
  "dewangunj rural municipality": "56712",
  // -- Taplejung district --
  "phungling municipality": "57500",
  // -- Terhathum district --
  "myanglung municipality": "57100",
  // -- Udayapur district --
  "triyuga municipality": "56300",
  "katari municipality": "56310",

  // ===== Madhesh Province =====
  // -- Bara district --
  "kalaiya sub-metropolitan city": "44400",
  "nijgadh municipality": "44401",
  "simaraungadh municipality": "44403",
  "jeetpur simara sub-metropolitan city": "44412",
  // -- Dhanusha district --
  "janakpurdham sub-metropolitan city": "45600",
  "dhanushadham municipality": "45608",
  // -- Mahottari district --
  "jaleshor municipality": "45700",
  "bardibas municipality": "45701",
  "bhangaha municipality": "45702",
  "loharpatti municipality": "45703",
  "pipara rural municipality": "45704",
  "matihani municipality": "45705",
  "ramgopalpur municipality": "45707",
  "balawa municipality": "45708",
  "gaushala municipality": "45711",
  "samsi rural municipality": "45713",
  "manara shiswa municipality": "45714",
  // -- Parsa district --
  "birgunj metropolitan city": "44300",
  "bindabasini rural municipality": "44304",
  "paterwa sugauli rural municipality": "44311",
  "thori rural municipality": "44315",
  // -- Rautahat district --
  "gaur municipality": "44500",
  "katahariya municipality": "44512",
  // -- Saptari district --
  "rajbiraj municipality": "56400",
  "chhinnamasta rural municipality": "56408",
  "bishnupur rural municipality (saptari)": "56409",
  "rupani rural municipality": "56411",
  "bodebarsain municipality": "56415",
  // -- Sarlahi district --
  "malangawa municipality": "45800",
  "lalbandi municipality": "45801",
  "haripurwa municipality": "45803",
  "hariwan municipality": "45804",
  "haripur municipality": "45805",
  "brahampuri rural municipality": "45806",
  "kaudena rural municipality": "45809",
  // -- Siraha district --
  "siraha municipality": "56500",
  "lahan municipality": "56502",
  "bariyarpatti rural municipality": "56506",
  "golbazar municipality": "56508",
  "sukhipur municipality": "56509",
  "bishnupur rural municipality (siraha)": "56511",
  "mirchaiya municipality": "56515",
  "kalyanpur municipality": "56517",

  // ===== Bagmati Province =====
  // -- Bhaktapur district --
  "bhaktapur municipality": "44800",
  "madhyapur thimi municipality": "44811",
  // -- Chitwan district --
  "bharatpur metropolitan city": "44200",
  "madi municipality (chitwan)": "44214",
  // -- Dhading district --
  "nilkantha municipality": "45100",
  "gajuri rural municipality": "45112",
  // -- Dolakha district --
  "bhimeswor municipality": "45500",
  "jiri municipality": "45503",
  "melung rural municipality": "45506",
  // -- Kathmandu district --
  "kathmandu metropolitan city": "44600",
  "kirtipur municipality": "44618",
  // -- Kavrepalanchok district --
  "dhulikhel municipality": "45200",
  "panauti municipality": "45209",
  "banepa municipality": "45210",
  "panchkhal municipality": "45212",
  // -- Lalitpur district --
  "lalitpur metropolitan city": "44700",
  "godawari municipality (lalitpur)": "44709",
  // -- Makwanpur district --
  "hetauda sub-metropolitan city": "44100",
  "manahari rural municipality": "44106",
  "bhimphedi rural municipality": "44112",
  // -- Nuwakot district --
  "bidur municipality": "44900",
  // -- Ramechhap district --
  "manthali municipality": "45400",
  "doramba rural municipality": "45409",
  // -- Rasuwa district --
  "uttargaya rural municipality": "45000",
  // -- Sindhuli district --
  "kamalamai municipality": "45900",
  "dudhauli municipality": "45903",
  // -- Sindhupalchok district --
  "chautara sangachowkgadi municipality": "45300",
  "bahrabise municipality": "45302",
  "melamchi municipality": "45310",
  "balephi rural municipality": "45314",

  // ===== Gandaki Province =====
  // -- Baglung district --
  "baglung municipality": "33300",
  "galkot municipality": "33308",
  // -- Gorkha district --
  "gorkha municipality": "34000",
  "aarughat rural municipality": "34011",
  // -- Kaski district --
  "pokhara metropolitan city": "33700",
  // -- Lamjung district --
  "besisahar municipality": "33600",
  // -- Manang district --
  "chame rural municipality": "33500",
  // -- Mustang district --
  "gharpajhong rural municipality": "33100",
  // -- Myagdi district --
  "beni municipality": "33200",
  // -- Nawalpur district --
  "kawasoti municipality": "33000",
  "bulingtar rural municipality": "33002",
  "gaindakot municipality": "33003",
  // -- Parbat district --
  "kushma municipality": "33400",
  // -- Syangja district --
  "putalibazar municipality": "33800",
  "chapakot municipality": "33814",
  "galyang municipality": "33815",
  // -- Tanahun district --
  "byas municipality": "33900",
  "bandipur rural municipality": "33904",
  "bhimad municipality": "33910",

  // ===== Lumbini Province =====
  // -- Arghakhanchi district --
  "sandhikharka municipality": "32700",
  // -- Banke district --
  "nepalgunj sub-metropolitan city": "21900",
  "kohalpur municipality": "21904",
  "khajura rural municipality": "21913",
  // -- Bardiya district --
  "gulariya municipality": "21800",
  "rajapur municipality": "21811",
  // -- Dang district --
  "tulsipur sub-metropolitan city": "22400",
  "shantinagar rural municipality": "22411",
  "ghorahi sub-metropolitan city": "22414",
  "lamahi municipality": "22414",
  // -- Eastern Rukum district --
  "putha uttarganga rural municipality": "22000",
  // -- Gulmi district --
  "resunga municipality": "32600",
  "chandrakot rural municipality": "32603",
  "dhurkot rural municipality": "32611",
  // -- Kapilvastu district --
  "kapilvastu municipality": "32800",
  "maharajgunj municipality": "32812",
  "krishnanagar municipality": "32815",
  // -- Palpa district --
  "tansen municipality": "32500",
  "rampur municipality": "32502",
  // -- Parasi district --
  "ramgram municipality": "33000",
  // -- Pyuthan district --
  "pyuthan municipality": "22300",
  // -- Rolpa district --
  "rolpa municipality": "22100",
  "thawang rural municipality": "22106",
  // -- Rupandehi district --
  "siddharthanagar municipality": "32900",
  "butwal sub-metropolitan city": "32907",
  "lumbini sanskritik municipality": "32914",

  // ===== Karnali Province =====
  // -- Dailekh district --
  "narayan municipality": "21600",
  "naumule rural municipality": "21603",
  "dullu municipality": "21608",
  // -- Dolpa district --
  "thuli bheri municipality": "21400",
  // -- Humla district --
  "simkot rural municipality": "21000",
  "sarkegad rural municipality": "21005",
  // -- Jajarkot district --
  "bheri municipality": "21500",
  // -- Jumla district --
  "chandannath municipality": "21200",
  "tatopani rural municipality": "21204",
  // -- Kalikot district --
  "khandachakra municipality": "21300",
  // -- Mugu district --
  "chhayanath rara municipality": "21100",
  // -- Salyan district --
  "shaarda municipality": "22200",
  // -- Surkhet district --
  "birendranagar municipality": "21700",
  "bheriganga municipality": "21705",
  // -- Western Rukum district --
  "musikot municipality (western rukum)": "22000",
  "chaurjahari municipality": "22008",

  // ===== Sudurpashchim Province =====
  // -- Achham district --
  "mangalsen municipality": "10700",
  "chaurpati rural municipality": "10701",
  "mellekh rural municipality": "10704",
  "dhakari rural municipality": "10712",
  // -- Baitadi district --
  "dashrathchanda municipality": "10200",
  "patan municipality": "10202",
  "purchaudi municipality": "10213",
  // -- Bajhang district --
  "jayaprithvi municipality": "10500",
  "talkot rural municipality": "10501",
  "thalara rural municipality": "10509",
  "bungal municipality": "10510",
  // -- Bajura district --
  "badimalika municipality": "10600",
  // -- Dadeldhura district --
  "amargadhi municipality": "10300",
  // -- Darchula district --
  "mahakali municipality (darchula)": "10100",
  "malikarjun rural municipality": "10104",
  // -- Doti district --
  "dipayal silgadhi municipality": "10800",
  "jorayal rural municipality": "10806",
  // -- Kailali district --
  "dhangadhi sub-metropolitan city": "10900",
  "tikapur municipality": "10901",
  "lamkichuha municipality": "10904",
  "joshipur rural municipality": "10909",
  // -- Kanchanpur district --
  "bhimdatta municipality": "10400",
  "krishnapur municipality": "10401",
  "punarbas municipality": "10403",

};

/**
 * Multi-postcode entries: legacy 1991 branch postcodes per district where
 * Wikipedia / GPO documents multiple branch POs. These are *district-level*
 * branch lists, not strictly per-palika, because the legacy system was
 * organised by district + branch PO, not by palika. Useful for reverse
 * lookup or address validation across the whole district.
 */
export const POSTAL_CODE_BRANCHES: Readonly<Record<string, readonly string[]>> = {
  "kathmandu district": ["44600", "44601", "44602", "44603", "44604", "44605", "44606", "44608", "44609", "44610", "44611", "44613", "44614", "44615", "44616", "44617", "44618", "44619", "44620", "44621", "44622"],
  "lalitpur district": ["44700", "44703", "44705", "44707", "44708", "44709", "44710", "44711", "44712", "44713"],
  "bhaktapur district": ["44800", "44802", "44804", "44805", "44806", "44809", "44810", "44811", "44812"],
  "kaski district": ["33700", "33701", "33702", "33703", "33704", "33705", "33706", "33707", "33708", "33709", "33710", "33711", "33712", "33713"],
  "chitwan district": ["44200", "44202", "44203", "44204", "44205", "44206", "44207", "44208", "44209", "44210", "44211", "44212", "44213", "44214"],
  "parsa district": ["44300", "44301", "44303", "44304", "44305", "44306", "44307", "44308", "44309", "44310", "44311", "44312", "44313", "44314", "44315"],
  "dhanusha district": ["45600", "45601", "45602", "45603", "45604", "45605", "45606", "45607", "45608", "45610", "45611", "45612", "45616", "45617"],
  "makwanpur district": ["44100", "44101", "44102", "44103", "44104", "44106", "44107", "44108", "44110", "44111", "44112", "44113"],
  "sunsari district": ["56700", "56702", "56703", "56704", "56705", "56706", "56707", "56708", "56709", "56710", "56711", "56712", "56713", "56714", "56715", "56716", "56717"],
  "morang district": ["56600", "56601", "56602", "56603", "56604", "56605", "56606", "56607", "56608", "56609", "56610", "56611", "56612", "56613", "56614", "56615", "56616", "56617"],
  "banke district": ["21900", "21901", "21902", "21903", "21904", "21905", "21907", "21910", "21911", "21912", "21913", "21914"],
  "dang district": ["22400", "22402", "22403", "22404", "22405", "22406", "22407", "22408", "22409", "22410", "22411", "22412", "22413", "22414", "22415"],
  "rupandehi district": ["32900", "32901", "32902", "32903", "32904", "32905", "32907", "32908", "32909", "32910", "32911", "32912", "32913", "32914", "32915", "32916"],
  "kailali district": ["10900", "10901", "10902", "10903", "10904", "10905", "10906", "10907", "10908", "10909", "10910", "10911", "10912", "10914"],
  "bara district": ["44400", "44401", "44402", "44403", "44404", "44405", "44406", "44408", "44410", "44411", "44412", "44413", "44416", "44417"],
  "rautahat district": ["44500", "44502", "44503", "44504", "44506", "44508", "44509", "44510", "44511", "44512", "44513", "44515"],
  "sarlahi district": ["45800", "45801", "45802", "45803", "45804", "45805", "45806", "45809", "45810", "45811", "45813", "45814", "45815", "45816", "45817"],
  "mahottari district": ["45700", "45701", "45702", "45703", "45704", "45705", "45707", "45708", "45710", "45711", "45712", "45713", "45714"],
  "saptari district": ["56400", "56401", "56402", "56403", "56404", "56405", "56406", "56407", "56408", "56409", "56411", "56412", "56413", "56414", "56415", "56416", "56417", "56418"],
  "siraha district": ["56500", "56501", "56502", "56503", "56504", "56505", "56506", "56508", "56509", "56511", "56512", "56513", "56515", "56516", "56517"],
  "jhapa district": ["57200", "57201", "57202", "57203", "57204", "57205", "57206", "57207", "57208", "57209", "57210", "57212", "57213", "57214", "57215", "57216", "57217"],
};

/**
 * District-level postcode prefixes (legacy 1991: first 2 digits of every
 * 5-digit code in that district). Useful for fast district-bucket lookup.
 */
export const DISTRICT_POSTCODE_PREFIXES: Readonly<Record<string, string>> = {
  // Koshi Province
  "Bhojpur": "57",
  "Dhankuta": "56",
  "Ilam": "57",
  "Jhapa": "57",
  "Khotang": "56",
  "Morang": "56",
  "Okhaldhunga": "56",
  "Panchthar": "57",
  "Sankhuwasabha": "56",
  "Solukhumbu": "56",
  "Sunsari": "56",
  "Taplejung": "57",
  "Terhathum": "57",
  "Udayapur": "56",

  // Madhesh Province
  "Bara": "44",
  "Dhanusha": "45",
  "Mahottari": "45",
  "Parsa": "44",
  "Rautahat": "44",
  "Saptari": "56",
  "Sarlahi": "45",
  "Siraha": "56",

  // Bagmati Province
  "Bhaktapur": "44",
  "Chitwan": "44",
  "Dhading": "45",
  "Dolakha": "45",
  "Kathmandu": "44",
  "Kavrepalanchok": "45",
  "Lalitpur": "44",
  "Makwanpur": "44",
  "Nuwakot": "44",
  "Ramechhap": "45",
  "Rasuwa": "45",
  "Sindhuli": "45",
  "Sindhupalchok": "45",

  // Gandaki Province
  "Baglung": "33",
  "Gorkha": "34",
  "Kaski": "33",
  "Lamjung": "33",
  "Manang": "33",
  "Mustang": "33",
  "Myagdi": "33",
  "Nawalpur": "33",
  "Parbat": "33",
  "Syangja": "33",
  "Tanahun": "33",

  // Lumbini Province
  "Arghakhanchi": "32",
  "Banke": "21",
  "Bardiya": "21",
  "Dang": "22",
  "Eastern Rukum": "22",
  "Gulmi": "32",
  "Kapilvastu": "32",
  "Palpa": "32",
  "Parasi": "33",
  "Pyuthan": "22",
  "Rolpa": "22",
  "Rupandehi": "32",

  // Karnali Province
  "Dailekh": "21",
  "Dolpa": "21",
  "Humla": "21",
  "Jajarkot": "21",
  "Jumla": "21",
  "Kalikot": "21",
  "Mugu": "21",
  "Salyan": "22",
  "Surkhet": "21",
  "Western Rukum": "22",

  // Sudurpashchim Province
  "Achham": "10",
  "Baitadi": "10",
  "Bajhang": "10",
  "Bajura": "10",
  "Dadeldhura": "10",
  "Darchula": "10",
  "Doti": "10",
  "Kailali": "10",
  "Kanchanpur": "10",

};
