#!/usr/bin/env node
// run-fast.js - discover-only, writes competitors.csv straight from GitHub
// search results (which already carry stars/description/homepage/etc.),
// skipping the per-repo enrichment stage that trips GitHub's secondary
// rate limit at this candidate volume.
// Usage: node run-fast.js [--keywords "kw1, kw2"] - same query resolution
// as run.js (keywords, KEYWORDS env, or config/queries.json fallback).

const fs = require('fs');
const path = require('path');
const { discover } = require('./lib/discover');
const { stats } = require('./lib/github');

function toCsvField(f) {
  const s = String(f ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const startedAt = Date.now();
  const { candidates, discoveredCount } = await discover();

  const rows = candidates.map(({ repo, query }, i) => [
    i + 1,
    repo.full_name,
    repo.owner?.login ?? '',
    repo.owner?.type ?? '',
    repo.stargazers_count,
    repo.description ?? '',
    repo.language ?? '',
    (repo.pushed_at || '').slice(0, 10),
    (repo.topics || []).join('; '),
    repo.html_url,
    repo.homepage ?? '',
    query,
  ].map(toCsvField).join(','));

  const header = [
    'rank', 'repo', 'owner_login', 'owner_type', 'stars', 'description', 'language',
    'last_push', 'topics', 'url', 'website', 'discovered_via_query',
  ];

  fs.writeFileSync(
    path.join(__dirname, 'competitors.csv'),
    [header.map(toCsvField).join(','), ...rows].join('\n')
  );

  console.error(`discovered ${discoveredCount} unique repos`);
  console.error(`wrote ${rows.length} rows to competitors.csv`);
  console.error(`API requests used: ${stats.requests}`);
  console.error(`elapsed: ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
