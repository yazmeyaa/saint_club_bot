#!/bin/bash
set -e

# Ожидаем, пока PostgreSQL будет доступен (по желанию — можно добавить healthcheck)
echo "⏳ Waiting for Postgres..."
until nc -z -v -w30 postgres 5432
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "✅ Running migrations..."
yarn typeorm migration:run -d ./src/orm/data-source.ts

echo "🚀 Starting app..."
exec yarn start
