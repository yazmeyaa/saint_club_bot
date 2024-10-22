import "reflect-metadata";
import "./paths";
import { initDatabase } from "./entyPoints/database";
import { initCron } from "./entyPoints/cron";
import { initBot } from "./entyPoints/bot";
import { setupCharts } from "./entyPoints/setupCharts";

async function startServer() {
  setupCharts();
  await initDatabase();
  await initCron();
  await initBot();
}

startServer();
