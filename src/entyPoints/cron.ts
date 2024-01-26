import { battleLogService } from "@services/battle-logs";
import { userService } from "@services/user";
import * as cron from "node-cron";

export async function initCron() {
  await battleLogService.updateUsersStat();
  await battleLogService.removeOld(30);

  cron.schedule("*/20 * * * *", battleLogService.updateUsersStat, {
    timezone: "Europe/Moscow"
  });
  cron.schedule("0 0 * * *", () => battleLogService.removeOld(30), {
    timezone: "Europe/Moscow"
  });
  cron.schedule("0 0 * * *", async () => {
    await userService.updateMysteryPointsToUsers();
    await userService.updateAllUsersTrophies("day");
  }, {
    timezone: "Europe/Moscow"
  });
  cron.schedule("0 0 * * MON", () =>
    userService.updateAllUsersTrophies("week"),
    {
      timezone: "Europe/Moscow"
    }
  );
  cron.schedule("0 0 1 * *", () => userService.updateAllUsersTrophies("month"),
  {
    timezone: "Europe/Moscow"
  });
}
