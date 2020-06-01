#!/usr/bin/env bash

/usr/bin/mongod --fork --dbpath /data/db --logpath /dev/stdout --nojournal || exit 1

# Give mongo some time to initialize
sleep 5

/usr/bin/mongo app init-db.js || exit 1

/usr/bin/mongod --dbpath /data/db --shutdown
