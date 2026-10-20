import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-mcgregor-tx',
  town: 'McGregor',
  county: 'McLennan',
  title: 'Hog Trapping McGregor TX | Red Creek Outdoors',
  h1: 'Hog Trapping in McGregor, TX',
  description: 'Feral hog trapping and removal around McGregor and western McLennan County. South Bosque headwaters, cedar and crop ground. From $800. Call 254-397-8938.',
  lede: 'Western McLennan County mixes cedar breaks, cropland and the head of the South Bosque. That mix keeps hogs fed and hidden. We take the whole group.',
  summary: 'Western McLennan County, where the South Bosque River starts.',
  facts: [
    { label: 'County', value: 'McLennan (western edge, toward Coryell)' },
    { label: 'Water hogs use', value: 'South Bosque River headwaters and the draws feeding it, stock tanks' },
    { label: 'Ground', value: 'Varied: shallow stony soils with cedar and oak, plus crop and hay ground' },
    { label: 'Drive from Killeen', value: 'About 41 miles, about an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['moody', 'gatesville', 'temple', 'jonesboro'],
  sections: [
    {
      h2: 'Two kinds of country in one county',
      paras: [
        'The Handbook of Texas puts McLennan County partly in the Grand Prairie and partly in the Blackland Prairie. The west side, where McGregor sits about 16 miles southwest of Waco on U.S. 84, has "varied terrain surfaced by shallow, stony soils that support mountain cedar and oak." County farm products in the 2002 count it cites include beef cattle, corn, wheat, hay, grain sorghum, soybeans and dairy.',
        'For hogs that\'s a good setup. Cedar gives them cover in the heat of the day, and grain and hay fields are a short walk away at night. A property out here can have both inside one fence.',
      ],
    },
    {
      h2: 'Where the South Bosque begins',
      paras: [
        'The South Bosque River rises south of McGregor, on ground that was once the Naval Industries Reserve Ordnance Plant, and flows northeast about 16 miles into Lake Waco, per the Handbook. Its headwaters run through what the Handbook calls "shallow stony clay loam" with juniper, oak and grass.',
        'Upper reaches of a river like that don\'t always carry much water, but the draws, seeps and stock tanks that feed it are where hogs drink and wallow. Find the wet spot nearest the cover, and the trails into it are usually obvious.',
      ],
    },
    {
      h2: 'The old ordnance plant ground',
      paras: [
        'In 1942 the Bluebonnet Ordnance Plant went up on 18,000 acres southwest of town, and McGregor\'s population tripled in three months, the Handbook records. After the war part of that land went to rocket engine work and much of the rest was sold or given to Texas A&M for an experimental farm. Today SpaceX runs a rocket engine test site in McGregor.',
        'Big blocks of land with limited access tend to hold hogs that move out onto the farms around them at night. If your place borders a large tract like that, you may be dealing with a steady supply rather than one sounder. That calls for a trap you reset and keep running, not a single catch.',
      ],
      list: [
        'Cropland and hay ground around McGregor',
        'Cedar and oak pasture on the stony west side',
        'Tracts along the South Bosque draws',
        'Commercial solar sites',
      ],
    },
    {
      h2: 'Getting here from Killeen',
      paras: [
        'McGregor is about 41 miles from Killeen, around an hour by road. State Highway 317 runs south from McGregor to Belton, which is the straight shot from our side of the county. Cellular cameras mean we\'re watching the bait every night without making the drive, and we come up to build and close.',
      ],
    },
    {
      h2: 'McLennan County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s McLennan County office is at 4224 Cobbs Drive in Waco, (254) 757-5180. If your ground is across the line in Coryell County, the Gatesville office, (254) 865-2414, covers it. AgriLife\'s Coping with Feral Hogs program explains every control method. For hogs trapped and gone, call us.',
      ],
    },
    {
      h2: 'Running a trap that keeps catching',
      paras: [
        'Next to big cover, one catch rarely finishes the job. When a property sits beside a large block of land that holds hogs, removing a sounder opens space that another group moves into within weeks. The answer is a trap site that stays active: catch, reset, condition the next group, catch again.',
        'We plan McGregor-area jobs that way from the start. The camera stays up, bait stays fresh, and we watch for the next group to find it. Between catches we look for a second site on the far side of the property, so pressure comes from more than one direction. Most landowners out here aren\'t trying to make hogs vanish forever, which isn\'t realistic next to good cover. They\'re trying to keep crop and pasture damage low enough that it stops costing them money. A trap that keeps running does exactly that.',
      ],
    },
  ],
  faq: [
    { q: 'Do you trap hogs in McGregor?', a: 'Yes. Western McLennan County is in our regular range out of Killeen, about an hour up the road.' },
    { q: 'What does it cost?', a: 'Hog trapping starts at $800. Acreage, access and how many hogs keep coming set the final price, in writing first.' },
    { q: 'I catch a few and more show up. Why?', a: 'You\'re probably next to a big block of cover that keeps refilling your place. That takes a trap that stays running and gets reset, not a single catch.' },
    { q: 'Can you cover Moody and Crawford too?', a: 'Call with the location. If it\'s in western McLennan or Coryell County, odds are good.' },
  ],
  sources: [
    { label: 'Handbook of Texas, McGregor', url: 'https://www.tshaonline.org/handbook/entries/mcgregor-tx' },
    { label: 'Handbook of Texas, McLennan County', url: 'https://www.tshaonline.org/handbook/entries/mclennan-county' },
    { label: 'Handbook of Texas, South Bosque River', url: 'https://www.tshaonline.org/handbook/entries/south-bosque-river' },
    { label: 'KWTX, SpaceX McGregor facility', url: 'https://www.kwtx.com/2026/07/31/spacex-mcgregor-facility-central-americas-return-moon-nasa-chief-says/' },
    { label: 'Texas A&M AgriLife Extension, McLennan County', url: 'https://agrilifeextension.tamu.edu/counties/mclennan-county/' },
    { label: 'Texas A&M AgriLife, Feral Hog Management', url: 'https://feralhogs.tamu.edu/feral-hog-management/' },
  ],
};

export default town;
