import { UserDao } from "@orm/dao/UserDao";
import { User } from "@orm/models/User";
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

    interface Difference {
      user: User;
      difference: number;
    }
    const diffArr: Difference[] = [];

    const linkedUsers = await dao.getAllLinkedUsers();
    linkedUsers.forEach(async (user) => {
      const profileData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );

      diffArr.push({
        user,
        difference: profileData.trophies - user.trophies.day,
      });

      user.trophies.day = profileData.trophies;

      await user.trophies.save();
    });

    const maxTrophyDifference = Math.max(
      ...diffArr.map((item) => item.difference)
    );

    const leaders = diffArr.filter(
      (item) => item.difference === maxTrophyDifference
    );

    for (const leader of leaders) {
      leader.user.mystery_points += 1;
      await leader.user.save();
    }
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
