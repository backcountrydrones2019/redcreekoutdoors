/* /book-a-hunt content. Built new 2026-10-20.

   CONSENT. Marketing calls and texts need the person's prior express written
   consent, which is why each channel is its own unchecked box, the wording
   says plainly what they're agreeing to, and booking never depends on it.
   The Worker stores which boxes were checked, this exact wording (by version),
   the time and the request details, so there is a record of what each person
   agreed to. CHANGE THE VERSION whenever the wording changes. This is
   practical protection, not legal advice; have counsel review before a
   marketing text program launches. */
import { DEPOSIT, PRICES } from '../consts';

export const HUNT_OPTIONS = [
  { value: 'thermal-hog', label: 'Thermal hog hunt', price: PRICES.thermalHog.text, unit: 'night' },
  { value: 'thermal-predator', label: 'Thermal predator hunt', price: PRICES.thermalPredator.text, unit: 'night' },
  { value: 'whitetail-doe', label: 'Whitetail doe hunt', price: PRICES.whitetailDoe.text, unit: 'day' },
  { value: 'whitetail-buck', label: 'Whitetail buck hunt', price: PRICES.whitetailBuck.text, unit: 'day' },
  { value: 'dove', label: 'Dove hunt', price: PRICES.dove.text, unit: 'day' },
  { value: 'teal', label: 'Teal hunt (September)', price: PRICES.teal.text, unit: 'day' },
  { value: 'duck', label: 'Duck hunt', price: PRICES.duck.text, unit: 'day' },
  // No goose price on file yet (asked Justin 2026-10-20). Swap to PRICES.goose when set.
  { value: 'goose', label: 'Goose hunt', price: 'Call for pricing', unit: 'day' },
  { value: 'corporate', label: 'Corporate or group event', price: 'Quoted per event', unit: 'event' },
] as const;

export const PARTY = ['1', '2', '3', '4', '5', '6', '7', '8', '9 or more'] as const;
export const EXPERIENCE = ['First time hunting', 'Hunted a few times', 'Experienced hunter', 'Mixed group'] as const;
export const GEAR = ['Bringing our own guns', 'Using Red Creek guns', 'Some of each', 'Not sure yet'] as const;
export const HEARD = ['Google', 'Facebook', 'TikTok', 'Friend or family', 'Fort Hood word of mouth', 'Hunted with you before', 'Other'] as const;

export const CONSENT_VERSION = 'rc-consent-2026-10-20';
export const CONSENT = [
  { key: 'text_marketing', label: 'Text me', text: 'Red Creek Outdoors may text me at the number above about future hunts, openings, specials and other marketing. Messages may be sent with automated technology. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.' },
  { key: 'email_marketing', label: 'Email me', text: 'Red Creek Outdoors may email me about future hunts, openings, specials and other marketing. Every email has an unsubscribe link.' },
  { key: 'call_marketing', label: 'Call me', text: 'Red Creek Outdoors may call me at the number above about future hunts, openings, specials and other marketing.' },
] as const;
export const CONSENT_FINE = 'None of these are required to book a hunt. We will still call, text or email you about this request whether or not you check them. Uncheck or reply STOP anytime.';

export const ACKNOWLEDGEMENTS = [
  { key: 'deposit', text: `I understand that once Red Creek confirms it can take my hunt, a ${DEPOSIT.text} nonrefundable deposit is due to lock in the date, and that nothing is owed until they confirm.` },
  { key: 'price', text: 'I understand the prices on the site are starting prices, and that my final price, dates and terms are confirmed in writing when the hunt is booked.' },
  { key: 'licenses', text: 'Every hunter in my group will hold the Texas licenses, endorsements, stamps and hunter education the hunt requires. The hunt page lists them.' },
  { key: 'safety', text: 'Everyone in my group will follow the guide\'s safety instructions for the whole hunt.' },
] as const;
