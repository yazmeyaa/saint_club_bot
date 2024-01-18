import "reflect-metadata";
import "./paths";
import { bot } from "./services/bot";
import { AppDataSource } from "@orm/data-source";
import { brawlStarsComposer } from "@services/bot/commands/index";
import { User } from "@orm/models/user";

async function initDatabase() {
  await AppDataSource.initialize();
  
  const user = await User.findOne({ where: { telegram_id: 279603779 } });
  if (user) User.update({ telegram_id: user.telegram_id }, { admin: true });
  else User.insert({ telegram_id: 279603779, admin: true });
}

async function startServer() {
  await initDatabase();
  bot.launch();
}

bot.use(brawlStarsComposer);
startServer();
