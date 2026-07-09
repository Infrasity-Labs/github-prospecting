#!/usr/bin/env node
// run.js — orchestrates discover -> enrich -> store.
// Usage: GITHUB_TOKEN=ghp_xxx node run.js [--keywords "kw1, kw2"] [--no-store]
// --keywords (or KEYWORDS env) generates search queries for any market;
// without it, the hand-tuned list in config/queries.json is used.
// Stages run in sequence as one command; there's no separate CLI flag to
// run enrich/store independently since they depend on discover's output.
// --no-store skips writing competitors.db/competitors.csv and prints the
// enriched JSON to stdout instead.

const { discover } = require('./lib/discover');
const { enrich } = require('./lib/enrich');
const { store } = require('./lib/store');
const { stats } = require('./lib/github');

const noStore = process.argv.includes('--no-store');

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const snapshotDate = todayIso();
  const startedAt = Date.now();

  console.error(`=== competitor discovery pipeline: ${snapshotDate} ===\n`);

  const { candidates, discoveredCount, filteredCount } = await discover();
  console.error(`\ndiscovered ${discoveredCount} unique repos, ${filteredCount} passed filters\n`);

  const enriched = await enrich(candidates, snapshotDate);
  console.error(`\nenriched ${enriched.length}/${filteredCount} repos\n`);

  const newSince = noStore ? [] : store(enriched, snapshotDate).newSince;

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.error('=== run summary ===');
  console.error(`snapshot date:        ${snapshotDate}`);
  console.error(`discovered:           ${discoveredCount}`);
  console.error(`passed filters:       ${filteredCount}`);
  console.error(`enriched:             ${enriched.length}`);
  if (!noStore) {
    console.error(`new since last snap:  ${newSince.length}`);
    if (newSince.length) {
      for (const name of newSince) console.error(`  + ${name}`);
      console.error('  (review these for exclusions.json false positives)');
    }
  }
  console.error(`API requests used:    ${stats.requests}`);
  console.error(`rate limit remaining: ${stats.rateLimitRemaining ?? 'unknown'}`);
  console.error(`elapsed:              ${elapsedSec}s`);
  console.error(`output:               ${noStore ? 'stdout (JSON, no files written)' : 'competitors.db, competitors.csv'}`);

  if (noStore) {
    console.log(JSON.stringify(enriched, null, 2));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
