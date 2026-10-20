/* Reviews. Server-rendered on /reviews so Google can read them (rule 7: no
   client-side widgets as the only copy). Only real reviews, quoted exactly as
   written, with the platform they came from. Add the reviewer's first name
   only if the review is public under that name.

   The totals are what the platforms showed on 2026-10-20. Update them when you
   add reviews, and keep them matching the Business Profile. */

export const TOTALS = {
  google: { rating: '5.0', count: 5, read: '2026-10-20' },
  facebook: { rating: '5.0', count: 9, read: '2026-10-20' },
};

export type Review = { quote: string; source: 'Google' | 'Facebook'; name?: string; service?: string };

export const REVIEWS: Review[] = [
  { quote: 'Professional, well organized , safe and great spots to hunt!', source: 'Google' },
];

/* Google review link: Business Profile > Ask for reviews > copy link. Paste
   it here and the "Leave a review" button appears. */
export const REVIEW_LINKS = {
  google: '',
  facebook: 'https://www.facebook.com/redcreekoutdoorz/reviews',
};
