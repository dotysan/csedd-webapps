# Web Applications for the Central Sierra Economic Development District

This is a mono-repo for various ideas, proototypes, & web applications
used by the CSEDD team. Some ideas may swim. Others may sink.

## Develoment

Create a virtual environment by typing `make`. Then activate it with
`source .venv/bin/activate`.

To contribute, create your working branch. `git switch -c feature1` (Use
a more descriptive branch name besides `feature`.)

Put all commits on your named branch. Push it to GitHub and create a
Pull Request.

### Cloudflare Workers (serverless)

If you want to edit Cloudflare Workers, you'll need to create an API
Token here <https://dash.cloudflare.com/profile/api-tokens> and then add
it to your .env file.

```.env
#======================================================================
# Cloudflare Wrangler
# https://developers.cloudflare.com/workers/wrangler/system-environment-variables/

CLOUDFLARE_ACCOUNT_ID=''

CLOUDFLARE_API_TOKEN=''

#WRANGLER_LOG=warn
#WRANGLER_LOG=info
WRANGLER_LOG=log
#WRANGLER_LOG=debug
```

## Subdirectories / Projects

### [tcspeedtest.com](tcspeedtest.com)

The original BEAD speed tests for Tuolumne County written by Len De
Groot.

### [api](api)

Possible Cloudflare Worker API using OpenAPI, chanfana, and Hono.

### [svelte-app](svelte-app)

Possible Cloudflare Worker app using Svelte.

## Other Subdirs

### [BigQuery](BigQuery)

Notes on how to access the aggregated data.
