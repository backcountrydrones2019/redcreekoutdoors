import type { Hunt } from '../types';
import { PRICES } from '../../consts';
import { SRC, HUNTER_ED, LICENSE } from './sources';

const hunt: Hunt = {
  slug: 'whitetail-deer-hunts',
  name: 'Whitetail Deer Hunts',
  title: 'Guided Whitetail Deer Hunts in Central Texas | Red Creek Outdoors',
  h1: 'Guided Whitetail Hunts',
  description: 'Guided whitetail doe and buck hunts on private Central Texas land near Killeen. Does from $700 a day, bucks from $1,500. Guns available at the same price.',
  lede: `Doe and buck hunts on private ground in the Texas season. ${PRICES.whitetailDoe.text}. ${PRICES.whitetailBuck.text}.`,
  card: 'Guided doe and buck hunts on private Central Texas land in the Texas season.',
  priceText: `${PRICES.whitetailDoe.text}. ${PRICES.whitetailBuck.text}`,
  offers: [
    { name: 'Whitetail doe hunt', amount: PRICES.whitetailDoe.amount, unit: 'per day, starting price' },
    { name: 'Whitetail buck hunt', amount: PRICES.whitetailBuck.amount, unit: 'per day, starting price' },
  ],
  whenShort: 'General season Nov. 7, 2026 to Jan. 3, 2027 (North Zone)',
  sections: [
    {
      h2: 'Two hunts, two prices',
      paras: [
        'A doe hunt fills the freezer and is the best first deer hunt there is. A buck hunt is for the hunter who wants a mature deer and is willing to pass on the rest. Both are guided, both are on private ground, and both prices are right here.',
      ],
    },
    {
      h2: '2026-27 season in our counties',
      paras: [
        'Bell, Coryell, Milam and Falls counties are all in the North Zone. TPWD dates for this season:',
      ],
      list: [
        'Archery: Oct. 3 to Nov. 6, 2026',
        'General: Nov. 7, 2026 to Jan. 3, 2027',
        'Youth only: Oct. 30 to Nov. 1, 2026 and Jan. 4 to 17, 2027',
        'In all four counties, only one buck in your bag may have an inside spread of 13 inches or greater',
      ],
    },
    {
      h2: 'Doe rules depend on the property',
      paras: [
        'Bag limits and when you can take antlerless deer on a license tag differ by county, and in Bell County by which side of IH-35 you\'re on. Some places hunt under TPWD management permits with their own tags. We\'ll tell you the rules for the exact property you hunt before you book, and the county pages are linked below so you can check us.',
      ],
    },
  ],
  requirements: [LICENSE, HUNTER_ED, { text: 'Tag your deer from your license, or with the property\'s management tag where one applies. Your guide will walk you through it.', source: SRC.licenses }],
  faq: [
    { q: 'How much is a guided whitetail hunt?', a: `${PRICES.whitetailDoe.text}. ${PRICES.whitetailBuck.text}. Exact price and dates confirmed in writing when you book.` },
    { q: 'When is deer season around Killeen?', a: 'Bell and Coryell counties are in the North Zone. For 2026-27, archery runs Oct. 3 to Nov. 6, 2026, and the general season Nov. 7, 2026 to Jan. 3, 2027, per TPWD.' },
    { q: 'Do I need my own rifle?', a: "No. Use ours or bring yours. The price doesn't change." },
    { q: 'Is this a good first deer hunt?', a: 'A doe hunt is the best first deer hunt there is. Your guide is with you the whole time.' },
  ],
  sources: [SRC.bell, SRC.coryell, SRC.milam, SRC.falls, SRC.licenses, SRC.hunterEd],
};

export default hunt;
