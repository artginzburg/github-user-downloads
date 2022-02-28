const { Octokit } = require('@octokit/rest');

const sumDownloads = (accum, asset) => accum + asset.download_count;

module.exports = async function getUserDownloads(username, auth = process.env.GITHUB_TOKEN) {
  const { rest } = new Octokit({ auth });

  const userDownloads = {
    total: 0,
    data: [],
  };

  const { data: repos } = await rest.repos.listForUser({
    username,
  });

  const mapRepo = async (repo) => {
    const { data: releases } = await rest.repos.listReleases({
      owner: repo.owner.login,
      repo: repo.name,
    });

    if (!releases.length) {
      return;
    }

    let repoDownloadCount = 0;

    const mapRelease = async (release) => {
      const { data: assets } = await rest.repos.listReleaseAssets({
        owner: repo.owner.login,
        repo: repo.name,
        release_id: release.id,
      });

      repoDownloadCount += assets.reduce(sumDownloads, 0);
    };

    await Promise.all(releases.map(mapRelease));

    userDownloads.total += repoDownloadCount;
    userDownloads.data.push({ name: repo.name, download_count: repoDownloadCount });
  };

  await Promise.all(repos.map(mapRepo));

  return userDownloads;
};
