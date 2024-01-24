import { UserDao } from "@orm/dao/UserDao";
import { User } from "@orm/models/User";
import { battleLogService } from "@services/battle-logs";
import { brawlStarsService } from "@services/brawl-stars/api";
import { userService } from "@services/user";
import cron from "node-cron";

export async function initCron() {
  await battleLogService.updateUsersStat();
  await battleLogService.removeOld(30);
  //
  cron.schedule("*/20 * * * *", battleLogService.updateUsersStat);
  cron.schedule("0 1 * * *", () => battleLogService.removeOld(30));
  cron.schedule("0 1 * * *", async () => {
    await userService.updateMysteryPointsToUsers();
    await userService.updateAllUsersTrophies("day");
  });
  cron.schedule("0 0 * * MON", () =>
    userService.updateAllUsersTrophies("week")
  );
  cron.schedule("0 0 1 * *", () => userService.updateAllUsersTrophies("month"));
}
