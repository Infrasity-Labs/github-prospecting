// Query resolution: turn keywords into GitHub search queries, or fall back
// to the hand-tuned list in config/queries.json.
//
// Keyword sources, in priority order:
//   1. CLI:  node run.js --keywords "vector database, embedding search"
//   2. Env:  KEYWORDS="vector database, embedding search"
//   3. None: config/queries.json (ships targeting the agent-memory space
//            as a working example)

const fallbackQueries = require('../config/queries.json');

function parseKeywordsArg(argv) {
  const idx = argv.indexOf('--keywords');
  if (idx !== -1 && argv[idx + 1]) return argv[idx + 1];
  const inline = argv.find((a) => a.startsWith('--keywords='));
  if (inline) return inline.slice('--keywords='.length);
  return null;
}

// Each keyword expands into a few overlapping query shapes; results are
// deduped downstream, so overlap is cheap and improves recall.
function expandKeyword(keyword) {
  const kw = keyword.trim();
  if (!kw) return [];
  const topic = kw.toLowerCase().replace(/\s+/g, '-');
  const queries = [`topic:${topic}`];
  if (/\s/.test(kw)) {
    queries.push(`"${kw}" in:description`);
  } else {
    queries.push(`${kw} in:description`);
  }
  return queries;
}

function resolveQueries(argv = process.argv) {
  const raw = parseKeywordsArg(argv) ?? process.env.KEYWORDS ?? null;
  if (raw === null) return { queries: fallbackQueries, source: 'config/queries.json' };

  const keywords = raw.split(',').map((k) => k.trim()).filter(Boolean);
  if (!keywords.length) {
    throw new Error('--keywords was given but contained no keywords (expected a comma-separated list)');
  }
  const queries = [...new Set(keywords.flatMap(expandKeyword))];
  return { queries, source: `keywords: ${keywords.join(', ')}` };
}

module.exports = { resolveQueries, expandKeyword };
