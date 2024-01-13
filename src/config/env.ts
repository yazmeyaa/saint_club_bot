import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const BRAWL_STARS_API_KEY = process.env.BRAWL_API_KEY!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const environments = {
  bwarlstars_api_key: BRAWL_STARS_API_KEY,
  telegram_bot_token: TELEGRAM_BOT_TOKEN,
} as const;
