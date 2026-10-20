import type { Hunt } from '../types';
import { PRICES } from '../../consts';
import { SRC } from './sources';
import { WATERFOWL_REQUIREMENTS } from './waterfowl';

const hunt: Hunt = {
  slug: 'duck-hunts',
  name: 'Duck Hunts',
  title: 'Guided Duck Hunts in Central Texas | Red Creek Outdoors',
  h1: 'Guided Duck Hunts',
  description: 'Guided duck hunts in the Texas North Zone near Killeen, Temple and Gatesville. $400 a gun per day. Season opens Nov. 14, 2026. Shotguns available.',
  lede: `Regular season ducks on private Central Texas ground. ${PRICES.duck.text}.`,
  card: 'Guided duck hunts on private ground in the regular North Zone season.',
  priceText: PRICES.duck.text,
  offers: [{ name: 'Duck hunt', amount: PRICES.duck.amount, unit: 'per gun per day' }],
  whenShort: 'Nov. 14 to 29 and Dec. 5, 2026 to Jan. 31, 2027 (North Zone)',
  sections: [
    {
      h2: 'Cold mornings, real birds',
      paras: [
        'Duck hunting is a morning game. You\'re set up before shooting light and the best of it is usually over by mid-morning. Your guide handles the spread and the calling. You handle the shooting.',
      ],
    },
    {
      h2: '2026-27 duck season, North Zone',
      paras: ['Bell, Coryell, Milam and Falls counties are in TPWD\'s North Zone.'],
      list: [
        'Youth, veteran and active military days: Nov. 7 and 8, 2026',
        'Regular season: Nov. 14 to 29, 2026, and Dec. 5, 2026 to Jan. 31, 2027',
        'Daily bag: 6 ducks, with species limits (5 mallards, only 2 hens; 3 wood ducks; 3 pintail; 2 redheads; 2 canvasback; 1 scaup; 1 dusky duck, which opens Nov. 19)',
        'Shooting hours: half an hour before sunrise to sunset',
      ],
    },
  ],
  requirements: WATERFOWL_REQUIREMENTS,
  faq: [
    { q: 'When does duck season open near Killeen?', a: 'The North Zone regular season opens Nov. 14, 2026, per TPWD. Youth, veteran and active military days are Nov. 7 and 8.' },
    { q: 'How much is a guided duck hunt?', a: `${PRICES.duck.text}. Shotgun and shells available at the same price.` },
    { q: 'Can I use lead shot?', a: 'No. Non-toxic shot is required for waterfowl anywhere in Texas.' },
    { q: 'I\'m active duty at Fort Hood. Can I hunt the special days?', a: 'Nov. 7 and 8, 2026 are TPWD\'s youth, veteran and active military days in the North Zone. Call and we\'ll check what\'s open.' },
  ],
  sources: [SRC.duck, SRC.stamps, SRC.hip, SRC.birdMethods, SRC.plug, SRC.definitions],
};

export default hunt;
