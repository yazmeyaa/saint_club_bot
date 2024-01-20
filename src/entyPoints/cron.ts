import { battleLogService } from "@services/battle-logs";
import cron from "node-cron";

export async function initCron() {
  // execute when server starts;
  await battleLogService.updateUsersStat();
  await battleLogService.removeOld(30);
  //
  cron.schedule("*/20 * * * *", battleLogService.updateUsersStat);
  cron.schedule("0 1 * * *", () => battleLogService.removeOld(30));
}
