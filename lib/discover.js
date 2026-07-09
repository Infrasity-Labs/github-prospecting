// Stage 1: discover — run search queries, dedupe, filter.

const { ghFetch, sleep, stats } = require('./github');
const queries = require('../config/queries.json');
const thresholds = require('../config/thresholds.json');

async function searchOne(query) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc&per_page=${thresholds.searchPerPage}`;
  const { ok, json, status } = await ghFetch(url);
  if (!ok) {
    console.error(`  query failed (${status}): ${query}`);
    return [];
  }
  return json.items || [];
}

// Filtering disabled: return every discovered repo unfiltered for manual review.
function isRelevant(_repo) {
  return true;
}

// Returns { candidates: [{ repo, discoveredViaQuery }], discoveredCount, filteredCount }
async function discover() {
  const seen = new Map(); // full_name -> { repo, query }

  for (const q of queries) {
    console.error(`searching: ${q}`);
    const items = await searchOne(q);
    for (const repo of items) {
      if (!seen.has(repo.full_name)) seen.set(repo.full_name, { repo, query: q });
    }
    const delay = process.env.GITHUB_TOKEN
      ? thresholds.searchDelayMsAuthed
      : thresholds.searchDelayMsUnauthed;
    await sleep(delay);
  }

  const discoveredCount = seen.size;
  const candidates = [...seen.values()]
    .filter(({ repo }) => isRelevant(repo))
    .sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count);

  return { candidates, discoveredCount, filteredCount: candidates.length };
}

module.exports = { discover, isRelevant };
