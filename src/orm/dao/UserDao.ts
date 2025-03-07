import {AppDataSource} from "@orm/data-source";
import {User} from "@orm/models/User";
import {UserTrophies} from "@orm/models/UserTrophy";
import {IsNull, Not, Repository} from "typeorm";

type RemovePlayerTagResponse = Promise<User | null>;

export class UserDao {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async getOrCreateUser(telegram_id: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { telegram_id },
    });

    if (existingUser) {
      if (existingUser.trophies === null) {
        await this.createTrophiesForNewUser(existingUser);
      }
      return existingUser;
    }

    const user = this.userRepository.create({ telegram_id });
    await this.createTrophiesForNewUser(user);

    return await user.save();
  }

  private async createTrophiesForNewUser(user: User): Promise<void> {
    const trophies = UserTrophies.create();
    user.trophies = trophies;
    await trophies.save();
    await user.save();
    return;
  }

  public async removePlayerTag(telegram_id: string): RemovePlayerTagResponse {
    const user = await this.userRepository.findOneBy({ telegram_id });
    if (!user) return null;

    user.player_tag = null;
    return await user.save();
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getAllLinkedUsers(limit?: number): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        player_tag: Not(IsNull()),
      },
      take: limit,
    });

    for (const user of users) {
      if (user.trophies !== null) {
        if (
          user.trophies.day === 0 &&
          user.trophies.week === 0 &&
          user.trophies.month === 0
        ) {
          await this.createTrophiesForNewUser(user);
        }
        continue;
      }

      await this.createTrophiesForNewUser(user);
    }

    return users;
  }

  public async getUserByPlayerTag(player_tag: string) {
    return this.userRepository.findOne({
      where: {player_tag},
    });
  }
}
