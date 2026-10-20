import type { Hunt } from '../types';
import { SRC } from './sources';
import { WATERFOWL_REQUIREMENTS } from './waterfowl';

/* Goose hunts confirmed offered by Justin 2026-10-20. No price on file yet:
   priceText stays "Call for pricing" and offers stays empty until a number
   goes into consts PRICES. Zones from the TPWD goose page (IH-35 is the
   Western/Eastern line). TPWD's Light Goose Conservation Order page was last
   valid for 2023-24, so no conservation order dates or rules on this page. */
const hunt: Hunt = {
  slug: 'goose-hunts',
  name: 'Goose Hunts',
  title: 'Guided Goose Hunts in Central Texas | Red Creek Outdoors',
  h1: 'Guided Goose Hunts',
  description: 'Guided snow, blue and dark goose hunts on private land near Killeen, Temple and Marlin. Season opens Nov. 7, 2026 in both Texas goose zones.',
  lede: 'Light and dark geese on private Central Texas ground, on both sides of I-35. Call for pricing.',
  card: 'Snows, blues and dark geese on private ground, Nov. 7 into February.',
  priceText: 'Call for pricing',
  offers: [],
  whenShort: 'Nov. 7, 2026 into February 2027, depending on zone and species',
  sections: [
    {
      h2: 'Two zones, one crew',
      paras: [
        'Interstate 35 splits Texas into two goose zones, and our ground sits on both sides of it. Coryell County and the Killeen side of Bell County are in the Western Zone. Milam, Falls and Bell County east of I-35 are in the Eastern Zone. The dates and bag limits change with the zone, so we tell you which rules apply when we book the hunt.',
        'Your guide runs the setup and the calling. You shoot. Bring a shotgun or use ours. The price is the same.',
      ],
    },
    {
      h2: '2026-27 goose seasons',
      paras: ['Per TPWD for the 2026-27 season. Shooting hours in both zones are a half hour before sunrise to sunset.'],
      list: [
        'Western Zone, dark and light geese: Nov. 7, 2026 to Feb. 7, 2027. Daily bag 5 dark geese and 5 light geese.',
        'Eastern Zone, dark geese: Nov. 7, 2026 to Jan. 31, 2027. Daily bag 5, no more than 2 white-fronted geese.',
        'Eastern Zone, light geese: Nov. 7, 2026 to Feb. 19, 2027. Daily bag 5.',
        'Eastern Zone, early Canada geese: Sept. 12 to 27, 2026 (closed for this year).',
        'Possession limit: three times the daily bag.',
      ],
    },
  ],
  requirements: WATERFOWL_REQUIREMENTS,
  faq: [
    { q: 'When does goose season open near Killeen?', a: 'Nov. 7, 2026 for both light and dark geese, in both the Western and Eastern zones, per TPWD.' },
    { q: 'How much is a guided goose hunt?', a: 'Call 254-397-8938 for the price and open dates. Guns and shells are there if you need them.' },
    { q: 'Which goose zone is Killeen in?', a: 'The Western Zone. TPWD draws the line along I-35, so Killeen and Coryell County are west of it, and Milam, Falls and Bell County east of I-35 are in the Eastern Zone.' },
    { q: 'Do I need a duck stamp for geese?', a: 'Yes, if you\'re 16 or older. Geese are waterfowl, so you need the Federal Duck Stamp, HIP, the Migratory Game Bird Endorsement if you\'re 17 or older, and non-toxic shot. See <a href="/faq#birds">licenses and FAQ</a>.' },
  ],
  sources: [SRC.goose, SRC.stamps, SRC.hip, SRC.birdMethods, SRC.plug],
};

export default hunt;
