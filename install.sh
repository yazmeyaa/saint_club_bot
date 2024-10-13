#!/bin/bash

git pull origin main
rm -rf ./node_modules
pnpm install
pnpm typeorm migration:run -d ./src/orm/data-source.ts > migrations_log.txt
pnpm run build
pm2 restart saint_club_bot
