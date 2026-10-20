import type { Town } from '../types';

/* RANKING PAGE. #2 for "hog removal killeen tx" at cutover. Title is unchanged
   from the GoDaddy page on purpose, and the lines it ranked on ("complete
   sounder removal", the four counties, trap placement and pressure) are kept.
   Talk to Justin before changing the title, H1 or URL. */
const town: Town = {
  slug: 'hog-trapping-killeen-tx',
  town: 'Killeen',
  county: 'Bell',
  title: 'Hog Trapping Killeen TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Killeen, TX',
  description: 'Whole-sounder hog trapping in Killeen and Bell County. Cellular traps, camera monitoring, full removal. Trapping starts at $800. Call 254-397-8938.',
  lede: 'Complete sounder removal, not just catching a pig here and there. Killeen is home base, so we\'re never far from your place.',
  summary: 'Home base. Nolan Creek country on the edge of Fort Hood.',
  facts: [
    { label: 'County', value: 'Bell, west of the Balcones Escarpment' },
    { label: 'Water hogs use', value: 'South Nolan Creek and its draws, Cowhouse Creek country to the north, Belton Lake' },
    { label: 'Ground', value: 'Grand Prairie: uplands cut by stream valleys, stony slopes' },
    { label: 'Drive from our base', value: "We're based here. Same day for anywhere in town" },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  sections: [
    {
      h2: 'Why Killeen has a hog problem',
      paras: [
        'Killeen grew fast and grew out, and a lot of what\'s still open around it is creek bottom. South Nolan Creek runs right through Killeen, Harker Heights and Nolanville before Nolan Creek reaches the Leon River east of Belton, according to the Texas Commission on Environmental Quality. Every one of those draws is a highway for a sounder: water, shade and thick cover, running straight past back fences.',
        'West of the Balcones Escarpment, the Handbook of Texas describes western Bell County as Grand Prairie, with uplands "deeply cut with stream valleys" and stony slopes. That\'s textbook hog country. They bed in the cut, come out at night to feed on whatever\'s green or soft, and go back before light. Most landowners never see them. They see the rooting.',
        'And then there\'s Fort Hood. When the post expanded, the Handbook notes, roughly 300 farms and ranches closed and the base came to cover almost half of Killeen\'s old trade area. A lot of country around town borders federal ground that nobody\'s farming, and the hogs don\'t read fence signs.',
      ],
    },
    {
      h2: 'What a Killeen trapping job looks like',
      paras: [
        'At Red Creek Outdoors LLC we focus on complete sounder removal. Strategic trap placement, consistent pressure and long-term control. Here that usually starts on the creek. We walk the draw behind your place, find the crossings and wallows, and put bait and a cellular camera where the trails already run.',
        'On a small tract near town, the trap may go up where it\'s out of sight from the road. On large acreage properties toward the county line it goes where the most sign is. Either way we watch on camera until every sow and shoat in the group is coming in, and we close the gate from a phone when the last one walks in.',
      ],
      list: [
        'Ranch and pasture ground around the city',
        'Tracts backing up to South Nolan Creek and its draws',
        'Hay meadows, food plots and anything with a stock tank',
        'Commercial solar sites',
      ],
    },
    {
      h2: 'Home base means fast',
      paras: [
        'We\'re a Killeen outfit. When a trap closes at 2 a.m. on a place in town, we\'re there. Being close also means we can check sign and reset bait more often than an outfit driving in from Austin or Waco, and pressure is what finishes a sounder.',
        'We work large acreage across Bell, Coryell, Milam and Falls counties out of here. If you\'re in Harker Heights, Nolanville, Copperas Cove or out toward Belton Lake, you\'re close.',
      ],
    },
    {
      h2: 'Who else Killeen landowners call',
      paras: [
        'The Bell County office of Texas A&M AgriLife Extension, at 1605 N. Main St., Suite 102 in Belton, (254) 933-5305, is a good free resource for feral hog information and land management questions. AgriLife\'s Coping with Feral Hogs program lays out every control method, from fencing to trapping to aerial work, and recommends using more than one.',
        'If you want the job done start to finish, that\'s us.',
      ],
    },
    {
      h2: 'Sign to look for around Killeen',
      paras: [
        'Start at the low end of your place. On ground cut by creek draws, the first rooting usually shows along the bottom of the slope where the soil stays soft, then spreads uphill as the sounder gets comfortable. Look for crusted mud on fence posts and the trunks of live oaks about knee high, and low gaps worn under net wire where a hog pushed through and every other hog followed.',
        'Fresh rooting looks dark and damp with clods still loose. Old rooting is dry, gray and crusted. If you\'re seeing fresh turned ground several mornings in a row, the group is living close and coming every night. That\'s the best time to call, because a sounder on a routine is a sounder we can condition to a trap fast. Take a phone photo of the worst spot and the nearest fence gap. It tells us a lot before we ever drive out.',
      ],
    },
  ],
  faq: [
    { q: 'How much does hog trapping cost in Killeen?', a: 'Trapping starts at $800. Acreage, access and the number of hogs set the final price, and you get it in writing before we start.' },
    { q: 'Do you trap on small properties near town?', a: 'Yes, as long as there\'s room to build a trap safely and the hogs are coming through. A lot of Killeen calls come from places backing up to creek draws.' },
    { q: 'My place borders Fort Hood. Can you help?', a: 'Yes. We trap on your side of the fence. Hogs moving off federal ground still have to cross your property to feed, and that\'s where we catch them.' },
    { q: 'How fast can you come out?', a: 'Killeen is home base. Call 254-397-8938 and we\'ll set a time to walk your place.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Killeen', url: 'https://www.tshaonline.org/handbook/entries/killeen-tx' },
    { label: 'Handbook of Texas, Bell County', url: 'https://www.tshaonline.org/handbook/entries/bell-county' },
    { label: 'TCEQ, Nolan Creek watershed protection plan', url: 'https://www.tceq.texas.gov/waterquality/nonpoint-source/projects/nolan-creek-wpp-impl' },
    { label: 'Texas A&M AgriLife Extension, Bell County', url: 'https://agrilifeextension.tamu.edu/counties/bell-county/' },
    { label: 'Texas A&M AgriLife, Feral Hog Management', url: 'https://feralhogs.tamu.edu/feral-hog-management/' },
  ],
};

export default town;
