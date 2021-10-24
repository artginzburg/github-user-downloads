const { Octokit } = require('@octokit/rest');

async function getUserDownloads(username, auth) {
  const octokit = new Octokit({ auth });

  const userDownloads = {
    total: 0,
    data: [],
  };

  const { data: repos } = await octokit.rest.repos.listForUser({
    username,
  });

  for (const repo of repos) {
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: repo.owner.login,
      repo: repo.name,
    });

    if (!releases.length) {
      continue;
    }

    let repoDownloadCount = 0;

    for (const release of releases) {
      const { data: assets } = await octokit.rest.repos.listReleaseAssets({
        owner: repo.owner.login,
        repo: repo.name,
        release_id: release.id,
      });

      repoDownloadCount += assets.reduce((accum, asset) => accum + asset.download_count, 0);
    }

    userDownloads.total += repoDownloadCount;
    userDownloads.data.push({ name: repo.name, download_count: repoDownloadCount });
  }

  return userDownloads;
}

module.exports = getUserDownloads;
