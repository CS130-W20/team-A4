SHELL:=/bin/bash   # HERE: this is setting the shell for b only
server_up:
	@"$(which node)" ./src/backend/app