import type { Hunt } from '../types';
import { PRICES } from '../../consts';
import { SRC, HUNTER_ED } from './sources';

const hunt: Hunt = {
  slug: 'thermal-hog-hunts',
  name: 'Thermal Hog Hunts',
  title: 'Thermal Hog Hunts in Central Texas | Red Creek Outdoors',
  h1: 'Guided Thermal Hog Hunts',
  description: 'Guided thermal hog hunts at night on private Central Texas land near Killeen. From $500 a night. Guns and ammo available. No license needed for hogs.',
  lede: `Night hunts on private ground where the hogs are doing real damage. ${PRICES.thermalHog.text}.`,
  card: 'Night hunts under thermal optics on private ground where the hogs are doing real damage.',
  priceText: PRICES.thermalHog.text,
  offers: [{ name: 'Thermal hog hunt', amount: PRICES.thermalHog.amount, unit: 'per night, starting price' }],
  whenShort: 'Year-round, after dark',
  sections: [
    {
      h2: 'Why these hunts exist',
      paras: [
        'Every property we hunt is one where a landowner wants hogs gone. Our traps take the sounders. The hogs that won\'t go in a trap, mostly old boars and the stragglers, get hunted. That\'s you.',
        'So this isn\'t a high fence with pigs on a feeder. It\'s working ranch and farm ground in Central Texas, at night, with hogs that have a reason to be careful.',
      ],
    },
    {
      h2: 'How the night goes',
      paras: [
        'You meet your guide, go over the gun, the ground and the safety rules, and head out once it\'s dark. Thermal shows heat through the black: every hog, and every cow, deer and person, so nothing gets shot that shouldn\'t. Your guide calls the shot with you.',
        'First time at night? Good. Most of our hunters have never looked through thermal before, and a guide beside you the whole time is the point.',
      ],
      list: [
        'Private land near Salado, Marlin, Gatesville, Rogers and Holland',
        'Guided start to finish',
        'Rifle and ammo provided if you want them, at the same price',
      ],
    },
    {
      h2: 'Bring this',
      paras: ['Dark clothes, boots you can walk a pasture in, a warm layer from November on, and water. If you\'re bringing your own rifle, bring it zeroed.'],
    },
  ],
  requirements: [
    { text: 'No hunting license is required to hunt feral hogs on private property with landowner authorization. We have it on every place we hunt.', source: SRC.nongame },
    HUNTER_ED,
  ],
  faq: [
    { q: 'Do I need a hunting license to hunt hogs in Texas?', a: 'Not on private land with landowner authorization, per Texas Parks and Wildlife. Hunter education rules still apply if you were born on or after Sept. 2, 1971.' },
    { q: 'How much is a thermal hog hunt?', a: `${PRICES.thermalHog.text}. Your exact price and date are confirmed in writing when you book.` },
    { q: 'Can I use my own rifle?', a: "Yes. Or use ours. The price doesn't change either way." },
    { q: 'When can I hunt?', a: 'We hunt hogs year-round. Summer nights are short and hot. Winter nights are long and cold, so dress for it.' },
    { q: 'Can we bring a group?', a: 'Yes. Call with your headcount. For companies, see <a href="/corporate-hunts">corporate hunts</a>.' },
  ],
  sources: [SRC.nongame, SRC.hunterEd],
};

export default hunt;
