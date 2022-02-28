# Purpose

Getting total number of downloads
for all releases
of all repositories
of a GitHub user
by username

## Limitations

This is for testing and personal purposes only (for now)

> I'm planning to build sort of an ecosystem around it later

# Preparation

> Assuming you have Node.JS installed

1. Create a Personal Access Token (Following [GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token))
   > No scopes (permissions) needed — just the token

# Testing

1. Clone the repo
2. Install dependencies (`npm i`)
3. Set `GITHUB_TOKEN` and `USER` environmental variables (use `.env` file if you want)
4. Run `npm start`
