import { User } from "@models/user";
import { ClubMemberListReponseType } from "types/brawlstars/club";
import createMention from "./createMention";
import { In } from "typeorm";

export async function checkIsAdmin(telegram_id: number): Promise<boolean> {
  const user = await User.findOne({ where: { telegram_id: telegram_id } });

  if (!user) return false;

  return user.admin;
}

export function isValidPlayerTag(playerTag: string) {
  return typeof playerTag === "string" && playerTag.startsWith("#");
}

export async function transformClubMembers(
  members: ClubMemberListReponseType
): Promise<string> {
  const membersStrings: string[] = [];

  const membersTags = members.items.map((item) => item.tag);

  const findMembers = await User.find({
    where: {
      player_tag: In(membersTags),
    },
  });

  console.log({ findMembers });

  for (const member of members.items) {
    const user = findMembers.find((item) => item.player_tag === member.tag);
    if (user) membersStrings.push(createMention(member.name, user.telegram_id));
    else membersStrings.push(member.name);
  }

  return membersStrings.join("\n");
}
