# Web Applications for the Central Sierra Economic Development District

This is a mono-repo for various ideas, proototypes, & web applications
used by the CSEDD team.

## Develoment

Create a virtual environment by typing `make`. Then activate it with
`source .venv/bin/activate`.

If you want to edit Cloudflare Workers, you'll need to create an API
Token here <https://dash.cloudflare.com/profile/api-tokens> and then add
it to your .env file.

```.env
#======================================================================
# Cloudflare Wrangler
# https://developers.cloudflare.com/workers/wrangler/system-environment-variables/

CLOUDFLARE_ACCOUNT_ID='''

CLOUDFLARE_API_TOKEN=''

#WRANGLER_LOG=warn
#WRANGLER_LOG=info
WRANGLER_LOG=log
#WRANGLER_LOG=debug
```

## Subdirectories / Projects

### tcspeedtest.com

The original BEAD speed tests for Tuolumne County written by Len De
Groot.
