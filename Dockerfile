FROM node:14.3

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ENV DEBIAN_FRONTEND=noninteractive
# install never mongo version
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
# hadolint ignore=DL3008
RUN apt-get install -yq --no-install-recommends wget gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.2 main" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -yq --no-install-recommends mongodb-org nginx supervisor openssh-server markdown && apt-get autoremove && apt-get autoclean && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir /var/run/sshd

# hadolint ignore=DL3016
RUN npm install -g nodemon @nuxt/core @nuxt/cli @nuxt/typescript-build @nuxt/typescript-runtime

ENV HUSKY_SKIP_INSTALL true
ENV NODE_ENV development
ENV JWT_SECRET jwt_super_secret_1
ENV MONGOHQ_URL=mongodb://localhost/paypay-challenge

WORKDIR /app
RUN mkdir -p /data/db ./readme
COPY init-db.sh init-db.js mock-users.txt ./
RUN ./init-db.sh

COPY . ./

RUN markdown README.md > ./readme/index.html

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY nginx /etc/nginx

WORKDIR /app/api
COPY api/package.json api/package-lock.json ./
RUN npm ci

CMD ["/bin/sh", "-c", "supervisord -c /app/supervisord.conf"]

EXPOSE 80 22

RUN useradd -ms /bin/bash user
RUN chown -R user:user /app/frontend


