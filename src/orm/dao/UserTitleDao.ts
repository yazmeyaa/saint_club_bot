import { Repository } from "typeorm";
import { UserTitle } from "../models/UserTitle/index";
import { AppDataSource } from "@orm/data-source";
import { title } from "process";
import { User } from "@orm/models/User";

export class UserTitleDao {
  private repo: Repository<UserTitle> = AppDataSource.getRepository(UserTitle);

  public async createTitle(
    needPoints: UserTitle["pointsNeed"],
    title: UserTitle["title"]
  ): Promise<UserTitle> {
    const foundTitle = await this.repo.findOne({ where: { title } });

    if (foundTitle) {
      throw new Error("Титул с таким названием уже существует.");
    }

    const foundTitleByNeedPoints = await this.repo.findOne({
      where: { pointsNeed: needPoints },
    });

    if (foundTitleByNeedPoints) {
      throw new Error("Титул с таким количеством очков уже существует.");
    }

    const userTitle = this.repo.create({
      title,
      pointsNeed: needPoints,
    });

    return userTitle.save();
  }

  public async getUserTitle(user: User): Promise<UserTitle | null> {
    const title = await UserTitle.createQueryBuilder("userTitle")
      .where("userTitle.pointsNeed <= :mysteryPoints", {
        mysteryPoints: user.mystery_points,
      })
      .orderBy("userTitle.pointsNeed", "DESC")
      .getOne();

    return title;
  }
}
