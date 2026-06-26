const { Octokit } = require('@octokit/rest');

const { mapWithConcurrency } = require('./lib/mapWithConcurrency');
const { withRetry } = require('./lib/withRetry');

const sumDownloads = (accum, asset) => accum + asset.download_count;

/**
 * GitHub trips its secondary rate limit (dropped connections / 403s) when hit with
 * an unbounded burst, so we cap how many repos and releases are queried at once.
 * The product is the worst-case in-flight request count.
 */
const REPO_CONCURRENCY = 4;
const RELEASE_CONCURRENCY = 4;

module.exports = async function getUserDownloads(username, auth = process.env.GITHUB_TOKEN) {
  const { rest } = new Octokit({
    auth,
    // This (old) Octokit pulls in node-fetch@2, which throws "Premature close" on
    // Node 24+ (the default on GitHub Actions since mid-2026). Hand it the runtime's
    // native fetch (undici) instead, which handles the connection correctly.
    ...(typeof fetch === 'function' ? { request: { fetch } } : {}),
  });

  const userDownloads = {
    total: 0,
    data: [],
  };

  const { data: repos } = await withRetry(() => rest.repos.listForUser({ username }));

  const mapRepo = async (repo) => {
    const { data: releases } = await withRetry(() =>
      rest.repos.listReleases({ owner: repo.owner.login, repo: repo.name }),
    );

    if (!releases.length) {
      return;
    }

    let repoDownloadCount = 0;

    const mapRelease = async (release) => {
      const { data: assets } = await withRetry(() =>
        rest.repos.listReleaseAssets({
          owner: repo.owner.login,
          repo: repo.name,
          release_id: release.id,
        }),
      );

      repoDownloadCount += assets.reduce(sumDownloads, 0);
    };

    await mapWithConcurrency(releases, RELEASE_CONCURRENCY, mapRelease);

    userDownloads.total += repoDownloadCount;
    userDownloads.data.push({ name: repo.name, download_count: repoDownloadCount });
  };

  await mapWithConcurrency(repos, REPO_CONCURRENCY, mapRepo);

  return userDownloads;
};
