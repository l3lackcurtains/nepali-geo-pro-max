/**
 * Nepal Post postal-code mapping for the 753 local-level units (palikas).
 *
 * Sources:
 *   - Wikipedia, "Postal codes in Nepal" (legacy 1991 PO directory per district)
 *     https://en.wikipedia.org/wiki/Postal_codes_in_Nepal
 *   - Nepal General Post Office (कोड स्थानीय तह listing, legacy 1991 system)
 *     https://gpo.gov.np/pages/postal-code-1259614658/
 *   - Wikipedia, "List of districts of Nepal" (district HQ towns)
 *     https://en.wikipedia.org/wiki/List_of_districts_of_Nepal
 *   - VDC -> palika ward-level mapping (2017 federal restructuring)
 *     code-geek/nepal_data : data/vdc_to_gapa_napa_mapping_table.csv
 *     https://github.com/code-geek/nepal_data
 *
 * Coverage: 409 / 753 palikas have a verified primary postcode (~54.3%).
 *   - 193 via the original 17 anchor postcodes shipped on metro/sub-metro units
 *     and Wikipedia direct-name matches (v1.2 baseline).
 *   - 216 new entries derived via the 2017 VDC -> palika cross-walk: each
 *     PO branch was reconciled against the post-2017 palika that absorbed
 *     its former VDC.
 *
 * IMPORTANT - choice of code system:
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
 * **primary** code per palika (the GPO branch nearest to its admin centre,
 * which by Nepal Post convention is the lowest-numbered branch among the
 * palika's constituent VDCs).
 *
 * Cross-walk methodology (v1.3 expansion):
 *   1. For each palika, build the set of pre-2017 VDCs that merged into it
 *      (using ward-level GP_NP_CODE in code-geek/nepal_data).
 *   2. For each Wikipedia/GPO post-office in the palika's district, check
 *      whether the PO name matches (a) the palika name itself, (b) the name
 *      of any of its constituent VDCs (exact, transliteration-tolerant
 *      fuzzy, or word-split).
 *   3. Pick the lowest-numbered branch among all matches as the palika's
 *      primary code.
 *   4. Drop ambiguous matches (where multiple palikas in the same district
 *      claim the same PO via fuzzy match) - omitted rather than guessed.
 *
 * What is NOT mapped (~344 palikas / 45.7%):
 *   Palikas where no constituent VDC has its own legacy post-office branch
 *   listed by Nepal Post, or where the cross-walk is ambiguous. These are
 *   intentionally omitted rather than guessed.
 *
 * Key format: lowercase, full original English name. Where the name collides
 * across districts (e.g. "Madi Municipality" exists in both Sankhuwasabha and
 * Chitwan), the district name is appended in parentheses for disambiguation.
 *
 * Last verified: 2026-04-30
 */

/**
 * Lookup table - palika English name (lowercase, normalized) -> primary postcode.
 *
 * For palika names that occur in multiple districts, the key is suffixed with
 * the lowercase district name in parentheses. Example:
 *   - "madi municipality (chitwan)" -> "44214"
 *   - "madi municipality (sankhuwasabha)" -> "56909"
 *
 * Inline comments mark how each entry was sourced:
 *   - direct PO match: PO name == palika name (district HQ / direct hit)
 *   - via VDC merger (X): palika absorbed VDC "X" which has PO branch "X"
 *   - via VDC merger (fuzzy: X): same, with transliteration-tolerant matching
 *   - (no comment): legacy 17-anchor + district HQ entries (v1.2 baseline)
 */
