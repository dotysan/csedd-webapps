
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
