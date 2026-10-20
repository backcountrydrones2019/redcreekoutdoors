import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-salado-tx',
  town: 'Salado',
  county: 'Bell',
  title: 'Hog Trapping Salado TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Salado, TX',
  description: 'Hog trapping around Salado and south Bell County. Spring-fed Salado Creek, rolling hills on the Balcones Fault, whole-sounder removal. From $800. 254-397-8938.',
  lede: 'Salado Creek never stops running, and the hogs know it. We trap the sounders working the creek and the rolling ground around the village.',
  summary: 'Spring-fed Salado Creek on the Balcones Fault, south Bell County.',
  facts: [
    { label: 'County', value: 'Southern Bell, just east of I-35' },
    { label: 'Water hogs use', value: 'Salado Creek and its limestone springs, the draws feeding it' },
    { label: 'Ground', value: 'Rolling hills along the Balcones Fault' },
    { label: 'Drive from Killeen', value: 'About 21 miles, around half an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  sections: [
    {
      h2: 'Springs that never quit',
      paras: [
        'Salado exists because of its creek. The Handbook of Texas describes Salado Creek\'s "clear, bubbling springs" making the site a camping ground for thousands of years. The Texas Historical Commission marker calls it a 35-mile creek that rises at the Balcones Fault with "gushing limestone springs," and the village once ran eight flour and grist mills off it.',
        'Spring water is a big deal to a hog. In a dry August, when stock tanks on the upland ranches drop to mud, a spring-fed creek still has water and shade. Hogs that would scatter across the county in a wet year pull onto the creek in a dry one, and the properties along it take the damage.',
      ],
    },
    {
      h2: 'Hills, fault line and three rivers',
      paras: [
        'The village describes itself as sitting in "the rolling hills of Bell County." The Balcones Fault is what made those hills, and it\'s what feeds the springs. Downstream, Salado Creek is one of the three forks, with the Leon and the Lampasas, that come together to form the Little River.',
        'Rolling ground cut by draws gives a sounder a lot of options for bedding and a lot of ways to move unseen. We read the draws. Hog trails between the creek and the feed tend to follow the easiest grade, so the trap goes where the draw meets the field or pasture edge.',
      ],
    },
    {
      h2: 'Trapping around a small town',
      paras: [
        'Salado is a village of about 2,400 people, per the Handbook, with neighbors close on a lot of the ground around it. That means trap sites need some thought: out of sight of neighbors and the road, away from horses and kids, and easy for us to reach at night without tearing up your ground.',
        'We condition the hogs to bait on a cellular camera, build the trap in stages, and close it remotely when the full group is inside. Then we take the hogs off and keep pressure on whatever\'s left. We also hunt private ground near Salado, so the area gets night pressure from more than one direction.',
      ],
      list: [
        'Creekside tracts along Salado Creek',
        'Small acreage and horse property around the village',
        'Pasture and hay in the rolling hills',
        'Commercial solar sites',
      ],
    },
    {
      h2: 'Close by',
      paras: [
        'Salado is about 21 miles from our Killeen base, around 30 minutes, right off I-35. The Chisholm Trail and the old Dallas to San Antonio stage line both crossed Salado Creek here. We just take the interstate.',
      ],
    },
    {
      h2: 'Who else can help',
      paras: [
        'The Texas A&M AgriLife Extension office for Bell County is in Belton, (254) 933-5305. It\'s a good free source for land and wildlife questions. AgriLife\'s Coping with Feral Hogs site explains fencing, trapping and other methods and recommends using them together. When you want hogs trapped and off your place, call us.',
      ],
    },
    {
      h2: 'Along the creek bank',
      paras: [
        'Spring creeks show hog damage differently than dry country. Look for banks rooted loose along the water\'s edge, wallows dug into the soft ground where seeps come out of the hillside, and muddy runs where clear water used to be. Rooted banks wash out faster in the next hard rain, so the damage keeps going after the hogs leave.',
        'Watch the low water crossings and the draws that come down to the creek from your pasture. Hogs take the same path every night, and on hilly ground the path is usually the gentlest slope from the water up to the feed. Once you\'ve found two or three fresh trails, you\'ve found where we\'ll look first. Photos help. Snap the fresh rooting and the trail where it leaves the creek, and send them when you call.',
      ],
    },
  ],
  faq: [
    { q: 'How much is hog trapping near Salado?', a: 'Starts at $800. Acreage, access and how many hogs are working the creek set the final price, in writing before we start.' },
    { q: 'I have horses. Is a trap safe on my place?', a: 'We put the trap where horses and people won\'t be, and you\'ll know exactly where it is. Tell us about the stock when you call.' },
    { q: 'Why are hogs worse here in a drought?', a: 'Salado Creek is spring-fed. When upland tanks go dry, hogs move to the creek, so properties along it see more of them.' },
    { q: 'Do you also hunt near Salado?', a: 'Yes. We run guided hunts on private land near Salado. See our <a href="/thermal-hog-hunts">thermal hog hunts</a>.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Salado', url: 'https://www.tshaonline.org/handbook/entries/salado-tx' },
    { label: 'Handbook of Texas, Bell County', url: 'https://www.tshaonline.org/handbook/entries/bell-county' },
    { label: 'Texas Historical Commission, Salado Creek marker', url: 'https://atlas.thc.texas.gov/Details/5027004493/print' },
    { label: 'Village of Salado', url: 'https://saladotx.gov/node/104' },
    { label: 'Texas A&M AgriLife Extension, Bell County', url: 'https://agrilifeextension.tamu.edu/counties/bell-county/' },
    { label: 'Texas A&M AgriLife, Feral Hog Management', url: 'https://feralhogs.tamu.edu/feral-hog-management/' },
  ],
};

export default town;
