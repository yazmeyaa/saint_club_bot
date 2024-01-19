import { battleLogService } from "@services/battle-logs";
import cron from "node-cron";

export async function initCron() {
  await battleLogService.updateUsersStat(); // update first;
  cron.schedule("*/20 * * * *", battleLogService.updateUsersStat);
}
