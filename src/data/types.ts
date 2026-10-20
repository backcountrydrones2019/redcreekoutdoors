export type Source = { label: string; url: string };
export type Section = { h2: string; paras: string[]; list?: string[] };
export type QA = { q: string; a: string };

export type Hunt = {
  slug: string;
  name: string;
  title: string;
  h1: string;
  description: string;
  lede: string;
  /** Short card text for the index and home pages. */
  card: string;
  priceText: string;
  /** Offers for schema. Amounts straight from consts PRICES. */
  offers: { name: string; amount: number; unit: string }[];
  whenShort: string;
  sections: Section[];
  /** "What you need before you come", every line sourced. */
  requirements: { text: string; source: Source }[];
  faq: QA[];
  sources: Source[];
};

export type Town = {
  slug: string;
  town: string;
  county: string;
  title: string;
  h1: string;
  description: string;
  lede: string;
  /** One line for the areas hub card. */
  summary: string;
  facts: { label: string; value: string }[];
  sections: Section[];
  faq: QA[];
  sources: Source[];
};
