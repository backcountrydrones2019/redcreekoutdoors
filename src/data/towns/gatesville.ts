import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-gatesville-tx',
  town: 'Gatesville',
  county: 'Coryell',
  title: 'Hog Trapping Gatesville TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Gatesville, TX',
  description: 'Feral hog trapping for Gatesville and Coryell County ranches. Leon River bottoms, cedar and pasture country north of Fort Hood. From $800. Call 254-397-8938.',
  lede: 'Coryell County is cattle and pasture country with the Leon River through the middle of it. Hogs love both. We trap the whole sounder.',
  summary: 'Coryell County pasture and cedar along the Leon River.',
  facts: [
    { label: 'County', value: 'Coryell (county seat)' },
    { label: 'Water hogs use', value: 'The Leon River, which bends right past downtown, and Cowhouse Creek to the south and west' },
    { label: 'Ground', value: 'Grand Prairie plateaus and grassland over limestone, cedar, live oak and pecan' },
    { label: 'Drive from Killeen', value: 'About 36 miles, under an hour' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  sections: [
    {
      h2: 'Pasture country with a river through it',
      paras: [
        'The Handbook of Texas describes Coryell County as "plateaus and grasslands in the Grand Prairie region," mostly alkaline soils over limestone, with red cedar, live oak and pecan. The 2002 farm numbers it cites put the county at 58 percent pasture, 33 percent cropland and 6 percent woodland, with beef cattle and forage at the top of the list.',
        'Hogs do a different kind of damage here than on crop ground. They root improved pasture and hay meadows looking for grubs and roots, and the torn-up ground costs you a cutting and wrecks equipment. They foul stock tanks. On cattle country, the sign is turned sod, muddy tanks and busted water gaps.',
      ],
    },
    {
      h2: 'The Leon runs the show',
      paras: [
        'Gatesville is on the Leon River. The city\'s Faunt Le Roy Park sits in a bend of the river just south of downtown. Across the county the Leon drains the north and east, while Cowhouse Creek drains the west and south, per the Handbook. Pecan bottoms along a river like the Leon give hogs everything at once: nuts in the fall, water and heavy cover.',
        'The town is named for Fort Gates, an Army post that stood on the Leon nearby. The river has been the reason people settle here for a long time, and it\'s the reason hogs do too.',
      ],
    },
    {
      h2: 'Cedar and the military reservation',
      paras: [
        'When Camp Hood was built, it took about 225 square miles of southern Coryell County, according to the Handbook. Gatesville sits on the northern edge of that ground. Large blocks of undisturbed land next to private ranches are reservoirs for hogs. Cedar breaks on the plateau edges give them daytime cover close to pasture.',
        'For a trapping job out here, that means sounders may be traveling farther than they would near town. We find where they come onto your place, which usually means a creek crossing, a fence gap or a draw through the cedar, and build the trap there.',
      ],
      list: [
        'Cattle ranches and improved pasture',
        'Hay meadows along the Leon',
        'Pecan bottoms',
        'Ranches backing up to Fort Hood',
      ],
    },
    {
      h2: 'Distance and timing',
      paras: [
        'Gatesville is about 36 miles from our Killeen base, a little under an hour on the road. U.S. 84 and State Highway 36 cross in town. We set up checks around the distance: cellular cameras mean we know when hogs are on the bait without driving out, and we come when it\'s time to build or close.',
      ],
    },
    {
      h2: 'Coryell County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s Coryell County office is at 303 Veterans Memorial Loop in Gatesville, (254) 865-2414. It covers ranch and land management questions for the county. AgriLife\'s Coping with Feral Hogs site lays out every method. For trapping done for you, call us.',
      ],
    },
    {
      h2: 'Tanks, water gaps and feeders',
      paras: [
        'On a Coryell County cattle place, the stock tank is where to look first. Hogs wallow in the shallow end and leave the bank torn and the water muddy, and cattle won\'t drink it as well. Check where your fence crosses a creek or draw too. Water gaps are a favorite hog crossing because they\'re already a hole in the fence.',
        'If you run a deer feeder, put a camera on it. Hogs find corn fast, usually after dark, and a feeder that empties overnight is often feeding hogs, not deer. That feeder location can become a trap site, since the sounder already trusts it. We just need room to build and a spot your cattle can\'t get into. On working ranches we place traps away from where cattle water and gather, so stock and hogs never end up in the same pen.',
      ],
    },
  ],
  faq: [
    { q: 'What does hog trapping cost around Gatesville?', a: 'Starts at $800. Final price depends on acreage, access and how many hogs are on it, in writing before we start.' },
    { q: 'Is Gatesville too far for you?', a: 'No. It\'s under an hour from Killeen and cellular cameras let us watch the bait from anywhere. We drive out when it\'s time to build or close.' },
    { q: 'Hogs are rooting my hay meadow. What do I do now?', a: 'Don\'t shoot at them, it scatters the group. Note where the fresh sign is and call. A meadow along the Leon usually has a clear entry trail.' },
    { q: 'Do you work ranches next to Fort Hood?', a: 'Yes. We trap on your side of the boundary where the hogs come onto your pasture.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Gatesville', url: 'https://www.tshaonline.org/handbook/entries/gatesville-tx' },
    { label: 'Handbook of Texas, Coryell County', url: 'https://www.tshaonline.org/handbook/entries/coryell-county' },
    { label: 'Handbook of Texas, Leon River', url: 'https://www.tshaonline.org/handbook/entries/leon-river' },
    { label: 'City of Gatesville, Faunt Le Roy Park', url: 'https://gatesvilletx.com/departments/parks_recreation/parks/faunt_le_roy_park/index.php' },
    { label: 'Texas A&M AgriLife Extension, Coryell County', url: 'https://agrilifeextension.tamu.edu/counties/coryell-county/' },
    { label: 'Texas A&M AgriLife, Feral Hog Management', url: 'https://feralhogs.tamu.edu/feral-hog-management/' },
  ],
};

export default town;
