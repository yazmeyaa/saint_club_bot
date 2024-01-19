import { AppDataSource } from "@orm/data-source";
import { User } from "@orm/models/User";
import { IsNull, Not, Repository } from "typeorm";

type RemovePlayerTagResponse = Promise<User | null>;

export class UserDao {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async getOrCreateUser(telegram_id: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { telegram_id },
      relations: ["battleLogs"],
    });
    if (existingUser) return existingUser;
    return this.userRepository.save({ telegram_id });
  }

  public async removePlayerTag(telegram_id: number): RemovePlayerTagResponse {
    const user = await this.userRepository.findOneBy({ telegram_id });
    if (!user) return null;

    user.player_tag = null;
    return await user.save();
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({ relations: { battleLogs: true } });
  }

  public async getAllLinkedUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        player_tag: Not(IsNull()),
      },
      relations: { battleLogs: true },
    });
  }

  public async getUserByPlayerTag(player_tag: string) {
    const user = this.userRepository.findOne({
      where: { player_tag },
      relations: {
        battleLogs: true,
      },
    });

    return user;
  }
}
