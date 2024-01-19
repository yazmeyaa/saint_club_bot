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
}
