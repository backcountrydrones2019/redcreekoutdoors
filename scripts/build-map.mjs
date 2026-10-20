#!/usr/bin/env node
/**
 * Builds src/data/texas-map.json: the Texas map on /hog-removal-areas and the
 * home page. Run it by hand when a town or county changes:
 *
 *   node scripts/build-map.mjs
 *
 * County shapes come from us-atlas (US Census cartographic boundaries,
 * 1:10m). Projection is Lambert conformal conic on Texas' standard parallels,
 * so the state looks the way Texans expect it to. Output is plain SVG path
 * strings. The page renders them server side; no tiles, no map library, no
 * client JavaScript.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature, mesh } from 'topojson-client';
import { geoConicConformal, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = require('us-atlas/counties-10m.json');

/* Who we work for, by county.
   core: the four counties named sitewide (consts COUNTIES, schema areaServed).
   served: counties that hold a town page. */
const CORE = ['Bell', 'Coryell', 'Milam', 'Falls'];
const SERVED = ['Lampasas', 'McLennan', 'Williamson', 'Hamilton', 'McCulloch'];

/* Town coordinates are town centers, rounded. kind: trap = has a hog
   trapping page; hunt = we guide hunts near it; both = both.
   lx/ly/la nudge the label so neighbors don't collide. */
const TOWNS = [
  { name: 'Killeen', lat: 31.117, lon: -97.728, slug: 'hog-trapping-killeen-tx', kind: 'trap', la: 'middle', lx: 0, ly: 34, base: true },
  { name: 'Copperas Cove', lat: 31.124, lon: -97.903, slug: 'hog-trapping-copperas-cove-tx', kind: 'trap', la: 'end', lx: -10, ly: -12 },
  { name: 'Temple', lat: 31.098, lon: -97.343, slug: 'hog-trapping-temple-tx', kind: 'trap', la: 'start', lx: 10, ly: -6 },
  { name: 'Belton', lat: 31.056, lon: -97.464, slug: 'hog-trapping-belton-tx', kind: 'trap', la: 'middle', lx: 0, ly: 28 },
  { name: 'Salado', lat: 30.947, lon: -97.539, slug: 'hog-trapping-salado-tx', kind: 'both', la: 'end', lx: -10, ly: 5 },
  { name: 'Gatesville', lat: 31.435, lon: -97.744, slug: 'hog-trapping-gatesville-tx', kind: 'both', la: 'end', lx: -10, ly: 4 },
  { name: 'Jonesboro', lat: 31.615, lon: -97.876, slug: 'hog-trapping-jonesboro-tx', kind: 'trap', la: 'end', lx: -10, ly: 4 },
  { name: 'McGregor', lat: 31.444, lon: -97.409, slug: 'hog-trapping-mcgregor-tx', kind: 'trap', la: 'start', lx: 10, ly: -4 },
  { name: 'Moody', lat: 31.309, lon: -97.361, slug: 'hog-trapping-moody-tx', kind: 'trap', la: 'start', lx: 10, ly: 4 },
  { name: 'Lampasas', lat: 31.064, lon: -98.182, slug: 'hog-trapping-lampasas-tx', kind: 'trap', la: 'end', lx: -10, ly: 4 },
  { name: 'Jarrell', lat: 30.825, lon: -97.605, slug: 'hog-trapping-jarrell-tx', kind: 'trap', la: 'end', lx: -10, ly: 5 },
  { name: 'Buckholts', lat: 30.872, lon: -97.128, slug: 'hog-trapping-buckholts-tx', kind: 'trap', la: 'start', lx: 10, ly: 5 },
  { name: 'Brady', lat: 31.135, lon: -99.335, slug: 'hog-trapping-brady-tx', kind: 'trap', la: 'start', lx: 10, ly: 4 },
  { name: 'Marlin', lat: 31.306, lon: -96.898, kind: 'hunt', la: 'start', lx: 10, ly: 4 },
  { name: 'Rogers', lat: 30.932, lon: -97.23, kind: 'hunt', la: 'start', lx: 9, ly: -6 },
  { name: 'Holland', lat: 30.878, lon: -97.403, kind: 'hunt', la: 'start', lx: 9, ly: 9 },
];

