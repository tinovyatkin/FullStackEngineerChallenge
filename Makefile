SHELL = /bin/bash

MIN_DOCKER_CLIENT_VERSION = 17.03
MIN_DOCKER_SERVER_VERSION = 17.03

.PHONY: build run stop clean

all: prerequisites build run

build:
	docker build -t paypay-recruit .

run:
	docker run -d --restart=always --name=paypay-recruit \
		-p 9999:80 \
		-v $(CURDIR)/api/src:/app/api/src \
		-v $(CURDIR)/api/test:/app/api/test \
		-v $(CURDIR)/frontend/src:/app/frontend/src \
		-v $(CURDIR)/frontend/pages:/app/frontend/pages \
		-v $(CURDIR)/frontend/layouts:/app/frontend/layouts \
		-v $(CURDIR)/frontend/components:/app/frontend/components \
		-v $(CURDIR)/frontend/store:/app/frontend/store \
		-v $(CURDIR)/frontend/middleware:/app/frontend/middleware \
		-v $(CURDIR)/frontend/static:/app/frontend/static \
		-v $(CURDIR)/frontend/tests:/app/frontend/tests \
		paypay-recruit
	@echo All done! Open http://localhost:9999/readme/ for instructions

clean:
	@echo -n "Are you sure [yN]? " \
		&& read ans && [ $$ans == y ]
	docker stop paypay-recruit
	docker rm paypay-recruit
	docker rmi paypay-recruit

# Check docker version
prerequisites:
	@if [[ "$$(docker version -f '{{.Server.Version}}')" < \
		"$(MIN_DOCKER_SERVER_VERSION)" ]]; \
		then echo 'Docker server version $(MIN_DOCKER_SERVER_VERSION) needed.'; \
		exit 2; fi
	@if [[ "$$(docker version -f '{{.Client.Version}}')" < \
		"$(MIN_DOCKER_CLIENT_VERSION)" ]]; \
		then echo 'Docker client version $(MIN_DOCKER_CLIENT_VERSION) needed.'; \
		exit 2; fi

