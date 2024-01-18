import { PlayerRankingsList } from "@services/brawl-stars/api/types";

export function template_BS_players_rankings(rankings: PlayerRankingsList): string {
    const mappedRankings = rankings.items.map((item, index) => {
        return (`${index + 1}. ${item.name}. ${item.trophies}🏆`)
    })
    const msg = mappedRankings.join('\n')

    return msg
}

