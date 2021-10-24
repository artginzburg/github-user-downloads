const { Octokit } = require('@octokit/rest');

async function getUserDownloads(username, personalAccessToken) {
  const octokit = new Octokit({ auth: personalAccessToken });

  const { data: repos } = await octokit.rest.repos.listForUser({
    username,
  });

  const userDownloads = {
    total: 0,
    data: [],
  };

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

      const releaseDownloadCount = assets.reduce(
        (releaseDownloadsAccumulator, currentAsset) =>
          releaseDownloadsAccumulator + currentAsset.download_count,
        0,
      );

      repoDownloadCount += releaseDownloadCount;
    }

    userDownloads.total += repoDownloadCount;
    userDownloads.data.push([{ name: repo.name, download_count: repoDownloadCount }]);
  }

  return userDownloads;
}

module.exports = getUserDownloads;
