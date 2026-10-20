/* Field photos. One registry so every photo has exactly one home page on the
 * site, and the home slideshow links each slide back to that page.
 *
 * Rules: captions say only what's in the frame. No names of the people in
 * them, no property names, no places beyond the hunt towns. Originals are
 * re-encoded with metadata stripped before they land in src/assets/photos.
 */
import type { ImageMetadata } from 'astro';
import boar from '../assets/photos/boar-thermal-bolt-rifle.jpg';
import fourHogs from '../assets/photos/four-hogs-tailgate.jpg';
import gadwall from '../assets/photos/spaniel-gadwall-retrieve.jpg';
import pintail from '../assets/photos/hunter-spaniel-pintail.jpg';
import geese from '../assets/photos/snow-geese-tailgate.jpg';
import teal from '../assets/photos/teal-flatbed.jpg';
import coyote from '../assets/photos/coyote-pasture.jpg';
import nightBoar from '../assets/photos/boar-night-brush.jpg';
import buck from '../assets/photos/buck-feeder.jpg';

export type Photo = {
  id: string;
  src: ImageMetadata;
  alt: string;
  caption: string;
  /** The page this photo lives on. The slideshow links here. */
  page: string;
  pageLabel: string;
  /** CSS object-position when a frame has to crop. */
  focus?: string;
};

export const PHOTOS: Photo[] = [
  {
    id: 'boar-thermal-bolt-rifle',
    src: boar,
    alt: 'Hunter kneeling behind a large black feral boar with a suppressed bolt-action rifle and thermal scope laid across it',
    caption: 'One big boar, one suppressed bolt gun, thermal glass on top.',
    page: '/thermal-hog-hunts',
    pageLabel: 'Thermal Hog Hunts',
    focus: '50% 60%',
  },
  {
    id: 'boar-night-brush',
    src: nightBoar,
    alt: 'Hunter kneeling at night in mesquite brush behind a big gray feral boar',
    caption: 'After dark in the brush.',
    page: '/thermal-hog-hunts',
    pageLabel: 'Thermal Hog Hunts',
  },
  {
    id: 'coyote-pasture',
    src: coyote,
    alt: 'Hunter in gray camo with a predator call holding up a coyote on a pasture edge under storm clouds',
    caption: 'A coyote off the pasture edge.',
    page: '/thermal-predator-hunts',
    pageLabel: 'Thermal Predator Hunts',
  },
  {
    id: 'buck-feeder',
    src: buck,
    alt: 'Whitetail buck walking past a protein feeder at the edge of the timber',
    caption: 'A whitetail buck working past the feeder.',
    page: '/whitetail-deer-hunts',
    pageLabel: 'Whitetail Deer Hunts',
  },
  {
    id: 'four-hogs-tailgate',
    src: fourHogs,
    alt: 'Hunter with a thermal-scoped AR rifle sitting in a pickup bed behind four feral hogs on the tailgate',
    caption: 'Four hogs on the tailgate and a thermal-scoped AR.',
    page: '/guided-hunts',
    pageLabel: 'Guided Hunts',
    focus: '50% 55%',
  },
  {
    id: 'spaniel-gadwall-retrieve',
    src: gadwall,
    alt: 'Brown spaniel in a camo vest wading out of a pond with a drake gadwall in its mouth',
    caption: 'Drake gadwall, on the way back.',
    page: '/duck-hunts',
    pageLabel: 'Duck Hunts',
    focus: '50% 62%',
  },
  {
    id: 'hunter-spaniel-pintail',
    src: pintail,
    alt: 'Smiling hunter in camo holding a wet brown spaniel and a drake pintail',
    caption: 'A drake pintail and the dog that brought it back.',
    page: '/duck-hunts',
    pageLabel: 'Duck Hunts',
    focus: '50% 45%',
  },
  {
    id: 'teal-flatbed',
    src: teal,
    alt: 'Row of green-winged teal and a gadwall laid across the back of a flatbed pickup with a Red Creek Outdoors decal',
    caption: 'Green-winged teal stacked on the flatbed, a gadwall on top.',
    page: '/teal-hunts',
    pageLabel: 'Teal Hunts',
  },
  {
    id: 'snow-geese-tailgate',
    src: geese,
    alt: 'Tailgate of a pickup lined with snow geese and blue-phase geese, decoy bags in the bed',
    caption: 'A tailgate full of snow geese.',
    page: '/field-notes/waterfowl-hunt-checklist-texas',
    pageLabel: 'Waterfowl Checklist',
    focus: '50% 60%',
  },
];

export const photosFor = (page: string) => PHOTOS.filter((p) => p.page === page);
