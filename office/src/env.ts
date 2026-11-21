export interface Env {
  /** RCO Back Office records (D1 rco-office). */
  DB: D1Database;
  /** The public site's KV (LEADS). Read only: new website leads are copied in from here. */
  LEADS?: KVNamespace;
  /** Cloudflare Access team domain, e.g. nameless-union-3413.cloudflareaccess.com. */
  ACCESS_TEAM_DOMAIN?: string;
  /** Application Audience (AUD) tag of the Access application for office.redcreekoutdoors.com. */
  ACCESS_AUD?: string;
  /** "email:Name,email:Name". Only these people get in; the name goes on everything they do. */
  USERS?: string;
  /** Local development only (.dev.vars). */
  DEV_AUTH_EMAIL?: string;
  DEV_AUTH_TOKEN?: string;
}

export interface User {
  email: string;
  name: string;
}
