import type { Town } from '../types';
// One file per town (src/data/towns/<town>.ts). Order is the order on
// /hog-removal-areas. Killeen first: it's the page that already ranks.
const mods = import.meta.glob<{ default: Town }>('./*.ts', { eager: true });
const ORDER = ['killeen', 'copperas-cove', 'temple', 'belton', 'salado', 'gatesville', 'jonesboro', 'mcgregor', 'moody', 'lampasas', 'jarrell', 'buckholts', 'brady'];
export const TOWN_PAGES: Town[] = ORDER.map((s) => mods[`./${s}.ts`]?.default).filter(Boolean) as Town[];
