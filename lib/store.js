// Stage 3: store — persist one snapshot to SQLite and emit competitors.csv.

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', 'competitors.db');
const CSV_PATH = path.join(__dirname, '..', 'competitors.csv');

function openDb() {
  const db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS repos (
      full_name TEXT NOT NULL,
      snapshot_date TEXT NOT NULL,
      owner_login TEXT,
      owner_type TEXT,
      html_url TEXT,
      description TEXT,
      homepage TEXT,
      stargazers_count INTEGER,
      forks_count INTEGER,
      open_issues_count INTEGER,
      watchers_count INTEGER,
      topics TEXT,
      language TEXT,
      languages TEXT,
      license_spdx_id TEXT,
      created_at TEXT,
      pushed_at TEXT,
      contributor_count INTEGER,
      top_contributors TEXT,
      release_count INTEGER,
      latest_release_tag TEXT,
      latest_release_date TEXT,
      weekly_commits TEXT,
      recent_commits TEXT,
      discovered_via_query TEXT,
      PRIMARY KEY (full_name, snapshot_date)
    );

    CREATE TABLE IF NOT EXISTS readmes (
      full_name TEXT NOT NULL,
      snapshot_date TEXT NOT NULL,
      markdown TEXT,
      PRIMARY KEY (full_name, snapshot_date)
    );
  `);

  const existingCols = new Set(db.prepare('PRAGMA table_info(repos)').all().map((c) => c.name));
  if (!existingCols.has('owner_login')) db.exec('ALTER TABLE repos ADD COLUMN owner_login TEXT');
  if (!existingCols.has('owner_type')) db.exec('ALTER TABLE repos ADD COLUMN owner_type TEXT');

  return db;
}

function toCsvField(f) {
  const s = String(f ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(records) {
  const header = [
    'rank', 'repo', 'owner_login', 'owner_type', 'stars', 'description', 'language',
    'last_push', 'topics', 'url', 'website',
  ];
  const sorted = [...records].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const rows = sorted.map((r, i) => [
    i + 1,
    r.full_name,
    r.owner_login,
    r.owner_type,
    r.stargazers_count,
    r.description,
    r.language,
    (r.pushed_at || '').slice(0, 10),
    (r.topics || []).join('; '),
    r.html_url,
    r.homepage || '',
  ].map(toCsvField).join(','));

  fs.writeFileSync(CSV_PATH, [header.map(toCsvField).join(','), ...rows].join('\n'));
}

// Idempotent: re-running on the same day overwrites that day's snapshot.
function store(records, snapshotDate) {
  const db = openDb();

  const deleteRepos = db.prepare('DELETE FROM repos WHERE snapshot_date = ?');
  const deleteReadmes = db.prepare('DELETE FROM readmes WHERE snapshot_date = ?');
  const insertRepo = db.prepare(`
    INSERT INTO repos (
      full_name, snapshot_date, owner_login, owner_type, html_url, description, homepage,
      stargazers_count, forks_count, open_issues_count, watchers_count,
      topics, language, languages, license_spdx_id, created_at, pushed_at,
      contributor_count, top_contributors, release_count, latest_release_tag,
      latest_release_date, weekly_commits, recent_commits, discovered_via_query
    ) VALUES (
      @full_name, @snapshot_date, @owner_login, @owner_type, @html_url, @description, @homepage,
      @stargazers_count, @forks_count, @open_issues_count, @watchers_count,
      @topics, @language, @languages, @license_spdx_id, @created_at, @pushed_at,
      @contributor_count, @top_contributors, @release_count, @latest_release_tag,
      @latest_release_date, @weekly_commits, @recent_commits, @discovered_via_query
    )
  `);
  const insertReadme = db.prepare(
    'INSERT INTO readmes (full_name, snapshot_date, markdown) VALUES (?, ?, ?)'
  );

  const previousRepos = new Set(
    db.prepare('SELECT DISTINCT full_name FROM repos WHERE snapshot_date < ?').all(snapshotDate)
      .map((r) => r.full_name)
  );

  const tx = db.transaction((records) => {
    deleteRepos.run(snapshotDate);
    deleteReadmes.run(snapshotDate);
    for (const r of records) {
      insertRepo.run({
        full_name: r.full_name,
        snapshot_date: r.snapshot_date,
        owner_login: r.owner_login,
        owner_type: r.owner_type,
        html_url: r.html_url,
        description: r.description,
        homepage: r.homepage,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        open_issues_count: r.open_issues_count,
        watchers_count: r.watchers_count,
        topics: JSON.stringify(r.topics || []),
        language: r.language,
        languages: JSON.stringify(r.languages),
        license_spdx_id: r.license_spdx_id,
        created_at: r.created_at,
        pushed_at: r.pushed_at,
        contributor_count: r.contributor_count,
        top_contributors: JSON.stringify(r.top_contributors),
        release_count: r.release_count,
        latest_release_tag: r.latest_release_tag,
        latest_release_date: r.latest_release_date,
        weekly_commits: JSON.stringify(r.weekly_commits),
        recent_commits: JSON.stringify(r.recent_commits),
        discovered_via_query: r.discovered_via_query,
      });
      insertReadme.run(r.full_name, r.snapshot_date, r.readme_markdown);
    }
  });
  tx(records);

  db.close();

  writeCsv(records);

  const newSince = records.filter((r) => !previousRepos.has(r.full_name)).map((r) => r.full_name);
  return { newSince };
}

module.exports = { store, DB_PATH, CSV_PATH };
