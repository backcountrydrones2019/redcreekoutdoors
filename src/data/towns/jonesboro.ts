import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-jonesboro-tx',
  town: 'Jonesboro',
  county: 'Hamilton and Coryell',
  title: 'Hog Trapping Jonesboro TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Jonesboro, TX',
  description: 'Feral hog trapping around Jonesboro on the Hamilton and Coryell county line. Leon River bottoms and cattle pasture. From $800. Call 254-397-8938.',
  lede: 'A river town on the county line with more cattle than people. The Leon carries hogs right through it.',
  summary: 'Leon River cattle country on the Hamilton and Coryell line.',
  facts: [
    { label: 'County', value: 'Straddles the Hamilton and Coryell county line' },
    { label: 'Water hogs use', value: 'The Leon River and its bottoms' },
    { label: 'Ground', value: 'Rolling prairie, buttes and limestone valleys on the Hamilton side; Grand Prairie on the Coryell side' },
    { label: 'Drive from Killeen', value: 'About 46 miles, a little over an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['gatesville', 'mcgregor', 'copperas-cove', 'moody'],
  sections: [
    {
      h2: 'A mill town on the Leon',
      paras: [
        'Jonesboro started as Jones Mill. The Jones brothers built a sawmill and gristmill on the Leon River in 1866, and the town took the name Jonesboro in 1877, according to the Handbook of Texas. It sits at State Highway 36 and FM 1602, 19 miles northwest of Gatesville, and its old school district served both southeast Hamilton County and northwest Coryell County.',
        'The town peaked around 700 people in the early 1890s and shrank after the railroad passed it by in 1911. The Handbook put it at 125 in 2009. That leaves a lot of open country and not many people watching it, which suits hogs fine.',
      ],
    },
    {
      h2: 'The Leon is the highway',
      paras: [
        'The Leon River runs southeast about 185 miles through Eastland, Comanche, Hamilton and Coryell counties, and the Handbook lists Jonesboro as one of its river communities. River bottoms like these hold timber, water and soft ground, everything a sounder needs within a short walk.',
        'Hogs use a river corridor the way trucks use a highway. They travel it at night, bed in the thickest cover along it, and branch off onto pasture and field ground on either side. If your place touches the Leon or a creek that feeds it, you\'re on the route.',
      ],
    },
    {
      h2: 'More cattle than anything',
      paras: [
        'Hamilton County is livestock country. The 2022 Census of Agriculture counted 964 farms on 515,913 acres, with 387,645 acres of pasture and 64,695 cattle, and 96 percent of $100.7 million in farm sales from livestock. It also counted 2,457 acres of pecans. The Handbook describes the county as rolling prairie with flat-topped buttes and limestone-cliffed valleys, with Western Cross Timbers in the northwest.',
        'On cattle ground, hog damage looks like rooted pasture you can\'t run a shredder over, tanks turned to mud, and hay you can\'t cut clean. In pecan bottoms, they\'re eating your crop off the ground before you can pick it up.',
      ],
    },
    {
      h2: 'How we work this far out',
      paras: [
        'Jonesboro is about 46 miles from our Killeen base, a little over an hour. Distance changes the schedule, not the method. Cellular cameras on the bait let us watch the sounder every night from anywhere, so we drive out when there\'s work to do: to set bait, build the trap, close it and haul.',
        'When the gate drops, hogs go out alive to a buying station or are dispatched on site, depending on the market and the situation. Then we reset for the next group coming down the river.',
      ],
      list: [
        'Cattle pasture on both sides of the county line',
        'Leon River bottoms',
        'Pecan orchards and bottomland',
        'Hay and small grain fields',
      ],
    },
    {
      h2: 'Reading the river bottom',
      paras: [
        'Walk the edge where the bottom timber meets your pasture. That seam is where hogs come out to feed and where trails are easiest to see. Look for rooting in a band along the tree line, mud rubbed on trunks at knee height, and wallows in any low wet spot near the river.',
        'After the river has been up, the mud along the banks shows every track. That\'s the best time to see how many hogs are using the place and which way they come and go.',
      ],
    },
    {
      h2: 'County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s Hamilton County office is at 101 E. Henry in Hamilton, (254) 386-3919. The Coryell County office is at 303 Veterans Memorial Loop in Gatesville, (254) 865-2414. Which one you call depends on which side of the line your place sits. Either way, when you want hogs trapped, call us.',
      ],
    },
  ],
  faq: [
    { q: 'Do you trap as far out as Jonesboro?', a: 'Yes. It\'s a little over an hour from Killeen, and cellular cameras mean we only drive out when it\'s time to work.' },
    { q: 'What does it cost?', a: 'Hog trapping starts at $800. Acreage, access and hog numbers set the final price, in writing before we begin.' },
    { q: 'Hogs are in my pecans. Can you help?', a: 'Yes. Pecan bottoms pull hogs hard in the fall. We trap the trail between the bottom cover and the orchard.' },
    { q: 'My place is on the Hamilton County side. Does that matter?', a: 'No. We work both sides of the line.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Jonesboro', url: 'https://www.tshaonline.org/handbook/entries/jonesboro-tx' },
    { label: 'Handbook of Texas, Leon River', url: 'https://www.tshaonline.org/handbook/entries/leon-river' },
    { label: 'Handbook of Texas, Hamilton County', url: 'https://www.tshaonline.org/handbook/entries/hamilton-county' },
    { label: 'USDA NASS 2022 Census of Agriculture, Hamilton County', url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/Online_Resources/County_Profiles/Texas/cp48193.pdf' },
    { label: 'Texas A&M AgriLife Extension, Hamilton County', url: 'https://agrilifeextension.tamu.edu/counties/hamilton/' },
    { label: 'Texas A&M AgriLife Extension, Coryell County', url: 'https://agrilifeextension.tamu.edu/counties/coryell/' },
  ],
};

export default town;
