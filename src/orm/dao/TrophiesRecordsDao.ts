import { AppDataSource } from "@orm/data-source";
import { TrophiesRecord } from "@orm/models/TrophyRecord";
import { UserTrophies } from "@orm/models/UserTrophy";
import { Repository } from "typeorm";

export class TrophiesRecordsDao {
  private trophiesRecordsRepository: Repository<TrophiesRecord>;

  constructor() {
    this.trophiesRecordsRepository =
      AppDataSource.getRepository(TrophiesRecord);
  }

  public async createRecord(
    playerTag: string,
    trophies: UserTrophies
  ): Promise<TrophiesRecord> {
    const record = this.trophiesRecordsRepository.create({
      playerTag: playerTag,
      trophies: trophies.day,
    });

    const result = await record.save();

    return result;
  }

  public async getRecordsByPlayerTag(
    playerTag: string,
    limit = 20,
    offset = 0
  ): Promise<TrophiesRecord[]> {
    const result = await this.trophiesRecordsRepository.find({
      where: { playerTag },
      take: limit,
      skip: offset,
      order: { date: { direction: "DESC" } },
    });

    return result.toReversed();
  }
}
