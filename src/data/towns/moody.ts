import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-moody-tx',
  town: 'Moody',
  county: 'McLennan',
  title: 'Hog Trapping Moody TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Moody, TX',
  description: 'Feral hog trapping around Moody in southern McLennan County. Cow Bayou headwaters, Leon River bottoms and corn ground. From $800. Call 254-397-8938.',
  lede: 'Moody sits between Leon River bottomland and some of the most productive corn ground in McLennan County. Hogs work both.',
  summary: 'Southern McLennan County corn ground near the Leon River.',
  facts: [
    { label: 'County', value: 'McLennan, at State Highway 317 and FM 107' },
    { label: 'Water hogs use', value: 'South Cow Bayou headwaters north of town, the Leon River at Mother Neff State Park' },
    { label: 'Ground', value: 'Grand Prairie and Blackland Prairie, split by the Balcones Fault across the county' },
    { label: 'Drive from Killeen', value: 'About 36 miles, under an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['mcgregor', 'temple', 'gatesville', 'belton'],
  sections: [
    {
      h2: 'A railroad town that kept its farms',
      paras: [
        'Moody was founded in 1881 on the Santa Fe line and named for W. L. Moody, per the Handbook of Texas. Many of its first residents moved down from Perry, about two miles north, after the railroad passed Perry by. It incorporated in 1901 and had about 1,400 people in 2021.',
        'What hasn\'t changed is the farming. In the 2022 Census of Agriculture, McLennan County had 3,140 farms on 552,280 acres, with 222,668 acres of cropland, 45,873 acres of grain corn and 86,476 cattle. Farm sales topped $210 million.',
      ],
    },
    {
      h2: 'Two prairies and a fault',
      paras: [
        'McLennan County is part Grand Prairie and part Blackland Prairie, and the Balcones Fault runs southwest to northeast across it, per the Handbook and AgriLife Extension. The whole county drains to the Brazos.',
        'That split matters for a landowner. Blackland ground grows the corn and grain that pull hogs out of cover. Grand Prairie ground, with its cedar, oak and stony slopes, gives them somewhere to bed. Around Moody, both kinds of country are close together.',
      ],
    },
    {
      h2: 'Cow Bayou and the Leon',
      paras: [
        'South Cow Bayou begins about four miles north of Moody and runs southeast 18 miles. Cow Bayou carries on east to the Brazos in Falls County, according to the Handbook. To the west, the Leon River runs through Mother Neff State Park, which has a Moody address and Leon River bottomland rising from 610 to 790 feet, per Texas Parks and Wildlife.',
        'Bayou headwaters and river bottoms are where the cover and water are. Hogs bed there and travel out to the fields at night. If your farm has a bayou draw or a creek running through it, that\'s likely their lane.',
      ],
    },
    {
      h2: 'How we work Moody farms',
      paras: [
        'Corn ground gets trapped on the crop calendar. Before planting and after harvest, bait pulls hardest because there\'s little else to eat. During the season we trap the edges and the crossings out of the bottoms.',
        'Bait goes down under a cellular camera, the whole sounder gets conditioned to it, the trap goes up in stages, and the gate drops from a phone when the last hog walks in. Then hogs go out alive to a buying station or are dispatched on site, depending on the market and the situation.',
      ],
      list: [
        'Corn, grain and hay ground around Moody',
        'Cattle pasture in southern McLennan County',
        'Farms along the Cow Bayou draws',
        'Land near the Leon River bottoms',
      ],
    },
    {
      h2: 'Signs on a grain farm',
      paras: [
        'Walk the field edge closest to the nearest timber or draw. That corner usually gets hit first. After planting, look for seed rooted out down the row. In standing corn, look for stalks pulled down where a group fed in one spot. In hay ground, look for torn-up patches that will tear up equipment at the next cutting.',
        'The blackland side of the county holds tracks well after rain, so a morning walk after a shower shows how many hogs are coming and which way they enter.',
      ],
    },
    {
      h2: 'Getting there',
      paras: [
        'Moody is about 36 miles from Killeen, a little under an hour. State Highway 317 runs through town north toward McGregor and south toward Belton, which makes it an easy run from our side of Bell County.',
      ],
    },
    {
      h2: 'McLennan County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s McLennan County office is at 4224 Cobbs Drive in Waco, (254) 757-5180. It handles crop and land questions for the county. When you want hogs trapped and off your place, call us.',
      ],
    },
  ],
  faq: [
    { q: 'How much does hog trapping cost near Moody?', a: 'Trapping starts at $800. Acreage, access and how many hogs are working your ground set the final price, in writing first.' },
    { q: 'When should I trap my corn ground?', a: 'Before planting or right after harvest, when the field is bare and bait works best. During the season we trap the edges.' },
    { q: 'Do you cover McGregor and Bruceville-Eddy too?', a: 'Call with the location. Southern and western McLennan County is in our range out of Killeen.' },
    { q: 'Hogs are coming off the Leon. Where do you trap?', a: 'On your property, at the trail where they come up out of the bottom.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Moody', url: 'https://www.tshaonline.org/handbook/entries/moody-tx' },
    { label: 'Handbook of Texas, Cow Bayou', url: 'https://www.tshaonline.org/handbook/entries/cow-bayou-mclennan-county' },
    { label: 'Handbook of Texas, McLennan County', url: 'https://www.tshaonline.org/handbook/entries/mclennan-county' },
    { label: 'Texas Historical Commission, Moody marker', url: 'https://atlas.thc.texas.gov/Details/5309003448' },
    { label: 'TPWD, Mother Neff State Park', url: 'https://tpwd.texas.gov/state-parks/mother-neff' },
    { label: 'USDA NASS 2022 Census of Agriculture, McLennan County', url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/Online_Resources/County_Profiles/Texas/cp48309.pdf' },
    { label: 'Texas A&M AgriLife Extension, McLennan County', url: 'https://agrilifeextension.tamu.edu/counties/mclennan/' },
  ],
};

export default town;
