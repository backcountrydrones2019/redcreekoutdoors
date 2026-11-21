-- Web & Social screen. The Red Creek Command Board run (Mon and Fri 08:45 CT)
-- writes its board documents here through the Cloudflare connector, one row per
-- document, in the same JSON shapes as the board artifact. Names are a contract
-- with that run: meta, lanes, history, series, social, events, content, tasks.
CREATE TABLE cmd_docs (
  name        TEXT PRIMARY KEY,
  json        TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  updated_by  TEXT NOT NULL
);

-- Approve / Not now taps on proposed tasks in the Back Office. The board run
-- reads these, applies them to the board, then deletes the rows it applied.
CREATE TABLE cmd_decisions (
  id        TEXT PRIMARY KEY,             -- task id, RC-<n>
  decision  TEXT NOT NULL,                -- approve | disapprove
  reason    TEXT,
  who       TEXT NOT NULL,
  email     TEXT NOT NULL,
  at        TEXT NOT NULL
);
