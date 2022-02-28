# Purpose

Getting total number of downloads
for all releases
of all repositories
of a GitHub user
by username

# Preparation

> Assuming you have Node.JS installed

1. Create a Personal Access Token (Following [GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token))
   > No scopes (permissions) needed — just the token

# Usage

## As a CLI

```ps1
GITHUB_TOKEN=ghp_321yourPersonalAccessToken npx @artginzburg/github-user-downloads username
```

> if username is ommited, uses $USER environment variable instead.

## As an ES module

I'm personally using it via a GitHub Action with `cron` to fetch my stats daily. Also, GitHub Actions provide you a GITHUB_TOKEN, with no need to create it manually.

<br/>

# Testing

1. Clone the repo
2. Install dependencies (`npm i`)
3. Set `GITHUB_TOKEN` and `USER` (if your local username is not the one you want to check) environmental variables (use `.env` file if you want)
4. Run `npm test`, or `npm start username`
