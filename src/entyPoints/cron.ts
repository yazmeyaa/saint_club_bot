import { UserDao } from "@orm/dao/UserDao";
import { battleLogService } from "@services/battle-logs";
import { brawlStarsService } from "@services/brawl-stars/api";
import cron from "node-cron";

export async function initCron() {
  await battleLogService.updateUsersStat();
  await battleLogService.removeOld(30);
  //
  cron.schedule("*/20 * * * *", battleLogService.updateUsersStat);
  cron.schedule("0 1 * * *", () => battleLogService.removeOld(30));
  cron.schedule("0 1 * * *", async () => {
    const dao = new UserDao();

    const linkedUsers = await dao.getAllLinkedUsers();
    linkedUsers.forEach(async (user) => {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );
      user.trophies.day = profileData.trophies;

      await user.trophies.save();
    });
  });
  cron.schedule("0 0 * * MON", async () => {
    const dao = new UserDao();

    const linkedUsers = await dao.getAllLinkedUsers();
    linkedUsers.forEach(async (user) => {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );
      user.trophies.week = profileData.trophies;

      await user.trophies.save();
    });
  });

  cron.schedule("0 0 1 * *", async () => {
    const dao = new UserDao();

    const linkedUsers = await dao.getAllLinkedUsers();
    linkedUsers.forEach(async (user) => {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );
      user.trophies.month = profileData.trophies;

      await user.trophies.save();
    });
  });
}
