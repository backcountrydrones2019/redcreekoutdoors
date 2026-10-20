/* Requirements shared by teal and duck pages. Kept short on purpose: the two
   pages carry different sections and FAQs so they don't read as one page. */
import { SRC, HUNTER_ED, LICENSE } from './sources';

export const WATERFOWL_REQUIREMENTS = [
  LICENSE,
  { text: 'Migratory Game Bird Endorsement if you\'re 17 or older.', source: SRC.stamps },
  { text: 'Federal Duck Stamp if you\'re 16 or older. The digital stamp on your license counts.', source: SRC.stamps },
  { text: 'HIP certification. Get it whatever your age.', source: SRC.hip },
  HUNTER_ED,
  { text: 'Non-toxic shot only. Lead is illegal for waterfowl anywhere in Texas.', source: SRC.birdMethods },
  { text: 'A shotgun plugged to three shells.', source: SRC.plug },
];
