import { TrophiesRecordsService } from "@services/trophies-records";
import { userService } from "@services/user";
import * as cron from "node-cron";

export async function initCron() {
  const trophiesRecordsService = TrophiesRecordsService.getInstance();
  cron.schedule("0 0 * * *", async () => {
    await userService.updateMysteryPointsToUsers();
    await userService.updateAllUsersTrophies("day");
    const today = new Date();
    if (today.getDay() === 1) await userService.updateAllUsersTrophies("week");
    if (today.getDate() === 1)
      await userService.updateAllUsersTrophies("month");
    await trophiesRecordsService.createRecordsForEveryLinkedUser();
  });
}
