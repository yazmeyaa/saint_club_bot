import { logger } from "@helpers/logs";
import { bot } from "@services/bot";
import { brawlStarsComposer } from "@services/bot/commands";

export async function initBot() {
  bot.launch();
  bot.use(brawlStarsComposer);
  bot.catch((error) => {
    logger.error(error);
  });
}
