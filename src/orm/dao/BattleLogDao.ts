import { parseDateStringToDate } from "@helpers/date";
import { AppDataSource } from "@orm/data-source";
import { BattleLog } from "@orm/models/BattleLog";
import { User } from "@orm/models/User";
import { BattleResult } from "@services/brawl-stars/api/types";
import { MoreThan, Repository } from "typeorm";
import { subDays } from "date-fns";

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
    const payload: BattleLog[] = battleLogs.map((item) => {
      const log = BattleLog.create({
        battleTime: parseDateStringToDate(item.battleTime),
        trophyChange: item.battle.trophyChange,
        user,
      });
      if (
        typeof item.battle.trophyChange === "undefined" ||
        item.battle.type !== "ranked"
      ) {
        log.trophyChange = 0;
      }
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

  public async getLogsByPlayerTag(player_tag: string) {
    const logs = this.battleLogRepository.find({
      where: {
        user: {
          player_tag,
        },
      },
    });

    return logs;
  }

  public async getBattleLogsByUser(user: User, limit: number = 25) {
    return await this.battleLogRepository.find({
      where: { user },
      take: limit,
    });
  }

  public async getUserBattleLogsFor(param: "day" | "week" | "month") {
    const offsetDayMap: Record<typeof param, number> = {
      day: 0,
      week: 7,
      month: 31,
    } as const;
    const targetDate = subDays(new Date(), offsetDayMap[param]);

    const logs = await this.battleLogRepository.find({
      where: {
        battleTime: MoreThan(targetDate),
      },
    });

    return logs;
  }
}
