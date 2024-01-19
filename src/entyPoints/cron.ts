import { BattleLogDao } from "@orm/dao/BattleLogDao";
import { UserDao } from "@orm/dao/UserDao";
import { User } from "@orm/models/User";
import { brawlStarsService } from "@services/brawl-stars/api";
import cron from "node-cron";

const userDao = new UserDao();
const battleLogDao = new BattleLogDao();

async function updateUser(user: User): Promise<void> {
  const { player_tag } = user;
  if (!player_tag) return;

  const battleLog = await brawlStarsService.players.getPlayerBattleLog(
    player_tag
  );

  battleLogDao.loadBattleLogs(user, battleLog.items);
}

async function updateUsersStat() {
  const allUsers = await userDao.getAllLinkedUsers();

  for (const user of allUsers) {
    updateUser(user);
  }
}

export async function initCron() {
  await updateUsersStat(); // update first;
  cron.schedule("*/20 * * * *", updateUsersStat);
}
