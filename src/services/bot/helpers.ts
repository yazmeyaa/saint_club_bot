import { User } from "@orm/models/User";
import { ClubMemberList } from "@services/brawl-stars/api/types/club";
import { In } from "typeorm";
import { ClubListPayload } from "./templates/types";

export async function checkIsAdmin(telegram_id: number): Promise<boolean> {
  const user = await User.findOne({ where: { telegram_id: telegram_id } });

  if (!user) return false;

  return user.admin;
}

export function isValidPlayerTag(playerTag: string) {
  return typeof playerTag === "string" && playerTag.startsWith("#");
}

export async function transformClubMembers(
  members: ClubMemberList
): Promise<ClubListPayload["members"]> {
  const result: ClubListPayload["members"] = [];
  const membersTags = members.map((item) => item.tag);

  const findMembers = await User.find({
    where: {
      player_tag: In(membersTags),
    },
  });

  for (const member of members) {
    const user = findMembers.find((item) => item.player_tag === member.tag);
    if (user)
      result.push({
        name: createMention(member.name, user.telegram_id),
        tag: member.tag,
      });
    else result.push({ ...member });
  }

  return result;
}

export function createMention(name: string, user_id: number) {
  return `\[${name}\](tg://user?id=${user_id})`;
}
