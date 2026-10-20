import type { Hunt } from '../types';
import { PRICES } from '../../consts';
import { SRC, HUNTER_ED, LICENSE } from './sources';

const hunt: Hunt = {
  slug: 'dove-hunts',
  name: 'Dove Hunts',
  title: 'Guided Dove Hunts in Central Texas | Red Creek Outdoors',
  h1: 'Guided Dove Hunts',
  description: 'Guided dove hunts in the Central Zone on private land near Killeen and Temple. $300 a gun per day. Shotguns and shells available at no extra charge.',
  lede: `Field shoots on private Central Texas ground. ${PRICES.dove.text}.`,
  card: 'Field shoots in the Central Zone season. Bring a shotgun or use ours.',
  priceText: PRICES.dove.text,
  offers: [{ name: 'Dove hunt', amount: PRICES.dove.amount, unit: 'per gun per day' }],
  whenShort: 'Sept. 1 to Oct. 25, 2026 and Dec. 11, 2026 to Jan. 14, 2027 (Central Zone)',
  sections: [
    {
      h2: 'The Texas tradition',
      paras: [
        'Opening day of dove season is a holiday in Texas whether the calendar says so or not. It\'s also the easiest hunt to bring someone new to, and the best one for a group: everyone shoots, everyone talks, nobody sits in a blind alone.',
      ],
    },
    {
      h2: '2026-27 dove season',
      paras: ['Bell, Coryell, Milam and Falls counties are in TPWD\'s Central Zone.'],
      list: [
        'First split: Sept. 1 to Oct. 25, 2026',
        'Second split: Dec. 11, 2026 to Jan. 14, 2027',
        'Daily bag: 15, no more than 2 white-tipped doves',
        'Shooting hours: half an hour before sunrise to sunset',
      ],
    },
  ],
  requirements: [
    LICENSE,
    { text: 'Migratory Game Bird Endorsement if you\'re 17 or older. It covers doves.', source: SRC.stamps },
    { text: 'HIP certification. You answer a few questions when you buy your license. Get it whatever your age.', source: SRC.hip },
    HUNTER_ED,
    { text: 'A shotgun that holds no more than three shells (plugged).', source: SRC.plug },
    { text: 'You don\'t need a Federal Duck Stamp or non-toxic shot for doves. Those are for waterfowl.', source: SRC.birdMethods },
  ],
  faq: [
    { q: 'How much is a guided dove hunt?', a: `${PRICES.dove.text}. Shotgun and shells available at the same price.` },
    { q: 'When is dove season in Bell County?', a: 'Central Zone, 2026-27: Sept. 1 to Oct. 25, 2026, then Dec. 11, 2026 to Jan. 14, 2027, per TPWD.' },
    { q: 'What license do I need to hunt doves in Texas?', a: 'A Texas hunting license, the Migratory Game Bird Endorsement if you\'re 17 or older, HIP certification, and hunter education if you were born on or after Sept. 2, 1971.' },
    { q: 'Is dove good for a company outing?', a: 'It\'s the best one. See <a href="/corporate-hunts">corporate hunts</a>.' },
  ],
  sources: [SRC.dove, SRC.stamps, SRC.hip, SRC.plug, SRC.definitions, SRC.hunterEd],
};

export default hunt;
