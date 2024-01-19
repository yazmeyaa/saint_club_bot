import { AppDataSource } from "@orm/data-source";
import { User } from "@orm/models/User";
import { brawlStarsService } from "@services/brawl-stars/api";
import { Repository } from "typeorm";
import { BrawlStarsClub } from "@services/brawl-stars/api/types";
import { ClubMemberList } from "@services/brawl-stars/api/types/club";

type UserClubInfoResponse = Promise<BrawlStarsClub | null>;
type RemovePlayerTagResponse = Promise<User | null>;
type GetClubMembersResponse = Promise<ClubMemberList | null>;

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

  public async getUserClubInfo(telegram_id: number): UserClubInfoResponse {
    const user = await this.userRepository.findOneBy({ telegram_id });
    if (!user || !user.player_tag) return null;

    const userInfo = await brawlStarsService.players.getPlayerInfo(
      user.player_tag
    );
    if (!userInfo || !userInfo.club.tag) return null;

    const clubInfo = await brawlStarsService.clubs.getClanInfo(
      userInfo.club.tag
    );
    if (!clubInfo) return null;
    return clubInfo;
  }

  public async getUserClubMembers(telegram_id: number): GetClubMembersResponse {
    const club = await this.getUserClubInfo(telegram_id);
    if (!club) return null;

    const members = await brawlStarsService.clubs.getClanMembers(club.tag);

    return members.items;
  }
}
