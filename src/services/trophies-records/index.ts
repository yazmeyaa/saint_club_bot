import { TrophiesRecordsDao } from "@orm/dao/TrophiesRecordsDao";
import { TrophiesRecord } from "@orm/models/TrophyRecord";
import { UserTrophies } from "@orm/models/UserTrophy";
import { userService } from "@services/user";

export class TrophiesRecordsService {
  private static instance: TrophiesRecordsService;
  private dao: TrophiesRecordsDao;
  constructor() {
    this.dao = new TrophiesRecordsDao();
  }
  public static getInstance(): TrophiesRecordsService {
    if (!this.instance) {
      this.instance = new TrophiesRecordsService();
    }
    return this.instance;
  }

  public createRecord(
    playerTag: string,
    trophies: UserTrophies
  ): Promise<TrophiesRecord> {
    return this.dao.createRecord(playerTag, trophies);
  }

  public getRecords(
    playerTag: string,
    limit = 20,
    offset = 0
  ): Promise<TrophiesRecord[]> {
    return this.dao.getRecordsByPlayerTag(playerTag, limit, offset);
  }

  public async createRecordsForEveryLinkedUser() {
    const users = await userService.getAllLinkedUsers();
    const updates: Array<Promise<TrophiesRecord>> = [];
    for (const user of users) {
      updates.push(this.createRecord(user.player_tag!, user.trophies));
    }

    await Promise.all(updates);
  }
}