export const POSTAL_CODES: Readonly<Record<string, string>> = {
  // ===== Koshi Province =====
  // -- Bhojpur district --
  "arun rural municipality": "57004",  // via VDC merger (Pyauli)
  "bhojpur municipality": "57000",
  "hatuwagadhi rural municipality": "57012",  // via VDC merger (fuzzy: Ranibas)
  "pauwadungma rural municipality": "57006",  // via VDC merger (Bastim)
  "ramprasad rai rural municipality": "57010",  // via VDC merger (Bhulke)
  "salpasilichho rural municipality": "57001",  // via VDC merger (Kulung Agrakhe)
  "shadanand municipality": "57003",  // via VDC merger (Deurali)
  "tyamke maiyum rural municipality": "57008",  // via VDC merger (Timma)
  // -- Dhankuta district --
  "chaubise rural municipality": "56802",  // via VDC merger (Rajarani)
  "chhathar jorpati rural municipality": "56808",  // via VDC merger (Teliya)
  "dhankuta municipality": "56800",
  "mahalaxmi municipality (dhankuta)": "56810",  // via VDC merger (Leguwa)
  "pakhribas municipality": "56809",
  "sangurigadhi rural municipality": "56803",  // via VDC merger (Dandabazar)
  // -- Ilam district --
  "ilam municipality": "57300",
  "maijogmai rural municipality": "57302",  // via VDC merger (Nayabazar)
  "mangsebung rural municipality": "57306",  // via VDC merger (Gajurmukhi)
  "sandakpur rural municipality": "57309",  // via VDC merger (Jamuna)
  "suryodaya municipality": "57303",  // via VDC merger (fuzzy: Pashupatinagar)
  // -- Jhapa district --
  "barhadashi rural municipality": "57209",  // via VDC merger (Rajgadh)
  "bhadrapur municipality": "57200",
  "birtamod municipality": "57204",
  "buddha shanti rural municipality": "57206",  // via VDC merger (Budhabare)
  "damak municipality": "57217",
  "gauradaha municipality": "57216",
  "gaurigunj rural municipality": "57215",
  "haldibari rural municipality": "57202",  // via VDC merger (Goldhap)
  "jhapa rural municipality": "57200",  // direct PO match
  "kachankawal rural municipality": "57201",  // via VDC merger (Baniyani)
  // -- Khotang district --
  "aiselukharka rural municipality": "56202",
  "diktel rupakot majhuwagadhi municipality": "56200",
  "halesi tuwachung municipality": "56206",
  "jantedhunga rural municipality": "56212",  // via VDC merger (Chisapani)
  "kepilasgadhi rural municipality": "56201",  // via VDC merger (fuzzy: Wakshila)
  "khotehang rural municipality": "56214",  // via VDC merger (Simpani)
  // -- Morang district --
  "biratnagar metropolitan city": "56600",
  "dhanpalthan rural municipality": "56607",  // via VDC merger (Sorabhag)
  "gramthan rural municipality": "56615",  // via VDC merger (Jhorahat)
  "kanepokhari rural municipality": "56606",  // via VDC merger (Bayarban)
  "katahari rural municipality": "56612",  // via VDC merger (Bhaudaha)
  "kerabari rural municipality": "56610",
  "letang municipality": "56609",
  "rangeli municipality": "56602",
  "urlabari municipality": "56604",
  // -- Okhaldhunga district --
  "khiji demba rural municipality": "56112",  // via VDC merger (Ragani)
  "manebhanjyang rural municipality": "56110",  // direct PO match
  "siddhicharan municipality": "56100",
  "sunkoshi rural municipality (okhaldhunga)": "56109",  // via VDC merger (fuzzy: Chyanam)
  // -- Panchthar district --
  "kummayak rural municipality": "57408",  // via VDC merger (Yasok)
  "miklajung rural municipality (panchthar)": "57411",  // via VDC merger (Limba)
  "phidim municipality": "57400",
  "tumbewa rural municipality": "57409",  // via VDC merger (Mauwa)
  "yangwarak rural municipality": "57401",  // via VDC merger (Chyangthapu)
  // -- Sankhuwasabha district --
  "bhotkhola rural municipality": "56901",  // via VDC merger (Hatiya)
  "chainpur municipality": "56913",
  "dharmadevi municipality": "56911",  // via VDC merger (Mamling)
  "khandbari municipality": "56900",
  "madi municipality (sankhuwasabha)": "56909",
  "panchkhapan municipality": "56907",  // via VDC merger (fuzzy: Wana)
  "silichong rural municipality": "56903",  // via VDC merger (Tamku)
  // -- Solukhumbu district --
  "khumbu pasanglhamu rural municipality": "56002",
  "necha salyan rural municipality": "56007",
  "solu dudhkunda municipality": "56000",
  "sotang rural municipality": "56004",
  // -- Sunsari district --
  "barju rural municipality": "56708",  // via VDC merger (Chimadi)
  "dewangunj rural municipality": "56712",
  "dharan sub-metropolitan city": "56700",
  "duhabi municipality": "56707",
  "inaruwa municipality": "56710",
  "itahari sub-metropolitan city": "56705",
  "koshi rural municipality": "56714",  // via VDC merger (fuzzy: Laukahee)
  // -- Taplejung district --
  "aathrai triveni rural municipality": "57512",  // via VDC merger (Hangpang)
  "phaktanglung rural municipality": "57508",  // via VDC merger (Olangchunggola)
  "phungling municipality": "57500",
  "sidingwa rural municipality": "57502",  // via VDC merger (fuzzy: Sadeba)
  "sirijangha rural municipality": "57501",  // via VDC merger (Khewang)
  // -- Terhathum district --
  "aathrai rural municipality": "57111",  // via VDC merger (Iwa)
  "chhathar rural municipality": "57105",  // via VDC merger (Sudap)
  "menchayayem rural municipality": "57107",  // via VDC merger (Morahang)
  "myanglung municipality": "57100",
  // -- Udayapur district --
  "chaudandigadhi municipality": "56303",  // via VDC merger (Hadiya)
  "katari municipality": "56310",
  "rautamai rural municipality": "56305",  // via VDC merger (Pokhari)
  "triyuga municipality": "56300",
  "udayapurgadhi rural municipality": "56309",  // direct PO match

  // ===== Madhesh Province =====
  // -- Bara district --
  "jeetpur simara sub-metropolitan city": "44412",
  "kalaiya sub-metropolitan city": "44400",
  "nijgadh municipality": "44401",
  "simaraungadh municipality": "44403",
  "suwarna rural municipality": "44406",  // via VDC merger (fuzzy: Kabahigoth)
  // -- Dhanusha district --
  "bideha municipality": "45604",  // via VDC merger (Duhabi)
  "dhanushadham municipality": "45608",
  "janakpurdham sub-metropolitan city": "45600",
  "nagarain municipality": "45612",  // via VDC merger (Phulgama)
  // -- Mahottari district --
  "aaurahi municipality": "45712",  // via VDC merger (Shreepur)
  "balawa municipality": "45708",
  "bardibas municipality": "45701",
  "bhangaha municipality": "45702",
  "gaushala municipality": "45711",
  "jaleshor municipality": "45700",
  "loharpatti municipality": "45703",
  "mahottari rural municipality": "45700",  // direct PO match
  "manara shiswa municipality": "45714",
  "matihani municipality": "45705",
  "pipara rural municipality": "45704",
  "ramgopalpur municipality": "45707",
  "samsi rural municipality": "45713",
  // -- Parsa district --
  "bindabasini rural municipality": "44304",
  "birgunj metropolitan city": "44300",
  "chhipaharmai rural municipality": "44312",  // via VDC merger (fuzzy: Viswa)
  "pakaha mainpur rural municipality": "44308",  // direct PO match
  "parsagadhi municipality": "44307",  // via VDC merger (Biruwaguthi)
  "paterwa sugauli rural municipality": "44311",
  "pokhariya municipality": "44309",  // direct PO match
  "thori rural municipality": "44315",
  // -- Rautahat district --
  "durga bhagwati rural municipality": "44502",  // via VDC merger (Saruatha)
  "gadhimai municipality": "44513",  // via VDC merger (Samanpur)
  "gaur municipality": "44500",
  "katahariya municipality": "44512",
  "madhav narayan municipality": "44504",  // via VDC merger (Madhopur)
  "phatuwa bijayapur municipality": "44511",  // via VDC merger (Laxminiya)
  // -- Saptari district --
  "bishnupur rural municipality (saptari)": "56409",
  "bodebarsain municipality": "56415",
  "chhinnamasta rural municipality": "56408",
  "dakneshwori municipality": "56412",  // via VDC merger (Pato)
  "hanumannagar kankalini municipality": "56418",  // via VDC merger (fuzzy: Bhardaha)
  "kanchanrup municipality": "56402",  // via VDC merger (fuzzy: Bairaba)
  "khadak municipality": "56414",  // via VDC merger (Kalyanpur)
  "mahadeva rural municipality": "56406",  // via VDC merger (Bhagawatpur)
  "rajbiraj municipality": "56400",
  "rupani rural municipality": "56411",
  "tilathi koiladi rural municipality": "56407",  // via VDC merger (Koiladi)
  // -- Sarlahi district --
  "balara municipality": "45813",  // via VDC merger (Dumariya)
  "barahathwa municipality": "45810",  // via VDC merger (Barahathawa)
  "brahampuri rural municipality": "45806",
  "chakraghatta rural municipality": "45811",  // via VDC merger (Sundarpur)
  "haripur municipality": "45805",
  "haripurwa municipality": "45803",
  "hariwan municipality": "45804",
  "kaudena rural municipality": "45809",
  "lalbandi municipality": "45801",
  "malangawa municipality": "45800",
  "ramnagar rural municipality": "45816",  // via VDC merger (Ramnagar Bahuarwa)
  // -- Siraha district --
  "bariyarpatti rural municipality": "56506",
  "bishnupur rural municipality (siraha)": "56511",
  "golbazar municipality": "56508",
  "kalyanpur municipality": "56517",
  "lahan municipality": "56502",
  "lakshmipur patari rural municipality": "56505",  // via VDC merger (Maheshpur patari)
  "mirchaiya municipality": "56515",
  "siraha municipality": "56500",
  "sukhipur municipality": "56509",

  // ===== Bagmati Province =====
  // -- Bhaktapur district --
  "bhaktapur municipality": "44800",
  "changunarayan municipality": "44812",  // via VDC merger (Nagarkot)
  "madhyapur thimi municipality": "44811",
  // -- Chitwan district --
  "bharatpur metropolitan city": "44200",
  "khairhani municipality": "44203",  // via VDC merger (Khairahani)
  "madi municipality (chitwan)": "44214",
  "ratnagar municipality": "44204",  // via VDC merger (Ratnanagar)
  // -- Dhading district --
  "gajuri rural municipality": "45112",
  "gangajamuna rural municipality": "45103",  // via VDC merger (Phulkharka)
  "jwalamukhi rural municipality": "45109",  // via VDC merger (Maidi)
  "nilkantha municipality": "45100",
  "rubi valley rural municipality": "45101",  // via VDC merger (Lapa)
  "tripurasundari rural municipality (dhading)": "45104",  // via VDC merger (Tripureshwor)
  // -- Dolakha district --
  "bhimeswor municipality": "45500",
  "bigu rural municipality": "45510",  // via VDC merger (Khopachangu)
  "jiri municipality": "45503",
  "kalinchok rural municipality": "45509",  // via VDC merger (Sunkhani)
  "melung rural municipality": "45506",
  "sailung rural municipality": "45507",  // via VDC merger (fuzzy: Bhusapheda)
  // -- Kathmandu district --
  "kathmandu metropolitan city": "44600",
  "kirtipur municipality": "44618",
  "tokha municipality": "44608",  // via VDC merger (Tokha Saraswati)
  // -- Kavrepalanchok district --
  "banepa municipality": "45210",
  "bhumlu rural municipality": "45215",  // via VDC merger (Dolal Ghat)
  "dhulikhel municipality": "45200",
  "panauti municipality": "45209",
  "panchkhal municipality": "45212",
  "roshi rural municipality": "45202",  // via VDC merger (Mangaltar)
  "temal rural municipality": "45203",  // via VDC merger (fuzzy: Pokharinarayanshthan)
  // -- Lalitpur district --
  "bagmati rural municipality (lalitpur)": "44713",  // via VDC merger (Pyutar)
  "godawari municipality (lalitpur)": "44709",
  "lalitpur metropolitan city": "44700",
  "mahankal rural municipality": "44711",  // via VDC merger (Gotikhel)
  // -- Makwanpur district --
  "bagmati rural municipality (makwanpur)": "44101",  // via VDC merger (Phaparbari)
  "bhimphedi rural municipality": "44112",
  "hetauda sub-metropolitan city": "44100",
  "indrasarowar rural municipality": "44113",  // via VDC merger (Markhu)
  "makawanpurgadhi rural municipality": "44104",  // via VDC merger (Aambhanjyang)
  "manahari rural municipality": "44106",
  // -- Nuwakot district --
  "bidur municipality": "44900",
  "dupcheshwar rural municipality": "44913",  // via VDC merger (Rautbesi)
  "myagang rural municipality": "44906",  // via VDC merger (Deurali)
  "tadi rural municipality": "44910",  // via VDC merger (Kharanitar)
  "tarkeshwar rural municipality": "44905",  // via VDC merger (Taruka)
  // -- Ramechhap district --
  "doramba rural municipality": "45409",
  "gokulganga rural municipality": "45401",  // via VDC merger (Those)
  "khandadevi rural municipality": "45411",  // via VDC merger (Bhirpani)
  "manthali municipality": "45400",
  "ramechhap municipality": "45400",  // direct PO match
  "sunapati rural municipality": "45410",  // via VDC merger (Hiledevi)
  // -- Rasuwa district --
  "kalika rural municipality": "45003",  // via VDC merger (Dhaibung)
  "uttargaya rural municipality": "45000",
  // -- Sindhuli district --
  "dudhauli municipality": "45903",
  "ghyanglekh rural municipality": "45911",  // via VDC merger (Netrakali)
  "kamalamai municipality": "45900",
  "marin rural municipality": "45912",  // via VDC merger (Kapilakot)
  "tinpatan rural municipality": "45907",  // via VDC merger (Belghari)
  // -- Sindhupalchok district --
  "bahrabise municipality": "45302",
  "balephi rural municipality": "45314",
  "chautara sangachowkgadi municipality": "45300",
  "indrawati rural municipality": "45306",  // via VDC merger (Nawalpur)
  "jugal rural municipality": "45307",  // via VDC merger (Pangtang)
  "melamchi municipality": "45310",

  // ===== Gandaki Province =====
  // -- Baglung district --
  "baglung municipality": "33300",
  "galkot municipality": "33308",
  "jaimuni municipality": "33306",  // via VDC merger (Jaidi Belbagar)
  "khathekhola rural municipality": "33303",  // via VDC merger (Bihukot)
  "taman khola rural municipality": "33312",  // via VDC merger (fuzzy: Bongadovan)
  // -- Gorkha district --
  "aarughat rural municipality": "34011",
  "chumnubri rural municipality": "34013",  // via VDC merger (fuzzy: Sirdibash)
  "dharche rural municipality": "34012",  // via VDC merger (Gumda)
  "gorkha municipality": "34000",
  "sahid lakhan rural municipality": "34002",  // via VDC merger (Bungkot)
  "siranchowk rural municipality": "34007",  // via VDC merger (fuzzy: Jaubari)
  "sulikot rural municipality": "34009",  // via VDC merger (Saurpani)
  // -- Kaski district --
  "pokhara metropolitan city": "33700",
  "rupa rural municipality": "33701",  // via VDC merger (Rupakot)
  // -- Lamjung district --
  "besisahar municipality": "33600",
  "dordi rural municipality": "33609",  // via VDC merger (Bharate)
  "kwhlosothar rural municipality": "33602",  // via VDC merger (Maling)
  "marsyangdi rural municipality": "33607",  // via VDC merger (Khudi)
  "sundarbazar municipality": "33603",  // direct PO match
  // -- Manang district --
  "chame rural municipality": "33500",
  "nason rural municipality": "33509",  // via VDC merger (Dharapani)
  // -- Mustang district --
  "barhagaun muktichhetra rural municipality": "33103",  // via VDC merger (Kagbeni)
  "gharpajhong rural municipality": "33100",
  "thasang rural municipality": "33108",  // via VDC merger (Lete)
  // -- Myagdi district --
  "annapurna rural municipality (myagdi)": "33206",  // via VDC merger (Dana)
  "beni municipality": "33200",
  "dhaulagiri rural municipality": "33210",  // via VDC merger (Takam)
  "mangala rural municipality": "33207",  // via VDC merger (Babiyachaur)
  "raghuganga rural municipality": "33209",  // via VDC merger (Pakhapani)
  // -- Nawalpur district --
  "bulingtar rural municipality": "33002",
  "gaindakot municipality": "33003",
  "kawasoti municipality": "33000",
  "madhya bindu municipality": "33006",  // via VDC merger (Naya Belhani)
  // -- Parbat district --
  "jaljala rural municipality": "33401",  // via VDC merger (fuzzy: Salija)
  "kushma municipality": "33400",
  "modi rural municipality": "33403",  // via VDC merger (Deurali)
  "paiyun rural municipality": "33410",  // via VDC merger (fuzzy: Hubas)
  "phalewas municipality": "33407",  // via VDC merger (Devisthan)
  // -- Syangja district --
  "arjun chaupari rural municipality": "33805",  // direct PO match
  "chapakot municipality": "33814",
  "galyang municipality": "33815",
  "phedikhola rural municipality": "33808",  // via VDC merger (Fedikhola)
  "putalibazar municipality": "33800",
  // -- Tanahun district --
  "anbukhaireni rural municipality": "33905",  // direct PO match
  "bandipur rural municipality": "33904",
  "bhimad municipality": "33910",
  "byas municipality": "33900",
  "ghiring rural municipality": "33909",  // via VDC merger (Ghiring Sundhara)

  // ===== Lumbini Province =====
  // -- Arghakhanchi district --
  "bhumikasthan municipality": "32708",  // via VDC merger (Khilji)
  "chhatradev rural municipality": "32701",  // via VDC merger (Balkot)
  "malarani rural municipality": "32703",  // via VDC merger (Khana)
  "panini rural municipality": "32709",  // via VDC merger (Khidim)
  "sandhikharka municipality": "32700",
  "sitganga municipality": "32706",  // via VDC merger (Thada)
  // -- Banke district --
  "baijanath rural municipality": "21910",  // via VDC merger (Chisapani)
  "khajura rural municipality": "21913",
  "kohalpur municipality": "21904",
  "nepalgunj sub-metropolitan city": "21900",
  "rapti-sonari rural municipality": "21903",  // via VDC merger (fuzzy: Khaskusma)
  // -- Bardiya district --
  "badhaiyatal rural municipality": "21801",  // via VDC merger (Jamuni)
  "geruwa rural municipality": "21813",  // via VDC merger (Pashupatinagar)
  "gulariya municipality": "21800",
  "rajapur municipality": "21811",
  // -- Dang district --
  "babai rural municipality": "22410",  // via VDC merger (Panchakule)
  "dangisharan rural municipality": "22409",  // via VDC merger (Hekuli)
  "gadhawa rural municipality": "22405",  // via VDC merger (Koilabas)
  "ghorahi sub-metropolitan city": "22414",
  "lamahi municipality": "22414",
  "shantinagar rural municipality": "22411",
  "tulsipur sub-metropolitan city": "22400",
  // -- Eastern Rukum district --
  "putha uttarganga rural municipality": "22000",
  // -- Gulmi district --
  "chandrakot rural municipality": "32603",
  "dhurkot rural municipality": "32611",
  "kaligandaki rural municipality (gulmi)": "32601",  // via VDC merger (Purtighat)
  "malika rural municipality (gulmi)": "32613",  // via VDC merger (Arje)
  "resunga municipality": "32600",
  // -- Kapilvastu district --
  "bijaynagar rural municipality": "32813",  // via VDC merger (Ganeshpur)
  "kapilvastu municipality": "32800",
  "krishnanagar municipality": "32815",
  "maharajgunj municipality": "32812",
  "mayadevi rural municipality (kapilvastu)": "32801",  // via VDC merger (Pipara)
  "shivaraj municipality": "32816",  // direct PO match
  "suddhodan rural municipality": "32802",  // via VDC merger (Patariya)
  // -- Palpa district --
  "mathagadhi rural municipality": "32506",  // via VDC merger (Jhadewa)
  "nisdi rural municipality": "32501",  // via VDC merger (Sahalkot)
  "purbakhola rural municipality": "32504",  // via VDC merger (Jalpa)
  "rambha rural municipality": "32503",  // via VDC merger (Hungi)
  "rampur municipality": "32502",
  "ripdikot rural municipality": "32509",  // via VDC merger (Khasyauli)
  "tansen municipality": "32500",
  // -- Parasi district --
  "ramgram municipality": "33000",
  "sarawal rural municipality": "33012",  // via VDC merger (Tilakpur)
  // -- Pyuthan district --
  "ayirawati rural municipality": "22305",  // via VDC merger (Baraula)
  "pyuthan municipality": "22300",
  "sarumarani rural municipality": "22304",  // via VDC merger (fuzzy: Wangesal)
  // -- Rolpa district --
  "lungri rural municipality": "22103",  // via VDC merger (Sirpa)
  "rolpa municipality": "22100",
  "runtigadi rural municipality": "22113",  // via VDC merger (Jhenam (Holeri))
  "thawang rural municipality": "22106",
  // -- Rupandehi district --
  "butwal sub-metropolitan city": "32907",
  "gaidahawa rural municipality": "32912",  // via VDC merger (Suryapura)
  "lumbini sanskritik municipality": "32914",
  "sainamaina municipality": "32911",  // via VDC merger (Saljhandi)
  "siddharthanagar municipality": "32900",
  // -- Salyan district --
  "darma rural municipality": "22210",  // via VDC merger (Bhalchaur)
  "kalimati rural municipality": "22201",  // via VDC merger (Kalimati Kalche)
  "kapurkot rural municipality": "22203",  // via VDC merger (fuzzy: Dhanbang)
  "shaarda municipality": "22200",

  // ===== Karnali Province =====
  // -- Dailekh district --
  "aathabis municipality": "21610",  // via VDC merger (Rakam Karnali)
  "dullu municipality": "21608",
  "narayan municipality": "21600",
  "naumule rural municipality": "21603",
  // -- Dolpa district --
  "mudkechula rural municipality": "21404",  // via VDC merger (Sarmi)
  "thuli bheri municipality": "21400",
  "tripurasundari municipality": "21402",  // via VDC merger (Tripurakot)
  // -- Humla district --
  "adanchuli rural municipality": "21008",  // via VDC merger (fuzzy: Srinagar)
  "chankheli rural municipality": "21007",  // via VDC merger (Darma)
  "kharpunath rural municipality": "21004",  // via VDC merger (Lali)
  "namkha rural municipality": "21003",  // via VDC merger (Muchu)
  "sarkegad rural municipality": "21005",
  "simkot rural municipality": "21000",
  // -- Jajarkot district --
  "bheri municipality": "21500",
  "chhedagad municipality": "21508",  // via VDC merger (Dashera)
  "junichande rural municipality": "21510",  // via VDC merger (Garkhakot)
  "kuse rural municipality": "21503",  // via VDC merger (Dhime)
  "shivalaya rural municipality": "21509",  // via VDC merger (Thalaraikar)
  // -- Jumla district --
  "chandannath municipality": "21200",
  "hima rural municipality": "21206",  // via VDC merger (Kalikakhetu)
  "patarasi rural municipality": "21202",  // via VDC merger (Dillichaur)
  "sinja rural municipality": "21207",  // via VDC merger (Narakot)
  "tatopani rural municipality": "21204",
  "tila rural municipality": "21205",  // via VDC merger (Malikathata)
  // -- Kalikot district --
  "khandachakra municipality": "21300",
  "narharinath rural municipality": "21305",  // via VDC merger (Kotbada)
  "palata rural municipality": "21309",  // via VDC merger (Thirpu)
  "tilagufa municipality": "21308",  // via VDC merger (Jubitha)
  // -- Mugu district --
  "chhayanath rara municipality": "21100",
  "khatyad rural municipality": "21107",  // via VDC merger (fuzzy: Sukhadhik)
  "mugum karmarong rural municipality": "21100",  // via VDC merger (Mugu)
  "soru rural municipality": "21110",  // via VDC merger (Dhainkot)
  // -- Surkhet district --
  "barahatal rural municipality": "21709",  // via VDC merger (Kunathari)
  "bheriganga municipality": "21705",
  "birendranagar municipality": "21700",
  "chaukune rural municipality": "21711",  // via VDC merger (Gutu)
  "chingad rural municipality": "21706",  // via VDC merger (Matela)
  "gurbhakot municipality": "21703",  // via VDC merger (Sahare)
  "panchapuri municipality": "21710",  // via VDC merger (Babiyachaur)
  // -- Western Rukum district --
  "chaurjahari municipality": "22008",
  "musikot municipality (western rukum)": "22000",

  // ===== Sudurpashchim Province =====
  // -- Achham district --
  "chaurpati rural municipality": "10701",
  "dhakari rural municipality": "10712",
  "kamalbazar municipality": "10711",  // direct PO match
  "mangalsen municipality": "10700",
  "mellekh rural municipality": "10704",
  "ramaroshan rural municipality": "10706",  // via VDC merger (Bhatakatiya)
  // -- Baitadi district --
  "dashrathchanda municipality": "10200",
  "dilashaini rural municipality": "10211",  // direct PO match
  "dogdakedar rural municipality": "10210",  // via VDC merger (fuzzy: Srikot)
  "patan municipality": "10202",
  "purchaudi municipality": "10213",
  "shivanath rural municipality": "10209",  // via VDC merger (Sharmali)
  "sigas rural municipality": "10205",  // via VDC merger (fuzzy: Gajari Changgad)
  // -- Bajhang district --
  "bungal municipality": "10510",
  "jayaprithvi municipality": "10500",
  "talkot rural municipality": "10501",
  "thalara rural municipality": "10509",
  // -- Bajura district --
  "badimalika municipality": "10600",
  "budhinanda municipality": "10605",  // via VDC merger (Kolti)
  "gaumul rural municipality": "10606",  // via VDC merger (Manakot)
  // -- Dadeldhura district --
  "ajaymeru rural municipality": "10308",  // via VDC merger (Chipur)
  "amargadhi municipality": "10300",
  "ganyapadhura rural municipality": "10304",  // via VDC merger (Ganeshpur)
  // -- Darchula district --
  "lekam rural municipality": "10107",  // via VDC merger (Ritha Chaupata)
  "mahakali municipality (darchula)": "10100",
  "malikarjun rural municipality": "10104",
  "naugad rural municipality": "10111",  // via VDC merger (Sipti)
  "vyans rural municipality": "10101",  // via VDC merger (Rapla)
  // -- Doti district --
  "badikedar rural municipality": "10808",  // via VDC merger (fuzzy: Lanakedareswor)
  "dipayal silgadhi municipality": "10800",
  "jorayal rural municipality": "10806",
  "shikhar municipality": "10811",  // via VDC merger (Mudbhara)
  // -- Kailali district --
  "bardagoriya rural municipality": "10903",  // via VDC merger (Dododhara)
  "dhangadhi sub-metropolitan city": "10900",
  "gauriganga municipality": "10905",  // via VDC merger (Masuriya)
  "ghodaghodi municipality": "10906",  // via VDC merger (Pahalmanpur)
  "janaki rural municipality (kailali)": "10902",  // via VDC merger (Munuwa)
  "joshipur rural municipality": "10909",
  "kailari rural municipality": "10907",  // via VDC merger (Hasuliya)
  "lamkichuha municipality": "10904",
  "tikapur municipality": "10901",
  // -- Kanchanpur district --
  "beldandi rural municipality": "10404",  // via VDC merger (Beldadi)
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
