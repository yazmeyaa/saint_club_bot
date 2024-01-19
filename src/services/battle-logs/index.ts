import { BattleLogDao } from "@orm/dao/BattleLogDao";
import { UserDao } from "@orm/dao/UserDao";
import { User } from "@orm/models/User";
import { brawlStarsService } from "@services/brawl-stars/api";

export class BattleLogService {
  private battleLogDao = new BattleLogDao();
  private userDao = new UserDao();

  public async getUserBattleLog(user: User, limit: number = 25) {
    return await this.battleLogDao.getBattleLogsByUser(user, limit);
  }

  public async updateUser(user: User): Promise<void> {
    const { player_tag } = user;
    if (!player_tag) return;

    const battleLog = await brawlStarsService.players.getPlayerBattleLog(
      player_tag
    );

    await this.battleLogDao.loadBattleLogs(user, battleLog.items);
  }

  public async updateUsersStat() {
    const allUsers = await this.userDao.getAllLinkedUsers();

    for (const user of allUsers) {
      this.updateUser(user);
    }
  }

  public async getUserBattleLogsFor(
    param: "day" | "week" | "month",
    user: User
  ) {
    return await this.battleLogDao.getUserBattleLogsFor(param, user);
  }
}

export const battleLogService = new BattleLogService();
