

tcst-update:
	wget -m https://tcspeedtest.com/
	wget -m https://tcspeedtest.com/data/Tuco_FCC_avail_12312024.csv
	git lfs install
	git lfs track
