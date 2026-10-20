/* Primary sources for hunt-page claims. Checked 2026-10-20 against TPWD pages
   marked "Valid Sep. 1, 2026 through Aug. 31, 2027". Re-check every August
   when TPWD publishes the next Outdoor Annual, and update dates in the hunt
   files the same day. */
import type { Source } from '../types';

export const SRC = {
  nongame: { label: 'TPWD, Nongame and Other Species', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/nongame-and-other-species' },
  hunterEd: { label: 'TPWD, Hunter Education', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/hunter-education' },
  licenses: { label: 'TPWD, Hunting Licenses and Permits', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/hunting-licenses-and-permits/hunting-licenses' },
  stamps: { label: 'TPWD, Stamps, Permits and Certification', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/migratory-game-bird-regulations/stamps-permits-and-certification' },
  birdMethods: { label: 'TPWD, Migratory Game Bird Methods', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/migratory-game-bird-regulations/methods' },
  definitions: { label: 'TPWD, Definitions (shooting hours)', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/general-regulations/definitions' },
  dove: { label: 'TPWD, Dove seasons', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/animals/dove' },
  duck: { label: 'TPWD, Duck seasons', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/animals/duck' },
  goose: { label: 'TPWD, Goose seasons and zones', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/animals/goose' },
  hip: { label: '50 CFR 20.20, Migratory Bird Harvest Information Program', url: 'https://www.law.cornell.edu/cfr/text/50/20.20' },
  plug: { label: '50 CFR 20.21, Hunting methods', url: 'https://www.ecfr.gov/current/title-50/chapter-I/subchapter-B/part-20/subpart-C/section-20.21' },
  bell: { label: 'TPWD, Bell County', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/counties/bell' },
  coryell: { label: 'TPWD, Coryell County', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/counties/coryell?season=2026' },
  milam: { label: 'TPWD, Milam County', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/counties/milam' },
  falls: { label: 'TPWD, Falls County', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/regs/counties/falls' },
  drones: { label: 'TPWD Law Enforcement FAQ, Drones', url: 'https://tpwd.texas.gov/warden/law-enforcement-faq/drones-uavs' },
  tahc: { label: 'Texas Animal Health Commission, Feral Swine', url: 'https://www.tahc.texas.gov/animal_health/swine/' },
  paperDigital: { label: 'TPWD, Choosing Between Paper and Digital Licenses', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/choosing-between-paper-and-digital-licenses' },
  digitalTags: { label: 'TPWD, Digital Tags', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/tagging-instructions/digitaltags' },
  purchaseReq: { label: 'TPWD, License Purchase Requirements', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/purchase-requirements' },
  licenseFaq: { label: 'TPWD, License FAQs', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/faqs' },
  onlineSales: { label: 'TPWD, Buying Licenses', url: 'https://tpwd.texas.gov/business/licenses/online_sales/' },
  tagDeer: { label: 'TPWD, Tagging Deer', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/tagging-instructions/tagging-deer' },
  afterDeer: { label: 'TPWD, After Killing a Deer', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/general-regulations/after-killing-a-deer' },
  proofSex: { label: 'TPWD, Proof of Sex', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/general-regulations/proof-of-sex' },
  hunterEdFaq: { label: 'TPWD, Hunter Education FAQ', url: 'https://tpwd.texas.gov/education/hunter-education/faq' },
  endorsements: { label: 'TPWD, Hunting Endorsements', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/hunting-licenses-and-permits/hunting-endorsements' },
  hipTx: { label: 'TPWD, Harvest Information Program', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/hunting-licenses-and-permits/harvest-information-program' },
  eStamp: { label: 'USFWS, Duck Stamp Modernization Act', url: 'https://fws.gov/story/2024-05/taking-tradition-future-implementing-duck-stamp-modernization-act' },
  birdRules: { label: 'TPWD, Migratory Game Bird General Rules', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/migratory-game-bird-regulations/general-rules' },
  meansMethods: { label: 'TPWD, Means and Methods', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/hunting/general-regulations/means-and-methods' },
  activeDuty: { label: 'TPWD, Active Duty Military License Packages', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/combination-hunting-fishing/texas-resident-active-duty-military-license-packages' },
  disabledVet: { label: 'TPWD, Disabled Veteran Super Combo', url: 'https://tpwd.texas.gov/regulations/outdoor-annual/licenses/combination-hunting-fishing/disabled-veteran-super-combo-hunting-and-all-water-fishing-package' },
  tahcMove: { label: 'TAHC, Swine Movement Requirements', url: 'https://web.tahc.texas.gov/regs/pdf/MovementRequirements_Swine.pdf' },
} satisfies Record<string, Source>;

/* Lines every hunter needs. Hunter ed applies to everyone born on or after
   Sept. 2, 1971 (TPWD hunter education page). */
export const HUNTER_ED = {
  text: 'Hunter education if you were born on or after Sept. 2, 1971, or the one-time deferral (17 and older, hunt accompanied).',
  source: SRC.hunterEd,
};
export const LICENSE = { text: 'A Texas hunting license.', source: SRC.licenses };
