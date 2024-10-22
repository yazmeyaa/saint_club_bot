import "reflect-metadata";
import "./paths";
import { initDatabase } from "./entyPoints/database";
import { initCron } from "./entyPoints/cron";
import { initBot } from "./entyPoints/bot";

async function startServer() {
  await initDatabase();
  await initCron();
  await initBot();
}

startServer();
