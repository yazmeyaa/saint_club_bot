import { parseDateStringToDate } from "@helpers/date";
import { AppDataSource } from "@orm/data-source";
import { BattleLog } from "@orm/models/BattleLog";
import { User } from "@orm/models/User";
import { BattleResult } from "@services/brawl-stars/api/types";
import { Repository } from "typeorm";

export class BattleLogDao {
  private battleLogRepository: Repository<BattleLog>;

  constructor() {
    this.battleLogRepository = AppDataSource.getRepository(BattleLog);
  }

  public async createBattleLog(
    battleLog: BattleResult,
    user: User
  ): Promise<BattleLog> {
    const log = await this.battleLogRepository.save({
      battleTime: battleLog.battleTime,
      user,
      trophyChange: battleLog.battle.trophyChange,
    });

    return log;
  }

  public async loadBattleLogs(user: User, battleLogs: BattleResult[]) {
    const payload: BattleLog[] = battleLogs
      .filter(
        (item) =>
          item.battle.type === "ranked" &&
          typeof item.battle.trophyChange !== "undefined"
      )
      .map((item) => {
        const log = BattleLog.create({
          battleTime: parseDateStringToDate(item.battleTime),
          trophyChange: item.battle.trophyChange,
          user,
        });
        return log;
      });

    for (const log of payload) {
      this.battleLogRepository
        .createQueryBuilder()
        .insert()
        .into(this.battleLogRepository.target)
        .values(log)
        .orIgnore()
        .execute();
    }
  }
}
