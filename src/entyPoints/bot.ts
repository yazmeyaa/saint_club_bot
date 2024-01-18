import { bot } from "@services/bot";
import { brawlStarsComposer } from "@services/bot/commands";

export async function initBot() {
  bot.launch();
  bot.use(brawlStarsComposer);
}
