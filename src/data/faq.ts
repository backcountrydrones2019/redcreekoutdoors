/* Licenses, tags and what-to-bring FAQ for /faq.
 *
 * Every regulatory answer was checked on 2026-10-20 against the TPWD, USFWS
 * or TAHC page linked in its `src`. TPWD rules turn over every Sept. 1:
 * re-check this file every August with the hunt files (sources.ts header).
 * Don't add an answer that isn't on an official page. Things TPWD doesn't
 * address (thermal optics, screenshots of a license) stay out.
 */
import { SRC } from './hunts/sources';
import { DEPOSIT } from '../consts';
import type { Source } from './types';

export type FaqItem = { q: string; a: string; src?: Source[] };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const FAQ_CHECKED = 'Oct. 20, 2026';

export const FAQ: FaqGroup[] = [
  {
    id: 'digital-or-paper',
    title: 'Digital or paper license',
    items: [
      {
        q: 'Can I show my Texas hunting license on my phone?',
        a: 'Yes. A digital license lives in the Texas Hunt & Fish app and you show it there. If you bought a paper license, TPWD lets you show an electronic copy of it, but anything that has to be tagged still gets the paper tag off that license.',
        src: [SRC.paperDigital],
      },
      {
        q: 'What still has to be on paper?',
        a: 'With a paper license, the deer tag is paper and it goes on the deer. With a digital license, you tag the deer in the app and you still attach a handwritten note to the carcass (see deer tags below). Everything else, like hogs, doves and ducks, needs no tag.',
        src: [SRC.paperDigital, SRC.digitalTags],
      },
      {
        q: 'How do I get a digital license?',
        a: 'Buy it online and pick digital. Digital licenses are sold online only, and no paper license or tags get mailed. Once you have a digital license, anything else you add for the year has to be bought online too.',
        src: [SRC.paperDigital],
      },
      {
        q: 'I bought my license online last night. Can I hunt today?',
        a: 'A digital license works as soon as it syncs to the Texas Hunt & Fish app. A paper license bought online gets mailed. Until it shows up, the emailed receipt covers hunting that needs no tags. For a deer hunt on a paper license, you need the physical license and its tags in hand.',
        src: [SRC.purchaseReq, SRC.licenseFaq],
      },
      {
        q: 'Did anything change this year about buying a license?',
        a: 'Yes. Starting Aug. 3, 2026, anyone 17 or older has to show valid ID to get a license. At a store that means you, in person, with ID. An unexpired REAL ID from any state works. Online, each license holder\'s ID gets checked separately. Carry your ID on you while you hunt.',
        src: [SRC.purchaseReq],
      },
      {
        q: 'Where do I buy a license?',
        a: 'Online through TPWD, at a license retailer, or at a TPWD office. Do it before the hunt, not in the truck on the way out.',
        src: [SRC.onlineSales],
      },
    ],
  },
  {
    id: 'deer-tags',
    title: 'Deer tags and bringing a deer home',
    items: [
      {
        q: 'How do I tag a deer with a paper license?',
        a: 'Fill the tag out legibly, cut out the month and day, and attach it right away, before you field dress or move the deer. Fill in the harvest log on the back of the license in ink. The tag stays on until the deer reaches its final destination and is quartered.',
        src: [SRC.tagDeer],
      },
      {
        q: 'How does a digital deer tag work?',
        a: 'Tag the deer in the Texas Hunt & Fish app the moment you take it. It works with no signal and saves as unsubmitted until you have service. You also have to attach a handwritten note to the carcass. With service, write the confirmation number the app gives you. Without service, write your first and last name, your license customer number from the app, and the date and time. Download the app and your tags before you leave the house.',
        src: [SRC.digitalTags],
      },
      {
        q: 'Do I have to report a deer harvest in Bell, Coryell, Milam or Falls County?',
        a: 'No. TPWD\'s mandatory deer harvest reporting counties don\'t include any of the four. You still tag every deer.',
        src: [SRC.tagDeer, SRC.bell, SRC.coryell, SRC.milam, SRC.falls],
      },
      {
        q: 'What bucks are legal here?',
        a: 'All four counties have antler restrictions. A legal buck has at least one unbranched antler or an inside spread of 13 inches or more. You can take two legal bucks, and only one of them can be 13 inches or wider.',
        src: [SRC.bell, SRC.coryell, SRC.milam, SRC.falls],
      },
      {
        q: 'What\'s the deer bag limit?',
        a: 'Bell County west of I-35 and Coryell County: five deer, no more than two bucks. Bell County east of I-35, Milam and Falls: four deer, no more than two bucks and two antlerless. Antlerless rules run by date in each county, so check the county page for your hunt dates.',
        src: [SRC.bell, SRC.coryell, SRC.milam, SRC.falls],
      },
      {
        q: 'What do I need to drive a deer home?',
        a: 'The tag and proof of sex stay with the deer to its final destination, which is your home or a processor. For a buck that\'s the head with antlers, or the tail plus the skull cap with antlers. You can quarter it into four quarters and two backstraps, but the tag and proof of sex ride with the meat. Handing meat to someone else before then takes a Wildlife Resource Document.',
        src: [SRC.afterDeer, SRC.proofSex],
      },
    ],
  },
  {
    id: 'birds',
    title: 'Dove, teal, duck and goose',
    items: [
      {
        q: 'What do I need for a dove hunt?',
        a: 'A Texas hunting license, HIP certification, and the Migratory Game Bird Endorsement if you\'re 17 or older. Shotgun plugged to three shells. No duck stamp and no non-toxic shot rule for doves.',
        src: [SRC.stamps, SRC.hipTx, SRC.birdMethods],
      },
      {
        q: 'What do I need for a teal, duck or goose hunt?',
        a: 'Everything for doves, plus a Federal Duck Stamp if you\'re 16 or older and non-toxic shot only. No lead anywhere in Texas for waterfowl. Shotgun plugged to three shells.',
        src: [SRC.stamps, SRC.birdMethods, SRC.plug],
      },
      {
        q: 'Can my Federal Duck Stamp be digital?',
        a: 'Yes. Buy it with your Texas license and it\'s printed on a paper license or validated on a digital one, good for the whole waterfowl season. Digital license holders show it in the Texas Hunt & Fish app. The physical stamp comes in the mail later. If you\'re hunting on the physical stamp alone, sign it across the face and carry it.',
        src: [SRC.endorsements, SRC.digitalTags, SRC.eStamp],
      },
      {
        q: 'How do I get HIP certified?',
        a: 'Answer the HIP questions when you buy your license, and "HIP" shows on your license. Every migratory bird hunter needs it, youth included.',
        src: [SRC.hipTx],
      },
      {
        q: 'Do I leave a wing on my birds for the drive home?',
        a: 'For ducks, teal and geese, yes. One fully feathered wing or the head stays on each dressed bird until you get home. Texas exempts doves from that rule.',
        src: [SRC.birdRules],
      },
    ],
  },
  {
    id: 'hogs-predators',
    title: 'Hogs and predators',
    items: [
      {
        q: 'Do I need a license to hunt hogs?',
        a: 'Not on private land with the landowner\'s permission, and that holds for out-of-state hunters too. Hunter education still applies if you were born on or after Sept. 2, 1971.',
        src: [SRC.nongame, SRC.hunterEd],
      },
      {
        q: 'Do I need a license to hunt coyotes?',
        a: 'Bring one. TPWD\'s no-license exception covers only depredating coyotes on private land with the landowner\'s permission. Other coyote and predator hunting takes a Texas hunting license.',
        src: [SRC.nongame],
      },
      {
        q: 'Is it legal to hunt hogs and coyotes at night?',
        a: 'Yes, on private property. TPWD says nongame can be hunted by any lawful means on private property, with no closed season and no bag limit. The night and artificial light bans cover game animals and game birds. Deer hours run a half hour before sunrise to a half hour after sunset. Doves and ducks run a half hour before sunrise to sunset.',
        src: [SRC.nongame, SRC.meansMethods, SRC.definitions, SRC.birdRules],
      },
      {
        q: 'Can I take a trapped hog home alive?',
        a: 'No. Moving and releasing live feral hogs is illegal unless it follows Texas Animal Health Commission rules, which allow trapped hogs to go only to a slaughter facility, an approved holding facility or an authorized hunting preserve. Our trapping crew handles that side.',
        src: [SRC.nongame, SRC.tahcMove],
      },
      {
        q: 'Do you use drones to find animals on a hunt?',
        a: 'No. TPWD makes it unlawful to use drones to hunt or locate wildlife without a permit, or to find wounded game. Our hunts don\'t use them.',
        src: [SRC.meansMethods],
      },
    ],
  },
  {
    id: 'hunter-ed',
    title: 'Hunter education',
    items: [
      {
        q: 'Who needs hunter education in Texas?',
        a: 'Anyone born on or after Sept. 2, 1971, resident or not. The youngest you can certify is 9. Hunters 9 through 16 must be certified or hunt with a licensed hunter 17 or older within normal voice control. Texas accepts hunter education from every other state.',
        src: [SRC.hunterEdFaq],
      },
      {
        q: 'Can I show my hunter education on my phone?',
        a: 'Yes. TPWD accepts the printed certificate, your hunting license number, the TPWD app, or a photo of the card.',
        src: [SRC.hunterEdFaq],
      },
      {
        q: 'I never took hunter education. Can I still hunt?',
        a: 'If you\'re 17 or older, buy the one-time deferral. It\'s good through the end of that license year, you have to hunt accompanied, and you only get it once. Then take the course.',
        src: [SRC.hunterEdFaq],
      },
    ],
  },
  {
    id: 'out-of-state-military-youth',
    title: 'Out of state, military and youth',
    items: [
      {
        q: 'I live out of state. What do I need for a deer hunt?',
        a: 'The General Non-Resident Hunting License. It\'s the only license that lets a non-resident hunt deer. The five-day non-resident special license doesn\'t cover deer. For hogs on private land with permission, you don\'t need a license.',
        src: [SRC.licenseFaq, SRC.licenses, SRC.nongame],
      },
      {
        q: 'I\'m stationed at Fort Hood. Do I buy a resident license?',
        a: 'Yes. TPWD counts active duty service members and their dependents as Texas residents for licenses.',
        src: [SRC.purchaseReq],
      },
      {
        q: 'Is there a free license for active duty?',
        a: 'Texas residents on full-time active military service get the Active Duty Super Combo free. Get it in person at a license retailer with proof of service. The Federal Duck Stamp isn\'t included.',
        src: [SRC.activeDuty],
      },
      {
        q: 'What about disabled veterans?',
        a: 'Veterans with a VA rating of 50% or higher, or loss of use of a foot or leg, who are receiving compensation get the Disabled Veteran Super Combo free, resident or not. It\'s in person only, with VA paperwork issued within the last 12 months. The duck stamp isn\'t included.',
        src: [SRC.disabledVet],
      },
      {
        q: 'What does my kid need?',
        a: 'The Youth Hunting License if they\'re under 17. Youth don\'t need the Migratory Game Bird Endorsement, but they still need HIP for birds and a duck stamp at 16. Hunter education rules apply by age (see above).',
        src: [SRC.licenses, SRC.stamps],
      },
    ],
  },
  {
    id: 'booking',
    title: 'Booking with Red Creek',
    items: [
      {
        q: 'Is there a deposit?',
        a: `${DEPOSIT.rule} That goes for hunts and for hog trapping site assessments.`,
      },
      {
        q: 'Do I need my own gun?',
        a: 'No. Use ours or bring yours. The price is the same either way.',
      },
    ],
  },
];
