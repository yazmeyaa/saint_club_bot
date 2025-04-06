FROM node:20
LABEL authors="evgen"

WORKDIR /app
RUN apt-get update && apt-get install -y netcat-openbsd

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

CMD ["bash", "./entrypoint.sh"]