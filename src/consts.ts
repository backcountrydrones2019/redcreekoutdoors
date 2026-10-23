/* Single source of truth. Phone, area served, hours and prices live here and
   nowhere else, because the site, the JSON-LD and the Google Business Profile
   have to match word for word (rule 8). Change a fact here, rebuild, and then
   change it on the Business Profile the same day. */

export const SITE = {
  name: 'Red Creek Outdoors',
  legal: 'Red Creek Outdoors LLC',
  url: 'https://redcreekoutdoors.com',
  phone: '254-397-8938',
  phoneE164: '+12543978938',
  // Google Workspace mailbox, approved 2026-10-20 and not created yet. Until
  // it exists the site shows the phone only and the form is the written path.
  email: '',
  city: 'Killeen',
  state: 'TX',
  // Business Profile says "Open 24 hours". Kept as is, by decision 2026-10-20.
  hoursText: 'Open 24 hours, 7 days a week',
  hoursSchema: ['Mo-Su 00:00-23:59'],
  // The two channels Justin named 2026-10-20. Header, footer and schema
  // sameAs all read from here.
  social: {
    facebook: 'https://www.facebook.com/redcreekoutdoorz',
    tiktok: 'https://www.tiktok.com/@redcreekoutdoors',
  },
  partner: {
    name: 'Backcountry Drones',
    url: 'https://backcountrydrones.com',
  },
} as const;

/* Counties named on the old site, in its words. Must match the schema
   areaServed and /hog-removal-areas. */
export const COUNTIES = ['Bell', 'Coryell', 'Milam', 'Falls'] as const;

/* Towns from the old /hog-removal-areas page. Kept so that page still names
   every town it named before cutover. "Fort Hood" by the owner's preference. */
export const SERVICE_TOWNS = [
  'Killeen', 'Harker Heights', 'Copperas Cove', 'Fort Hood', 'Belton', 'Temple',
  'Gatesville', 'Moody', 'McGregor', 'Rosebud', 'Marlin', 'Lott', 'Westphalia',
  'Holland', 'Salado', 'Jarrell', 'Buckholts', 'Austin', 'Georgetown',
  // Added by Justin 2026-10-20, each with its own page:
  'Lampasas', 'Jonesboro', 'Brady',
] as const;

/* Towns where Red Creek hunts. Town names only, never a property, gate or
   address (decision 2026-10-20). */
export const HUNT_TOWNS = ['Salado', 'Marlin', 'Gatesville', 'Rogers', 'Holland'] as const;

/* Prices exactly as the owners gave them on 2026-10-20. "From" means starting
   price. Do not add a per-hunter or group qualifier they didn't give. */
export const PRICES = {
  trapping: { amount: 800, text: 'Starts at $800' },
  thermalHog: { amount: 500, text: 'From $500 a night' },
  thermalPredator: { amount: 600, text: 'From $600 a night' },
  whitetailDoe: { amount: 700, text: 'Does from $700 a day' },
  whitetailBuck: { amount: 1500, text: 'Bucks from $1,500 a day' },
  dove: { amount: 300, text: '$300 a gun per day' },
  teal: { amount: 350, text: '$350 a gun per day' },
  duck: { amount: 400, text: '$400 a gun per day' },
  goose: { amount: 500, text: '$500 a person' }, // Justin 2026-10-20
} as const;

/* Scale of the operation. Stub pattern: a number renders only when it's real.
   acres: stated by Justin 2026-10-20. hogsRemoved is this calendar year's
   total from the ops records; refresh it from a live query, never from
   memory. A null value doesn't render. */
export const SCALE = {
  acres: '20,000+',
  hogsRemoved: 455 as number | null,
  hogsYear: 2026,
  hogsAsOf: 'Oct. 20, 2026',
  traps: null as number | null,
} as const;

/* Deposit, by Justin 2026-10-20: one rule for both forms. Due only after Red
   Creek confirms it can take the hunt or schedule the site assessment.
   Payment method is set at confirmation (no payment link on the site yet). */
export const DEPOSIT = {
  amount: 100,
  text: '$100',
  rule: 'Once we confirm we can take your hunt or schedule your hog trapping site assessment, a $100 nonrefundable deposit is due to lock it in. Nothing is owed until we confirm.',
} as const;

/* Said on every hunt page, in the owners' terms. */
export const EQUIPMENT_RULE =
  "Bring your own rifle or shotgun, or use ours. Same with ammo. The price doesn't move either way, because you're paying for access to the ground and the hunt, not for gear.";

export const NAV = [
  {
    label: 'Hog Trapping',
    href: '/hog-trapping-service',
    children: [
      { label: 'Trapping Service', href: '/hog-trapping-service' },
      { label: 'Hog Damage Prevention', href: '/hog-damage-prevention' },
      { label: 'Areas We Trap', href: '/hog-removal-areas' },
      { label: 'Thermal Hog Counts', href: '/wildlife-surveys' },
    ],
  },
  {
    label: 'Guided Hunts',
    href: '/guided-hunts',
    children: [
      { label: 'Thermal Hog Hunts', href: '/thermal-hog-hunts' },
      { label: 'Thermal Predator Hunts', href: '/thermal-predator-hunts' },
      { label: 'Whitetail Deer', href: '/whitetail-deer-hunts' },
      { label: 'Dove', href: '/dove-hunts' },
      { label: 'Teal', href: '/teal-hunts' },
      { label: 'Duck', href: '/duck-hunts' },
      { label: 'Goose', href: '/goose-hunts' },
      { label: 'Licenses and FAQ', href: '/faq' },
    ],
  },
  { label: 'Corporate', href: '/corporate-hunts' },
  { label: 'Field Notes', href: '/field-notes' },
  { label: 'About', href: '/about' },
] as const;
