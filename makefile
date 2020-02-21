test_case=all

server_up:
	/home/ubuntu/.nvm/versions/node/v13.9.0/bin/node ./backend/app.js

test:
	/home/ubuntu/.nvm/versions/node/v13.9.0/bin/node ./backend/unit_test.js $(test_case)