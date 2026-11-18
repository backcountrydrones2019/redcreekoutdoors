/* Known spam senders on the site forms. A match is stored as spam:<ref>
 * (kept 90 days for review) and never emailed. The sender still lands on
 * /thanks, so a bot gets no signal that it was caught.
 *
 * Add entries lowercase. Phones are digits only.
 */
export const BLOCKED = {
  // "Robertstine": /api/request hunt spam, Nov 13, 15 and 17 (x2) 2026. Justin, 2026-11-17.
  names: ['robertstine'],
  emails: ['aveyekoha655@gmail.com'],
  phones: ['82858471271'],
};

export function isBlocked(name: string, email: string, phone: string): boolean {
  const n = name.trim().toLowerCase();
  const e = email.trim().toLowerCase();
  const p = phone.replace(/\D/g, '');
  return BLOCKED.names.includes(n) || (!!e && BLOCKED.emails.includes(e)) || (!!p && BLOCKED.phones.includes(p));
}
