import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-belton-tx',
  town: 'Belton',
  county: 'Bell',
  title: 'Hog Trapping Belton TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Belton, TX',
  description: 'Hog trapping around Belton, between Belton Lake and Stillhouse Hollow. Nolan Creek and Leon River bottoms, whole-sounder removal. From $800. 254-397-8938.',
  lede: 'Two lakes, two rivers and a creek through the middle of town. Belton has more hog water per square mile than anywhere else in the county.',
  summary: 'Between two Corps lakes where the Leon and Lampasas come together.',
  facts: [
    { label: 'County', value: 'Bell (county seat)' },
    { label: 'Water hogs use', value: 'Nolan Creek, the Leon River, Belton Lake 3 miles north, Stillhouse Hollow Lake 5 miles southwest' },
    { label: 'Ground', value: 'Nearly level to rolling, gravelly, loamy and clay soils along the creeks' },
    { label: 'Drive from Killeen', value: 'About 17 miles, around 25 minutes' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['killeen', 'temple', 'salado', 'jarrell'],
  sections: [
    {
      h2: 'Water everywhere',
      paras: [
        'Belton sits in a pocket of water. Belton Lake, a Corps of Engineers reservoir on the Leon River holding about 435,000 acre-feet, is three miles north of town per the Texas Water Development Board. Stillhouse Hollow Lake on the Lampasas River is five miles southwest. Nolan Creek runs through town, forming from its North and South forks two miles northwest and joining the Leon two miles east, according to the Handbook of Texas. And four miles southeast, the Leon and Lampasas meet to make the Little River.',
        'Hogs need water every day and wallow to stay cool. Around Belton they never have to go far for either. That means the population here doesn\'t thin out in a dry summer the way it can on upland ranches. The bottoms hold hogs all year.',
      ],
    },
    {
      h2: 'Lake cover, private damage',
      paras: [
        'Lake country gives hogs cover they can bed in all day without being bothered. They come off it at night onto the private ground next door. If your place sits between a lake and a road, you\'re likely seeing hogs that bed on one side and eat on yours.',
        'That shapes the job. We trap on your property, at the trails coming off the lake or creek, where the sounder crosses in together. Bait, camera, patience, then the gate drops when the last hog is inside.',
      ],
    },
    {
      h2: 'Nolan Creek and town',
      paras: [
        'Nolan Creek floods. The Handbook records it putting much of downtown Belton underwater in December 1913. The creek crosses what the Handbook calls "nearly level to sloping and undulating to rolling terrain" of gravel, loam and clay, used mostly for agriculture. Hogs follow it right to the edge of neighborhoods.',
        'Near town we pick trap sites that stay out of sight and away from where people walk, and we check them more often. Being 25 minutes from our base helps.',
      ],
      list: [
        'Lake-adjacent tracts near Belton Lake and Stillhouse Hollow',
        'Nolan Creek and Leon River bottoms',
        'Pasture and hay on the rolling ground around town',
        'Commercial solar sites',
      ],
    },
    {
      h2: 'Roads in',
      paras: [
        'Belton is about 17 miles from Killeen. I-35, U.S. 81 and U.S. 190 all come through town, so getting to places on either side of the interstate is quick. From our side it\'s a straight run east on U.S. 190, and we can be on a Belton property while a trap check would still be a long drive for an outfit coming up from Austin.',
      ],
    },
    {
      h2: 'Other local resources',
      paras: [
        'The Bell County office of Texas A&M AgriLife Extension is right in Belton at 1605 N. Main St., Suite 102, (254) 933-5305. It\'s a good place for free information on hogs and land management. AgriLife\'s Coping with Feral Hogs program covers the full set of control methods. When you want the trapping handled, call us.',
      ],
    },
    {
      h2: 'When the water comes up',
      paras: [
        'Belton\'s bottoms flood, and a flood moves hogs. When Nolan Creek or the Leon is out of its banks, sounders get pushed up onto higher ground, which can be your pasture, your yard edge or your hay field for a few days. Once the water drops they go back to the bottom, and they remember where the easy food was.',
        'That pattern is useful. If hogs showed up on your place right after high water, there\'s a trail between the bottom and your ground, and that trail is where the trap goes. Call while the sign is fresh. Walking a property right after the water goes down shows us the crossings better than any other time of year, because the mud records every track and the travel lanes stand out clean.',
      ],
    },
  ],
  faq: [
    { q: 'How much is hog trapping in Belton?', a: 'Starts at $800, set in writing after we see the place. Acreage, access and hog numbers drive the final price.' },
    { q: 'Can you trap on lake land?', a: 'We trap on private land only, at the spots where hogs come onto your property from the lake side. That\'s where the damage is anyway.' },
    { q: 'My place is near Nolan Creek in town. Is that too close?', a: 'Often not. We look for a trap site out of sight and away from foot traffic, and check it more often. Call and we\'ll walk it.' },
    { q: 'Do hogs leave in the summer?', a: 'Not around Belton. With two lakes and two rivers, they always have water and a place to wallow.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Belton', url: 'https://www.tshaonline.org/handbook/entries/belton-tx' },
    { label: 'Handbook of Texas, Nolan Creek', url: 'https://www.tshaonline.org/handbook/entries/nolan-creek-bell-county' },
    { label: 'Handbook of Texas, Lampasas River', url: 'https://www.tshaonline.org/handbook/entries/lampasas-river' },
    { label: 'TWDB, Belton Lake', url: 'https://www.twdb.texas.gov/surfacewater/rivers/reservoirs/belton/index.asp' },
    { label: 'TWDB, Stillhouse Hollow Lake', url: 'https://www.twdb.texas.gov/surfacewater/rivers/reservoirs/stillhouse_hollow/index.asp' },
    { label: 'Texas A&M AgriLife Extension, Bell County', url: 'https://agrilifeextension.tamu.edu/counties/bell-county/' },
  ],
};

export default town;
