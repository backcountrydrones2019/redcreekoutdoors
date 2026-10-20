import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-buckholts-tx',
  town: 'Buckholts',
  county: 'Milam',
  title: 'Hog Trapping Buckholts TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Buckholts, TX',
  description: 'Feral hog trapping for Buckholts and northwest Milam County. Blackland corn ground, Little River and Donahoe Creek bottoms. From $800. Call 254-397-8938.',
  lede: 'Blackland corn ground on the Little River. If there is a better setup for hogs in Milam County, we haven\'t seen it.',
  summary: 'Northwest Milam County blackland on the Little River.',
  facts: [
    { label: 'County', value: 'Northwest Milam, 9 miles northwest of Cameron' },
    { label: 'Water hogs use', value: 'The Little River and Donahoe Creek, which joins it about 6 miles west of town' },
    { label: 'Ground', value: 'Blackland Prairie' },
    { label: 'Drive from Killeen', value: 'About 42 miles, just under an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['temple', 'jarrell', 'belton', 'moody'],
  sections: [
    {
      h2: 'Settled for the soil',
      paras: [
        'Buckholts was founded in 1881 on the Santa Fe line and named for John A. Buckholts, who donated the land, per the Handbook of Texas. German, Austrian and Czech families came for its "blackland soils," and cotton was what the town shipped. It sits at FM 1915, State Highway 36 and U.S. 190, about nine miles northwest of Cameron.',
        'The Handbook describes Milam County as Blackland Prairie in the north and west, with Post Oak Savannah to the south and east. Buckholts is on the blackland side, and that soil is still the reason the country around it gets farmed.',
      ],
    },
    {
      h2: 'Corn and cattle',
      paras: [
        'In the 2022 Census of Agriculture, Milam County had 2,048 farms on 492,739 acres, with 133,510 acres of cropland, 29,961 acres of corn and 99,601 cattle. Farm sales ran $156.4 million.',
        'Corn is the problem crop for hogs. They dig planted seed out of the row, and when the ears hit the milk stage a sounder can flatten a corner of a field in a night. Blackland mud holds every track they leave doing it, so after a rain you can count how many came through.',
      ],
    },
    {
      h2: 'Two waterways close by',
      paras: [
        'The Little River forms in Bell County where the Leon and Lampasas meet and runs southeast about 75 miles to the Brazos, according to the Handbook. About six miles west of Buckholts, the old Bryant Station site on U.S. 190 marks a Little River crossing. Donahoe Creek, which starts near Jarrell, flows east 34 miles and joins the Little River in that same stretch.',
        'River and creek bottoms give hogs the shade and cover that open blackland doesn\'t. They bed down along the Little River and Donahoe Creek during the day and walk out onto the fields after dark. Where a trail leaves the bottom and hits a field edge is the spot we want.',
      ],
    },
    {
      h2: 'How we trap Buckholts ground',
      paras: [
        'On crop ground, timing is everything. The best window opens after harvest and before planting, when the field is bare and bait pulls hardest. During the growing season we work the field edges and the crossings out of the bottoms.',
        'The method doesn\'t change: bait under a cellular camera, condition the whole sounder, build the trap in stages, close it remotely when every hog is in. Then the hogs go out alive to a buying station or are dispatched on site, depending on the market and the situation.',
      ],
      list: [
        'Corn, grain and cotton ground',
        'Little River and Donahoe Creek bottoms',
        'Cattle pasture across northwest Milam County',
        'Commercial solar sites',
      ],
    },
    {
      h2: 'What corn damage looks like',
      paras: [
        'Right after planting, look for seed dug out in a straight line down the row, sometimes for a long stretch, as if someone ran a hoe through it. Later in the season look for stalks pulled down in a ring where the group fed in one place, chewed ears on the ground, and trails beaten into the edge rows from the nearest timber.',
        'Track the damage back toward cover. The corner of the field closest to the bottoms almost always gets hit first and hardest. That corner, and the trail into it, is where the trap goes.',
      ],
    },
    {
      h2: 'Distance',
      paras: [
        'Buckholts is about 42 miles from Killeen, just under an hour. U.S. 190 runs straight through. Cellular cameras mean we watch the bait every night and drive out for the work: building, closing and hauling.',
      ],
    },
    {
      h2: 'Milam County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s Milam County office is at 908 N. Crockett, Suite B, in Cameron, (254) 697-7045. It handles crop and land questions for the county. When you want the hogs trapped and gone, call us.',
      ],
    },
  ],
  faq: [
    { q: 'How much is hog trapping near Buckholts?', a: 'Trapping starts at $800. Acreage, access and how many hogs are working your fields set the final price, in writing first.' },
    { q: 'When is the best time to trap on crop ground?', a: 'After harvest and before planting, when the field is bare and bait pulls hardest. In season we work the field edges.' },
    { q: 'Do you cover Cameron and the rest of Milam County?', a: 'Milam County is one of our four core counties. Call with the location.' },
    { q: 'Hogs come off the river into my corn. Can you stop it?', a: 'We trap them at the crossing out of the bottom, before they reach the field. That trail is usually the best site on the place.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Buckholts', url: 'https://www.tshaonline.org/handbook/entries/buckholts-tx' },
    { label: 'Handbook of Texas, Milam County', url: 'https://www.tshaonline.org/handbook/entries/milam-county' },
    { label: 'Handbook of Texas, Little River', url: 'https://www.tshaonline.org/handbook/entries/little-river' },
    { label: 'Handbook of Texas, Donahoe Creek', url: 'https://www.tshaonline.org/handbook/entries/donahoe-creek-williamson-county' },
    { label: 'Texas Historical Commission, Bryant Station marker', url: 'https://atlas.thc.texas.gov/Details/5331007939' },
    { label: 'USDA NASS 2022 Census of Agriculture, Milam County', url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/Online_Resources/County_Profiles/Texas/cp48331.pdf' },
    { label: 'Texas A&M AgriLife Extension, Milam County', url: 'https://agrilifeextension.tamu.edu/counties/milam/' },
  ],
};

export default town;
