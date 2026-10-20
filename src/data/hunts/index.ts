import type { Hunt } from '../types';
// One file per hunt so sitemap lastmod moves only when that hunt's copy does.
// Order here is the order on /guided-hunts and in the nav.
const mods = import.meta.glob<{ default: Hunt }>('./*.ts', { eager: true });
const ORDER = ['thermal-hog-hunts', 'thermal-predator-hunts', 'whitetail-deer-hunts', 'dove-hunts', 'teal-hunts', 'duck-hunts'];
export const HUNTS: Hunt[] = ORDER.map((s) => mods[`./${s}.ts`]?.default).filter(Boolean) as Hunt[];
