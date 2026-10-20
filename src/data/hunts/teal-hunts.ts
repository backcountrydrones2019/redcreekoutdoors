import type { Hunt } from '../types';
import { PRICES } from '../../consts';
import { SRC } from './sources';
import { WATERFOWL_REQUIREMENTS } from './waterfowl';

const hunt: Hunt = {
  slug: 'teal-hunts',
  name: 'Teal Hunts',
  title: 'Early Teal Hunts in Central Texas | Red Creek Outdoors',
  h1: 'Early Season Teal Hunts',
  description: 'Guided September teal hunts in Central Texas near Killeen. $350 a gun per day. The 2026 season is closed; get on the list for September 2027.',
  lede: `The first ducks of the year, in September heat. ${PRICES.teal.text}.`,
  card: 'The September early teal season, first ducks of the year.',
  priceText: PRICES.teal.text,
  offers: [{ name: 'Teal hunt', amount: PRICES.teal.amount, unit: 'per gun per day' }],
  whenShort: 'September. The 2026 season ran Sept. 19 to 27 and is closed',
  sections: [
    {
      h2: 'Fast, early and short',
      paras: [
        'Teal season is nine days in September. Bluewings come through in the heat, low and fast, and they don\'t give you long. Mosquitoes, sweat and the first decoy spread of the year. We\'ve been running teal hunts since our first season as an LLC.',
      ],
    },
    {
      h2: 'The 2026 season is over',
      paras: [
        'TPWD set the 2026 September teal season for Sept. 19 to 27, with a daily bag of 6 teal in the aggregate. The 2027 dates come out with next year\'s regulations. Call now and we\'ll put your group on the list for the first days we book.',
        'Want ducks sooner? The regular <a href="/duck-hunts">duck season</a> opens Nov. 14, 2026 in the North Zone.',
      ],
    },
  ],
  requirements: WATERFOWL_REQUIREMENTS,
  faq: [
    { q: 'When is teal season in Texas?', a: 'September. For 2026 it ran Sept. 19 to 27, per TPWD. 2027 dates come out with next season\'s regulations.' },
    { q: 'How much is a teal hunt?', a: `${PRICES.teal.text}. Shotgun and shells available at the same price.` },
    { q: 'Do I need a duck stamp for teal?', a: 'Yes, if you\'re 16 or older. Teal are waterfowl. Non-toxic shot too.' },
  ],
  sources: [SRC.duck, SRC.stamps, SRC.hip, SRC.birdMethods, SRC.plug],
};

export default hunt;
