import type { Town } from '../types';

const town: Town = {
  slug: 'hog-trapping-jarrell-tx',
  town: 'Jarrell',
  county: 'Williamson',
  title: 'Hog Trapping Jarrell TX | Red Creek Outdoors',
  h1: 'Hog Trapping in Jarrell, TX',
  description: 'Feral hog trapping around Jarrell in north Williamson County. Donahoe Creek, the Balcones Escarpment and corn ground off I-35. From $800. 254-397-8938.',
  lede: 'Jarrell sits right where the hills drop onto the blackland. Hogs bed on one side and feed on the other, and we run traps on the ground in between.',
  summary: 'North Williamson County on Donahoe Creek and the Balcones Escarpment.',
  facts: [
    { label: 'County', value: 'Williamson, about 2 miles south of the Bell County line' },
    { label: 'Water hogs use', value: 'Donahoe Creek, which starts just east of town, and the draws running north to the Lampasas and Little rivers' },
    { label: 'Ground', value: 'Balcones Escarpment: hilly brushland to the west, flat blackland to the east' },
    { label: 'Drive from Killeen', value: 'About 35 miles, around 45 minutes' },
    { label: 'Trapping price', value: 'Starts at $800' },
  ],
  nearby: ['salado', 'belton', 'buckholts', 'temple'],
  sections: [
    {
      h2: 'Where the hills meet the blackland',
      paras: [
        'The Handbook of Texas says the Balcones Escarpment runs north to south through Williamson County "from Jarrell to Georgetown to Round Rock." West of that line is hilly brushland averaging about 850 feet. East of it is flat blackland averaging about 600.',
        'That edge is hog country at its best. Brush and broken ground to the west give a sounder places to bed in the day. Open blackland fields to the east give them the groceries at night. A place near Jarrell can have both inside one fence.',
      ],
    },
    {
      h2: 'Donahoe Creek',
      paras: [
        'Jarrell sits on Donahoe Creek, per the Handbook. The creek rises just east of town and flows east 34 miles through Williamson, southeast Bell and Milam counties to the Little River near Buckholts. North of town, the county\'s creeks run into the Lampasas and Little rivers just past the Bell County line.',
        'A creek that starts this close to town means draws and wet spots scattered across the farms around it. Hogs wallow and drink in those draws and travel them out to the fields. The point where a draw opens onto a field is where we build.',
      ],
    },
    {
      h2: 'A young town, a lot of corn',
      paras: [
        'O. D. Jarrell founded the town in 1909 on the planned Bartlett and Western Railway, which shut down in 1935, and Williamson County calls it the county\'s "youngest town." The May 27, 1997 tornado killed 27 people here. About 2,100 people lived in Jarrell in 2021.',
        'Around it, the farm ground is serious. In the 2022 Census of Agriculture, Williamson County had 2,352 farms on 380,184 acres, 159,219 acres of cropland, 70,274 acres of grain corn and 44,765 cattle. Crops made up nearly half of $95.7 million in farm sales. Corn is exactly what hogs come for.',
      ],
    },
    {
      h2: 'We already run traps here',
      paras: [
        'Jarrell is ground we work now, with active trap sites on farms around town. That means we know how the hogs move here: off the brushy side of the escarpment and the Donahoe draws, onto the corn and hay, and back before light.',
        'The process is the same everywhere: bait under a cellular camera, the whole sounder conditioned to it, a trap built in stages, and the gate dropped from a phone when the last hog walks in. Then hogs go out alive to a buying station or are dispatched on site, depending on the market and the situation.',
      ],
      list: [
        'Corn and grain ground east of I-35',
        'Hay pens and pasture',
        'Brushy tracts on the escarpment west of town',
        'Farms along the Donahoe Creek draws',
      ],
    },
    {
      h2: 'What fresh sign looks like here',
      paras: [
        'On the blackland side, walk the field edges the morning after rain. The clay holds a track clean, and you\'ll see groups of rounded, blunt prints with small ones mixed in when sows have young with them. On the brushy side, look for low tunnels through the cedar and mud rubbed on trunks at knee height.',
        'Rooting in hay meadows and along terraces is the usual first complaint. If it\'s fresh several mornings running, the group is close and on a schedule. That\'s the best time to start.',
      ],
    },
    {
      h2: 'Right off I-35',
      paras: [
        'Jarrell is about 35 miles from Killeen, around 45 minutes, at I-35 and FM 487. With traps already running nearby, adding a property here is a short detour on a route we\'re already driving.',
      ],
    },
    {
      h2: 'Williamson County resources',
      paras: [
        'Texas A&M AgriLife Extension\'s Williamson County office is at 100 Wilco Way, Suite AG201, in Georgetown, (512) 943-3300. When you want the hogs trapped and off your place, call us.',
      ],
    },
  ],
  faq: [
    { q: 'Do you trap hogs near Jarrell?', a: 'Yes. We run active trap sites on farms around Jarrell right now.' },
    { q: 'How much does it cost?', a: 'Hog trapping starts at $800. Acreage, access and how many hogs are working your place set the final price, in writing before we start.' },
    { q: 'Hogs come out of the brush onto my corn. Where do you trap?', a: 'At the trail where they leave the brush or the creek draw and hit the field. That edge is usually the best site on the place.' },
    { q: 'Do you cover Georgetown and Florence?', a: 'Call with the location. North Williamson County is regular ground for us.' },
  ],
  sources: [
    { label: 'Handbook of Texas, Jarrell', url: 'https://www.tshaonline.org/handbook/entries/jarrell-tx' },
    { label: 'Handbook of Texas, Donahoe Creek', url: 'https://www.tshaonline.org/handbook/entries/donahoe-creek-williamson-county' },
    { label: 'Handbook of Texas, Williamson County', url: 'https://www.tshaonline.org/handbook/entries/williamson-county' },
    { label: 'Williamson County, Jarrell', url: 'https://www.wilcotx.gov/881/Jarrell' },
    { label: 'USDA NASS 2022 Census of Agriculture, Williamson County', url: 'https://www.nass.usda.gov/Publications/AgCensus/2022/Online_Resources/County_Profiles/Texas/cp48491.pdf' },
    { label: 'Texas A&M AgriLife Extension, Williamson County', url: 'https://agrilifeextension.tamu.edu/counties/williamson/' },
  ],
};

export default town;
