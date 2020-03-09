test_case=all

server:
	/home/ubuntu/.nvm/versions/node/v13.10.1/bin/node ./backend/app.js 0

server1:
	/home/ubuntu/.nvm/versions/node/v13.10.1/bin/node ./backend/app.js 1

server2:
	/home/ubuntu/.nvm/versions/node/v13.10.1/bin/node ./backend/app.js 2

server3:
	/home/ubuntu/.nvm/versions/node/v13.10.1/bin/node ./backend/app.js 3

server4:
	/home/ubuntu/.nvm/versions/node/v13.10.1/bin/node ./backend/app.js 4

test:
	/home/ubuntu/.nvm/versions/node/v13.10.1/bin/node ./backend/unit_test.js $(test_case)