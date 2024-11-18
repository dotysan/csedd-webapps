SHELL:= /usr/bin/env bash
PY:= python3.12

venv:= .venv
vb:= $(venv)/bin

PIP_CACHE_DIR:= $(CURDIR)/.pip
export PIP_CACHE_DIR

NPM_CONFIG_CACHE:= $(CURDIR)/.npm
export NPM_CONFIG_CACHE

export CREATE_CLOUDFLARE_TELEMETRY_DISABLED=1
# or npm create cloudflare telemetry disable

define vrun
	@source $(vb)/activate && $(1)
endef

api:= api
$(api)/wrangler.toml: $(vb)/pnpm
# unlock keyring before create cloudflare so the spinner doesn't screw up the password prompt
	@signingkey=$$(git config user.signingkey); \
	if [[ "$$signingkey" ]]; then \
		gpg --sign --local-user $$signingkey </dev/null >/dev/null; fi
	$(call vrun,pnpm create cloudflare $(api) --type=openapi --no-deploy)

$(vb)/pnpm: $(vb)/npm
	$(call vrun,npm install --global pnpm)

$(vb)/npm: $(vb)/nodeenv
	$(call vrun,nodeenv --python-virtualenv --node=lts && \
		touch -r $(vb)/activate.csh $(vb)/activate && \
		npm install --global npm)
# Note that nodeenv --python-virtualenv above modifies activate,
# so we must reset the mtime to prevent successive runs of make
# from re-installing everything below

$(vb)/nodeenv: $(vb)/pip
	$(call vrun,pip install nodeenv)

$(vb)/pip: $(vb)/activate
	$(call vrun,pip list --format=freeze \
		|grep -oE '^[^=]+' \
		|xargs pip install --upgrade)

$(vb)/activate:
	$(PY) -m venv $(venv)

.PHONY: tcst-update
tcst-update: tcspeedtest.com tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv
tcspeedtest.com:
	wget -m https://tcspeedtest.com/
	git lfs install
	git lfs track
tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv:
	wget -m https://tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv

.PHONY: tcst-ndt7-src
NDT7_SRC:= tcspeedtest.com/ndt7-js/src/ndt7.js \
           tcspeedtest.com/ndt7-js/src/ndt7-download-worker.js \
           tcspeedtest.com/ndt7-js/src/ndt7-upload-worker.js
tcst-ndt7-src: $(NDT7_SRC)
tcspeedtest.com/ndt7-js/src/%.js:
	wget -m https://tcspeedtest.com/ndt7-js/src/$(@F)

.PHONY: clean
clean:
	@if [[ -z "$(venv)" || ! -d "$(venv)" || $(venv) =~ / ]]; then \
		echo "ERROR: venv $(venv) is not a valid directory or contains slashes. Aborting."; \
		exit 1; \
	fi >&2
	rm --force --recursive $(venv)* .pip .npm node_modules

