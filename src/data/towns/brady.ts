import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-brady-tx',
  town: 'Brady',
  county: 'McCulloch',
  title: 'Hog Trapping Brady TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Brady, TX',
  description: 'Feral hog trapping for Brady and McCulloch County ranches on the northern Edwards Plateau. Brady Creek and big pasture country. From $800. 254-397-8938.',
  lede: 'Big pasture country near the center of Texas. Brady is a long drive from Killeen, and we make it for landowners who want the whole sounder gone.',
  summary: 'Northern Edwards Plateau ranch country on Brady Creek.',
  facts: [
    { label: 'County', value: 'McCulloch (county seat)' },
    { label: 'Water hogs use', value: 'Brady Creek through town, Brady Creek Reservoir 3 miles west, the San Saba and Colorado rivers' },
    { label: 'Ground', value: 'Edwards Plateau, rolling to hilly, cut by the Brady Mountains' },
    { label: 'Drive from Killeen', value: 'About 108 miles, roughly two hours' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['lampasas', 'copperas-cove', 'killeen', 'gatesville'],
  sections: [
    {
      h2: 'Heart of Texas',
      paras: [
        'The geographic center of Texas sits about 16 miles northeast of Brady, according to the Handbook of Texas, and AgriLife Extension calls McCulloch County the "Heart of Texas." The town started as Brady City, named for the creek, became county seat in 1876 and shortened its name when it incorporated in 1906.',
        'This is a different kind of country from the blackland and river bottoms around Killeen. The Handbook describes McCulloch County as Edwards Plateau, rolling to hilly, between 1,350 and 2,000 feet, with the Brady Mountains running east to west and cut by Salt, Cow and Onion gaps.',
      ],
    },
    {
      h2: 'Brady Creek and the reservoir',
      paras: [
        'Brady Creek runs right through town. It rises in Concho County and flows east about 90 miles to the San Saba River, per the Handbook. Three miles west of town, the city-owned Brady Creek Reservoir, finished in 1963, holds about 30,430 acre-feet over 2,020 acres, according to the Texas Water Development Board. The Colorado River forms the county\'s north edge, and Calf Creek and Lost Creek are named among its other drainages.',
        'In plateau country, water is the limiting thing for hogs. Find the reliable water on or near your place, a creek, a spring, the reservoir shoreline next door or a stock tank that holds through summer, and you\'ve found where they spend their nights.',
      ],
    },
    {
      h2: 'Pasture, wheat and livestock',
      paras: [
        'In the 2022 Census of Agriculture, McCulloch County had 562 farms on 547,959 acres, 402,625 of them pasture, with 18,035 cattle and 12,070 acres of wheat. Livestock made up 88 percent of farm sales. AgriLife lists cattle, sheep, goats and hogs among the county\'s products.',
        'On ranches this size, the damage spreads thin and adds up. Rooted pasture along every draw, wheat fields grazed and torn up, tanks turned to mud, and water gaps knocked down. Goat and sheep operations also see hogs crowd feeders and troughs.',
      ],
    },
    {
      h2: 'How we handle the distance',
      paras: [
        'Brady is about 108 miles from our Killeen base, roughly two hours on the road. We won\'t pretend that\'s around the corner. It changes how we schedule, not how we trap.',
        'Cellular cameras on the bait let us watch every night from home. We drive out to set up, to build once the whole sounder is coming in, to close the gate and to haul. Between those trips the camera does the checking. When the gate drops, hogs go out alive to a buying station or are dispatched on site, depending on the market and the situation.',
      ],
      list: [
        'Large cattle ranches',
        'Wheat and small grain ground',
        'Sheep and goat operations',
        'Ranches along Brady Creek and the San Saba',
      ],
    },
    {
      h2: 'Where to look on plateau ground',
      paras: [
        'Start at water and work out. Around a tank or creek crossing, look for wallows, rubs on the nearest posts and trees, and rooting in the soft ground nearby. Then follow the trails. On hilly ground hogs take the gaps and the gentlest grades between bedding cover and water, so the same few paths get used every night.',
        'A good photo of fresh sign at your main water source, plus a rough idea of acreage and road access, lets us plan the trip before we make it.',
      ],
    },
    {
      h2: 'McCulloch County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s McCulloch County office is at 114 W. Main St. in Brady, (325) 597-1295. It covers range, livestock and wildlife questions in the county. When you want hogs trapped and hauled, call us.',
      ],
    },
  ],
  faq: [
    { q: 'Do you really trap as far out as Brady?', a: 'Yes. It\'s about two hours from Killeen. Cellular cameras mean we only make the drive when there\'s work to do.' },
    { q: 'What does hog trapping cost in McCulloch County?', a: 'Trapping starts at $800. Acreage, access, distance and hog numbers set the final price, in writing before we start.' },
    { q: 'I run goats. Will a trap be a problem?', a: 'We place the trap where your stock can\'t get into it. Tell us what you run and where when you call.' },
    { q: 'Where do hogs water out here?', a: 'Wherever water holds through summer: Brady Creek, springs, the reservoir shoreline and good stock tanks. That\'s where we start looking.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Brady', url: 'https://www.tshaonline.org/handbook/entries/brady-tx' },
    { label: 'Handbook of Texas, Brady Creek', url: 'https://www.tshaonline.org/handbook/entries/brady-creek' },
    { label: 'Handbook of Texas, McCulloch County', url: 'https://www.tshaonline.org/handbook/entries/mcculloch-county' },
    { label: 'TWDB, Brady Creek Reservoir', url: 'https://www.twdb.texas.gov/surfacewater/rivers/reservoirs/brady_creek/index.asp' },
    { label: 'USDA NASS 2022 Census of Agriculture, McCulloch County', url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/Online_Resources/County_Profiles/Texas/cp48307.pdf' },
    { label: 'Texas A&M AgriLife Extension, McCulloch County', url: 'https://agrilifeextension.tamu.edu/counties/mcculloch/' },
  ],
};

export default town;
