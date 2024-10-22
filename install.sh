#!/bin/bash

git pull origin main
rm -rf ./node_modules
yarn install
yarn typeorm migration:run -d ./src/orm/data-source.ts > migrations_log.txt
yarn build
pm2 restart saint_club_bot
