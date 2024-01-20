declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      TELEGRAM_BOT_TOKEN: string;
      BRAWL_API_KEY: string;
    }
  }
}

export {};
