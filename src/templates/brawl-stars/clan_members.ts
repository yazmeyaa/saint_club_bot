import { ClubMemberList, PlayerRankingsList } from "types/brawlstars";

export function template_BS_clan_members(clubMembers: ClubMemberList): string {
	const msg = clubMembers.sort((a, b) => Number(b.trophies) - Number(a.trophies)).map(member => {
		return `${member.name}: ${member.trophies}🏆`
	}).join('\n')


    return msg
}

