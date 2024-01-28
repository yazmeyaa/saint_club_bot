import { userService } from "@services/user";
import * as cron from "node-cron";

export async function initCron() {
  cron.schedule("0 0 * * *", async () => {
    await userService.updateMysteryPointsToUsers();
    await userService.updateAllUsersTrophies("day");
  });
  cron.schedule("0 0 * * MON", () =>
    userService.updateAllUsersTrophies("week")
  );
  cron.schedule("0 0 1 * *", () => userService.updateAllUsersTrophies("month"));
}
