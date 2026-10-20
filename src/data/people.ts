/* About page people. Stub pattern from backcountrydrones.com: nothing renders
   until it's real. A person shows with name and role only until `bio` is
   filled in and `published` is true. Photos go in public/img/people/ with
   EXIF stripped (the build pipeline does it, see scripts/images.mjs). */

export type Person = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  published: boolean;
};

export const PEOPLE: Person[] = [
  { name: 'Ray Fazio', role: 'Owner', bio: '', published: false },
  { name: 'Cody Petty', role: 'Owner', bio: '', published: false },
];
