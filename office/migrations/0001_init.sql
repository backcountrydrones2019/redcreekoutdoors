-- RCO Back Office. Leads, hunts, call backs and an activity log of who did what.
-- Nothing is deleted: leads close, hunts cancel, call backs get marked done.

CREATE TABLE leads (
  id          TEXT PRIMARY KEY,            -- website ref (RH-, RC-, RCH-) or OFF-<n> for ones added by hand
  kind        TEXT NOT NULL,               -- hunt | trap | question
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  summary     TEXT,                        -- one line for the list
  details     TEXT,                        -- JSON [[label, value], ...] of what they asked for
  status      TEXT NOT NULL DEFAULT 'new', -- new | talked | booked | lost
  source      TEXT NOT NULL,               -- website | added
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  created_by  TEXT NOT NULL
);
CREATE INDEX leads_status ON leads(status, created_at);

CREATE TABLE hunts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id      TEXT REFERENCES leads(id),
  client       TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  hunt_type    TEXT NOT NULL,              -- value from the site's HUNT_OPTIONS
  date         TEXT NOT NULL,              -- YYYY-MM-DD
  start_time   TEXT,
  town         TEXT,
  guns         INTEGER,
  total        INTEGER,                    -- whole dollars
  deposit      TEXT NOT NULL DEFAULT 'due',-- due | paid | full
  guide        TEXT,
  status       TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | done | canceled
  hogs         INTEGER,
  deer         INTEGER,
  other_game   INTEGER,
  result_notes TEXT,
  notes        TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  created_by   TEXT NOT NULL
);
CREATE INDEX hunts_date ON hunts(date);
CREATE INDEX hunts_lead ON hunts(lead_id);

CREATE TABLE callbacks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     TEXT REFERENCES leads(id),
  hunt_id     INTEGER REFERENCES hunts(id),
  due         TEXT NOT NULL,               -- YYYY-MM-DD
  note        TEXT NOT NULL,
  done_at     TEXT,
  done_by     TEXT,
  created_at  TEXT NOT NULL,
  created_by  TEXT NOT NULL
);
CREATE INDEX callbacks_open ON callbacks(done_at, due);

-- Who did what. Every change in the Back Office writes one row. Never edited.
CREATE TABLE activity (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  at       TEXT NOT NULL,
  who      TEXT NOT NULL,                  -- display name
  email    TEXT NOT NULL,
  lead_id  TEXT,
  hunt_id  INTEGER,
  kind     TEXT NOT NULL,                  -- note | event
  text     TEXT NOT NULL
);
CREATE INDEX activity_at ON activity(at);
CREATE INDEX activity_lead ON activity(lead_id);
CREATE INDEX activity_hunt ON activity(hunt_id);

CREATE TRIGGER activity_no_update BEFORE UPDATE ON activity BEGIN SELECT RAISE(ABORT, 'activity is append-only'); END;
CREATE TRIGGER activity_no_delete BEFORE DELETE ON activity BEGIN SELECT RAISE(ABORT, 'activity is append-only'); END;

CREATE TABLE meta (k TEXT PRIMARY KEY, v TEXT);
