import { AppDataSource } from "@orm/data-source";
import { UserTrophies } from "@orm/models/UserTrophy";
import { Repository } from "typeorm";

export class UserTrophiesDao {
  private userTrophiesRepository: Repository<UserTrophies>;

  constructor() {
    this.userTrophiesRepository = AppDataSource.getRepository(UserTrophies);
  }

  
  
}
