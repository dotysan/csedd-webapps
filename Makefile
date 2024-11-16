
.PHONY: tcst-update
tcst-update: tcspeedtest.com tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv
tcspeedtest.com:
	wget -m https://tcspeedtest.com/
	git lfs install
	git lfs track
tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv:
	wget -m https://tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv
