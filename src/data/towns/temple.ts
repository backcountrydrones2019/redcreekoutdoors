import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-temple-tx',
  town: 'Temple',
  county: 'Bell',
  title: 'Hog Trapping Temple TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Temple, TX',
  description: 'Feral hog trapping for Temple and east Bell County farms. Blackland row-crop ground, Leon River bottoms, whole-sounder removal. From $800. Call 254-397-8938.',
  lede: 'East Bell County is farm country, and hogs do their worst damage in a planted field. We trap the group before the next crop goes in.',
  summary: 'Blackland farm ground east of I-35 and the Leon River below Lake Belton.',
  facts: [
    { label: 'County', value: 'Northeastern Bell' },
    { label: 'Water hogs use', value: 'The Leon River downstream of Belton Lake, plus the field drainages and tanks across the farm ground' },
    { label: 'Ground', value: 'Blackland Prairie: level to rolling, dark clay soils, heavy cropland' },
    { label: 'Drive from Killeen', value: 'About 25 miles, roughly half an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['belton', 'moody', 'buckholts', 'salado'],
  sections: [
    {
      h2: 'Farm ground draws hogs',
      paras: [
        'The Handbook of Texas splits Bell County at the Balcones Escarpment. East of it, where Temple sits, is Blackland Prairie: "comparatively level prairieland" with dark clay soils. Bell County was 52 percent cropland in the 2002 agricultural count the Handbook cites, with corn, sorghum, wheat and cotton among the chief products.',
        'That\'s the problem in one sentence. Sorghum heads and milk-stage corn are about the best groceries a hog can find, and freshly planted seed is a close second. A sounder can work a row from one end to the other in a night. On level blackland there\'s not much brush to hide in during the day, so they bed along the river and the drainages and commute to the field after dark.',
      ],
    },
    {
      h2: 'The river is the travel lane',
      paras: [
        'Temple\'s own water supply comes out of the Leon River below Lake Belton, under a Brazos River Authority contract. That same river corridor, with its timber and steep banks, is where hogs move and rest between fields. If your place touches the Leon or a creek that feeds it, they\'re almost certainly using it.',
        'We find the crossing. A trail coming up out of a bottom and into a field edge is where bait gets set and the camera goes up, because that\'s where the whole group passes through together.',
      ],
    },
    {
      h2: 'How we trap Temple-area farms',
      paras: [
        'Timing matters more on crop ground than anywhere else. The best time to start is before planting or right after harvest, when there\'s little else to eat and bait pulls hardest. During the growing season the field itself is the bait, and we work the edges.',
        'We condition the sounder to the site on camera, build the trap a section at a time while they keep feeding, and close it remotely once every hog is inside. Then we reset and go after the next group. Most farms east of the interstate have more than one.',
      ],
      list: [
        'Row-crop and grain ground around Temple, Rogers and Holland',
        'River bottom tracts along the Leon',
        'Hay and improved pasture',
        'Commercial solar sites',
      ],
    },
    {
      h2: 'Getting to you',
      paras: [
        'Temple is about 25 miles from our Killeen base by road, roughly a half hour. I-35, State Highway 53 and State Highway 95 all run through town, which makes most of east Bell County an easy drive for checks and resets.',
      ],
    },
    {
      h2: 'Other help for Temple landowners',
      paras: [
        'Texas A&M AgriLife Extension\'s Bell County office in Belton, (254) 933-5305, handles county ag and land questions. AgriLife\'s Coping with Feral Hogs site covers fencing, trapping and other methods and recommends combining them. For an outfit that does the trapping for you, call us.',
      ],
    },
    {
      h2: 'Reading the damage in a field',
      paras: [
        'Blackland clay holds a track after rain better than almost any soil in the state, so the morning after a shower is the time to walk your field edges. Hog tracks run in groups, blunt and rounded at the toe, with small ones mixed in among the big ones when sows have piglets with them.',
        'In a planted field, look for seed dug out of the row in a straight line, as if someone ran a hoe down it. In standing sorghum or corn, look for stalks pulled down and flattened in a ring where the group fed in one spot. In wheat, look for patches rooted bare. AgriLife Extension\'s survey put statewide farm losses at $52 million a year back in 2004. On a single Temple farm, that number shows up as replant costs and lost bushels, which is why the sooner we start, the less it costs you.',
      ],
    },
  ],
  faq: [
    { q: 'What does hog trapping cost near Temple?', a: 'Starts at $800. Acreage, access and how many sounders are working the place set the final number, in writing before we begin.' },
    { q: 'When should I start trapping on crop ground?', a: 'Before planting or right after harvest is best, because bait works hardest when the field is bare. During the season we trap the field edges and travel lanes.' },
    { q: 'Do you cover Rogers and Holland?', a: 'Yes. East Bell County is regular ground for us.' },
    { q: 'Hogs are coming off the river onto my place. Can you stop them?', a: 'We trap them on your side where they come up out of the bottom. That crossing is usually the best trap site on the whole property.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Temple', url: 'https://www.tshaonline.org/handbook/entries/temple-tx' },
    { label: 'Handbook of Texas, Bell County', url: 'https://www.tshaonline.org/handbook/entries/bell-county' },
    { label: 'Brazos River Authority, City of Temple', url: 'https://www.brazos.org/About-Us/News/News-Room/Resource-Library/City-of-Temple' },
    { label: 'Texas A&M AgriLife Extension, Bell County', url: 'https://agrilifeextension.tamu.edu/counties/bell-county/' },
    { label: 'Texas A&M AgriLife, Feral Hog Management', url: 'https://feralhogs.tamu.edu/feral-hog-management/' },
  ],
};

export default town;
