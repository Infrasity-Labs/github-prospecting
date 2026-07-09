// Shared GitHub REST API client: auth headers, rate-limit handling, retries.

const HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'competitor-discovery-pipeline',
};
if (process.env.GITHUB_TOKEN) {
  HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stats = { requests: 0, rateLimitRemaining: null };

// Returns { ok, status, json, res } - never throws on HTTP errors.
// Retries once on 403/429 by sleeping until x-ratelimit-reset.
async function ghFetch(url, { allow404 = false, networkRetries = 3 } = {}) {
  stats.requests += 1;
  try {
    const res = await fetch(url, { headers: HEADERS });

    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining !== null) stats.rateLimitRemaining = Number(remaining);

    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('x-ratelimit-reset');
      const waitMs = reset ? Math.max(0, reset * 1000 - Date.now()) + 1000 : 60000;
      console.error(`  rate limited on ${url}, waiting ${Math.ceil(waitMs / 1000)}s`);
      await sleep(waitMs);
      return ghFetch(url, { allow404 });
    }

    if (res.status === 404 && allow404) {
      return { ok: false, status: 404, json: null };
    }

    if (!res.ok) {
      return { ok: false, status: res.status, json: null };
    }

    const json = await res.json();
    return { ok: true, status: res.status, json };
  } catch (err) {
    if (networkRetries <= 0) throw err;
    console.error(`  network error on ${url} (${err.message}), retrying...`);
    await sleep(2000);
    return ghFetch(url, { allow404, networkRetries: networkRetries - 1 });
  }
}

module.exports = { ghFetch, sleep, stats, HEADERS };
