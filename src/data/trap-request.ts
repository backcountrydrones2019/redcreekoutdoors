/* /hog-trap-request content. Built from the backcountrydrones.com hog
   assessment form, trapping only: no drone recon, no surveying. The first
   step is a site assessment on foot; the $100 deposit rule is in consts. */
import { DEPOSIT, PRICES } from '../consts';

export const MAP_MODES = [
  { key: 'damage', label: 'Shade damage', kind: 'polygon', color: '#c1282c', hint: 'Outline where they are tearing things up: rooting, wallows, wrecked fence, torn-up fields.' },
  { key: 'sign', label: 'Mark sign', kind: 'pin', color: '#343333', hint: 'Trails, crossings, rubs, wallows, anywhere you keep seeing fresh sign.' },
  { key: 'water', label: 'Mark water', kind: 'pin', color: '#2f5f8a', hint: 'Tanks, creeks, troughs, seeps. Water drives the pattern more than feed in a dry year.' },
  { key: 'access', label: 'Mark access', kind: 'pin', color: '#9a6b2f', hint: 'Gates, cattle guards and anywhere a truck and trailer can actually get to.' },
  { key: 'nogo', label: 'Shade off limits', kind: 'polygon', color: '#6b6b6b', hint: 'Houses, livestock, leased hunting, a neighbor line you don\'t want crossed.' },
] as const;

/* What has been tried changes how educated the sounder is, and that changes
   the whole approach. */
export const CONTROL_METHODS = [
  'Nothing yet', 'Day hunting over feeders', 'Night hunting with thermal', 'Box traps', 'Corral traps',
  'Snares', 'Dogs', 'Aerial gunning', 'Someone else is trapping it',
] as const;

export const DAMAGE_TYPES = [
  'Pasture and rooting', 'Row crops', 'Hay meadows', 'Food plots', 'Fences', 'Livestock feed',
  'Tanks and water', 'Roads and crossings', 'Yard and landscaping', 'Solar site', 'Threat to livestock',
] as const;

export const PROPERTY_FIELDS = [
  { name: 'address', label: 'Property address or nearest crossroads', kind: 'text', required: true, placeholder: 'FM 2484 and Stagecoach Rd, Salado' },
  { name: 'acreage', label: 'Acreage', kind: 'text', half: true, required: true, inputmode: 'numeric' },
  { name: 'county', label: 'County', kind: 'text', half: true, required: true },
  { name: 'sounder', label: 'Most hogs seen at once', kind: 'select', half: true, options: ['Under 10', '10 to 25', '25 to 50', 'More than 50', 'No idea yet'] },
  { name: 'duration', label: 'How long has this been going on?', kind: 'select', half: true, options: ['Just started', 'A few months', 'A year or more', 'Years, it comes and goes'] },
  { name: 'cell', label: 'Cell service on the property', kind: 'select', half: true, options: ['Good', 'Spotty', 'None', 'Not sure'], help: 'Our traps and cameras run on cell signal. No signal is workable, it changes the setup.' },
  { name: 'trailer', label: 'Truck and trailer access', kind: 'select', half: true, options: ['Good, all weather', 'Passable when dry', 'Rough, high clearance only', 'Limited, would need to discuss'], help: 'Trap panels have to physically get to where they need to be.' },
  { name: 'livestock', label: 'Livestock or working dogs on the place?', kind: 'text', placeholder: 'Cattle in the east pasture, two dogs with the goats' },
  { name: 'neighbors', label: 'Anything next door that matters?', kind: 'text', placeholder: 'Neighbor runs dogs on weekends, subdivision on the south line' },
] as const;

export const ACKNOWLEDGEMENTS = [
  { key: 'assessment_first', text: 'I understand the first step is a site assessment: Red Creek walks the property, reads the sign and plans where traps go. No trap goes up until that is done and we agree on a plan.' },
  { key: 'deposit', text: `I understand that once Red Creek confirms it can schedule my site assessment, a ${DEPOSIT.text} nonrefundable deposit is due to lock it in, and that nothing is owed until they confirm.` },
  { key: 'price', text: `I understand hog trapping ${PRICES.trapping.text.toLowerCase()}, and that the final price is set in writing after the assessment, before any work starts.` },
  { key: 'no_guarantee', text: 'I understand no one can guarantee a hog population is eliminated, that hogs move in from neighboring property, and that control is ongoing work rather than a one-time event.' },
  { key: 'access_truth', text: 'I have the authority to allow access to this property, and I will disclose any leases, livestock or neighbors that affect how it gets worked.' },
] as const;
