import type { Hunt } from '../types';
import { PRICES } from '../../consts';
import { SRC, HUNTER_ED, LICENSE } from './sources';

const hunt: Hunt = {
  slug: 'thermal-predator-hunts',
  name: 'Thermal Predator Hunts',
  title: 'Thermal Coyote and Predator Hunts in Texas | Red Creek Outdoors',
  h1: 'Guided Thermal Predator Hunts',
  description: 'Guided night coyote and predator hunts with thermal on private Central Texas ranches near Killeen. From $600 a night. Guns and ammo available.',
  lede: `Coyotes after dark on ranches that want them gone. ${PRICES.thermalPredator.text}.`,
  card: 'Coyotes after dark under thermal, on ranches that want them gone.',
  priceText: PRICES.thermalPredator.text,
  offers: [{ name: 'Thermal predator hunt', amount: PRICES.thermalPredator.amount, unit: 'per night, starting price' }],
  whenShort: 'Year-round, after dark',
  sections: [
    {
      h2: 'A different hunt than hogs',
      paras: [
        'Hogs come to food. Coyotes come to a problem they think they can solve, and they come in careful. A predator hunt is quieter, slower and more about the wind than a hog hunt. When it comes together, it comes fast.',
        'Landowners want them off for the calves, the fawns and the goats. That\'s why we have ground to hunt.',
      ],
    },
    {
      h2: 'How the night goes',
      paras: [
        'You and your guide go over the gun, the ground and the safety rules, then set up after dark. Thermal shows you what\'s coming before you could ever see it with your eyes, and lets you be sure of what you\'re looking at before the shot.',
        'Texas Parks and Wildlife lists coyotes and bobcats as nongame and says nongame "may be hunted at any time by any lawful means or methods on private property." We hunt private property only.',
      ],
      list: [
        'Private ranches near Salado, Marlin, Gatesville, Rogers and Holland',
        'Guided start to finish',
        'Rifle and ammo provided if you want them, at the same price',
      ],
    },
  ],
  requirements: [
    { text: 'A Texas hunting license. TPWD requires one to take nongame species, which includes coyotes and bobcats.', source: SRC.nongame },
    HUNTER_ED,
    { text: 'Bobcat pelts need a CITES pelt tag before they leave Texas.', source: SRC.nongame },
  ],
  faq: [
    { q: 'Do I need a license to hunt coyotes in Texas?', a: 'Yes, for a hunt like this one. TPWD requires a hunting license to take nongame species. Its exception for depredating coyotes is for landowners dealing with livestock loss, not guided hunts.' },
    { q: 'How much is a thermal predator hunt?', a: `${PRICES.thermalPredator.text}, confirmed in writing when you book.` },
    { q: 'Can I keep a bobcat?', a: 'If one comes in and it\'s legal to take, yes. A pelt leaving Texas needs a CITES tag first.' },
    { q: 'Can I bring my own gun?', a: "Yes. Or use ours. Same price either way." },
  ],
  sources: [SRC.nongame, SRC.licenses, SRC.hunterEd],
};

export default hunt;
