import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const BRAWL_STARS_API_KEY = process.env.BRAWL_API_KEY!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DB_USERNAME = process.env.DB_USERNAME!;
const DB_PASSWORD = process.env.DB_PASSWORD!;
const DB_DATABASE = process.env.DB_DATABASE!;
const DB_PORT = process.env.DB_PORT!;
const DB_HOST = process.env.DB_HOST!;

export const environments = {
  bwarlstars_api_key: BRAWL_STARS_API_KEY,
  telegram_bot_token: TELEGRAM_BOT_TOKEN,
  database: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: Number(DB_PORT),
  },
} as const;
