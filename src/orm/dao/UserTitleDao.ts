import { Repository } from "typeorm";
import { UserTitle } from "../models/UserTitle/index";
import { AppDataSource } from "@orm/data-source";

export class UserTitleDao {
  private repo: Repository<UserTitle> = AppDataSource.getRepository(UserTitle);

  public async createTitle(
    needPoints: UserTitle["pointsNeed"],
    title: UserTitle["title"]
  ): Promise<UserTitle> {
    const userTitle = this.repo.create({
      title,
      pointsNeed: needPoints,
    });

    

    return userTitle.save();
  }
}
