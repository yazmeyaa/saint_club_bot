import { BrawlStarsClub } from "@services/brawl-stars/api/types";

const clubTypeMap: Record<BrawlStarsClub['type'], string> = {
    closed: "Closed",
    inviteOnly: "Invite only",
    open: 'Open',
    unknown: 'Unknown'
}

export function template_BS_club_info(club: BrawlStarsClub) {
    console.log(">>>>>>>>>>>>CLUB", club)
    return (
        `Club name: ${club.name}
Tag: ${club.tag}
Description: ${club.description}
Required trophies: ${club.requiredTrophies}🏆
Type: ${clubTypeMap[club.type]}`
    )
}