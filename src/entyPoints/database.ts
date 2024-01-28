import { UserDao } from "@orm/dao/UserDao";
import { AppDataSource } from "@orm/data-source";
import { brawlStarsService } from "@services/brawl-stars/api";
import { userService } from "@services/user";

async function fixEmptyTrophies() {
  const dao = new UserDao();
  const users = await dao.getAllLinkedUsers();

  for (const user of users) {
    if (
      user.trophies.day === 0 &&
      user.trophies.week === 0 &&
      user.trophies.month === 0
    ) {
      const playerData = await brawlStarsService.players.getPlayerInfo(
        user.player_tag!
      );
      if (!playerData) continue;

      user.trophies.day =
        user.trophies.week =
        user.trophies.month =
          playerData.trophies;
      await user.trophies.save();
    }
  }
}

export async function initDatabase() {
  await AppDataSource.initialize();
  await fixEmptyTrophies();

  const admin = await userService.getOrCreateUser(279603779);
  admin.admin = true;
  console.log({ admin });

  await admin.save();
}