/* County label positions where the centroid lands on a town (region map px). */
/* Values are viewBox units. null = no label (Bell is crowded with towns; the
   Killeen base marker and the core shading carry it). */
const COUNTY_LABEL = { Bell: null, Coryell: [571, 286], Falls: [853, 317], Lampasas: [420, 277] };

const r1 = (n) => Math.round(n * 10) / 10;
/* Shorten path strings: one decimal is plenty at these sizes. */
const tidy = (d) => (d || '').replace(/-?\d+\.\d+/g, (m) => String(r1(+m)));

const all = feature(topo, topo.objects.counties).features.filter((f) => String(f.id).startsWith('48'));
const nameOf = (f) => f.properties.name;
const tx = { type: 'FeatureCollection', features: all };
const stateMesh = mesh(topo, topo.objects.counties, (a, b) => a === b && String(a.id).startsWith('48'));
const countyMesh = mesh(topo, topo.objects.counties, (a, b) => a !== b && String(a.id).startsWith('48') && String(b.id).startsWith('48'));

const conic = () => geoConicConformal().parallels([27.5, 35]).rotate([100, 0]);

/* ---------------------------------------------------------------- state */
const SW = 320, SH = 306;
const sp = conic().fitExtent([[6, 6], [SW - 6, SH - 6]], tx);
const spath = geoPath(sp);
const workSet = new Set([...CORE, ...SERVED]);
const work = all.filter((f) => workSet.has(nameOf(f)));
const [[bx0, by0], [bx1, by1]] = spath.bounds({ type: 'FeatureCollection', features: work });

const state = {
  w: SW,
  h: SH,
  outline: tidy(spath(stateMesh)),
  lines: tidy(spath(countyMesh)),
  core: tidy(spath({ type: 'FeatureCollection', features: all.filter((f) => CORE.includes(nameOf(f))) })),
  served: tidy(spath({ type: 'FeatureCollection', features: all.filter((f) => SERVED.includes(nameOf(f))) })),
  box: { x: r1(bx0 - 4), y: r1(by0 - 4), w: r1(bx1 - bx0 + 8), h: r1(by1 - by0 + 8) },
};

/* --------------------------------------------------------------- region */
const RW = 1000, RH = 620;
const rp = conic().fitExtent([[24, 24], [RW - 24, RH - 24]], { type: 'FeatureCollection', features: work });
const rpath = geoPath(rp);
const inView = (f) => {
  const [[x0, y0], [x1, y1]] = rpath.bounds(f);
  return x1 > 0 && x0 < RW && y1 > 0 && y0 < RH;
};
const regionCounties = all.filter(inView).map((f) => {
  const n = nameOf(f);
  const [cx, cy] = rpath.centroid(f);
  return {
    name: n,
    tier: CORE.includes(n) ? 'core' : SERVED.includes(n) ? 'served' : 'other',
    d: tidy(rpath(f)),
    label: COUNTY_LABEL[n] !== null,
    cx: COUNTY_LABEL[n] ? COUNTY_LABEL[n][0] : r1(cx),
    cy: COUNTY_LABEL[n] ? COUNTY_LABEL[n][1] : r1(cy),
  };
});
const towns = TOWNS.map((t) => {
  const [x, y] = rp([t.lon, t.lat]);
  return { ...t, x: r1(x), y: r1(y) };
});

const out = {
  source: 'US Census Bureau cartographic boundaries via us-atlas 3.0.1 (counties-10m)',
  built: new Date().toISOString().slice(0, 10),
  state,
  region: { w: RW, h: RH, counties: regionCounties, outline: tidy(rpath(stateMesh)), towns },
};
writeFileSync('src/data/texas-map.json', JSON.stringify(out));
console.log(`texas-map.json: ${regionCounties.length} region counties, ${towns.length} towns, ${Math.round(JSON.stringify(out).length / 1024)} KB`);
