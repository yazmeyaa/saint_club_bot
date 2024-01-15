import "reflect-metadata";
import "./paths";
import { bot } from "./modules";
import { User } from "@models/user";
import { AppDataSource } from "./data-source";
import { brawlStarsComposer } from "@commands/index";

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
