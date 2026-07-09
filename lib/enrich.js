// Stage 2: enrich - pull full metadata for each candidate repo.

const { ghFetch, sleep } = require('./github');
const thresholds = require('../config/thresholds.json');

async function fetchReadme(fullName) {
  const { ok, json } = await ghFetch(
    `https://api.github.com/repos/${fullName}/readme`,
    { allow404: true }
  );
  if (!ok || !json?.content) return null;
  return Buffer.from(json.content, json.encoding || 'base64').toString('utf-8');
}

async function fetchReleases(fullName) {
  const { ok, json } = await ghFetch(
    `https://api.github.com/repos/${fullName}/releases?per_page=${thresholds.releasesPerPage}`,
    { allow404: true }
  );
  if (!ok || !Array.isArray(json)) return { release_count: null, latest_release_tag: null, latest_release_date: null };
  return {
    release_count: json.length,
    latest_release_tag: json[0]?.tag_name ?? null,
    latest_release_date: json[0]?.published_at ?? null,
  };
}

async function fetchContributors(fullName) {
  const { ok, json } = await ghFetch(
    `https://api.github.com/repos/${fullName}/contributors?per_page=${thresholds.contributorsPerPage}`,
    { allow404: true }
  );
  if (!ok || !Array.isArray(json)) return { contributor_count: null, top_contributors: null };
  return {
    contributor_count: json.length,
    top_contributors: json.map((c) => ({ login: c.login, contributions: c.contributions })),
  };
}

async function fetchLanguages(fullName) {
  const { ok, json } = await ghFetch(`https://api.github.com/repos/${fullName}/languages`, {
    allow404: true,
  });
  if (!ok) return null;
  return json;
}

async function fetchCommitActivity(fullName) {
  for (let attempt = 0; attempt < thresholds.commitActivityMaxRetries; attempt++) {
    const { ok, status, json } = await ghFetch(
      `https://api.github.com/repos/${fullName}/stats/commit_activity`,
      { allow404: true }
    );
    if (status === 202) {
      await sleep(thresholds.commitActivityRetryDelayMs);
      continue;
    }
    if (!ok || !Array.isArray(json)) return null;
    return json.map((w) => ({ week: w.week, total: w.total }));
  }
  return null;
}

async function fetchRecentCommits(fullName) {
  const { ok, json } = await ghFetch(
    `https://api.github.com/repos/${fullName}/commits?per_page=${thresholds.recentCommitsPerPage}`,
    { allow404: true }
  );
  if (!ok || !Array.isArray(json)) return null;
  return json.map((c) => ({
    sha: c.sha,
    date: c.commit?.author?.date ?? null,
    author: c.author?.login ?? c.commit?.author?.name ?? null,
    message: c.commit?.message?.split('\n')[0] ?? null,
  }));
}

// Enriches one candidate. Returns a full record, with nulls for any field
// whose endpoint failed. Never throws - logs and degrades instead.
async function enrichOne({ repo, query }, snapshotDate) {
  const fullName = repo.full_name;

  const { ok: metaOk, json: meta } = await ghFetch(`https://api.github.com/repos/${fullName}`, {
    allow404: true,
  });
  if (!metaOk) {
    console.error(`  skipping ${fullName}: repo metadata fetch failed (404/removed)`);
    return null;
  }

  const [readme, releases, contributors, languages, weeklyCommits, recentCommits] =
    await Promise.all([
      fetchReadme(fullName),
      fetchReleases(fullName),
      fetchContributors(fullName),
      fetchLanguages(fullName),
      fetchCommitActivity(fullName),
      fetchRecentCommits(fullName),
    ]);

  return {
    full_name: meta.full_name,
    owner_login: meta.owner?.login ?? null,
    owner_type: meta.owner?.type ?? null,
    html_url: meta.html_url,
    description: meta.description,
    homepage: meta.homepage,
    stargazers_count: meta.stargazers_count,
    forks_count: meta.forks_count,
    open_issues_count: meta.open_issues_count,
    watchers_count: meta.watchers_count,
    topics: meta.topics || [],
    language: meta.language,
    languages: languages,
    license_spdx_id: meta.license?.spdx_id ?? null,
    created_at: meta.created_at,
    pushed_at: meta.pushed_at,
    contributor_count: contributors.contributor_count,
    top_contributors: contributors.top_contributors,
    release_count: releases.release_count,
    latest_release_tag: releases.latest_release_tag,
    latest_release_date: releases.latest_release_date,
    weekly_commits: weeklyCommits,
    recent_commits: recentCommits,
    readme_markdown: readme,
    snapshot_date: snapshotDate,
    discovered_via_query: query,
  };
}

// Runs enrichment over all candidates with bounded concurrency.
async function enrich(candidates, snapshotDate) {
  const results = [];
  let i = 0;

  async function worker() {
    while (i < candidates.length) {
      const idx = i++;
      const candidate = candidates[idx];
      console.error(`enriching (${idx + 1}/${candidates.length}): ${candidate.repo.full_name}`);
      const record = await enrichOne(candidate, snapshotDate);
      if (record) results.push(record);
    }
  }

  const workers = Array.from(
    { length: Math.min(thresholds.enrichConcurrency, candidates.length) },
    worker
  );
  await Promise.all(workers);

  return results;
}

module.exports = { enrich };
