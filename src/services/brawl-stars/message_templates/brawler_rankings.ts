import { PlayerRankingsList } from "@services/brawl-stars/api/types";

export function template_BS_brawler_rankings(rankings: PlayerRankingsList): string {
	const formatterRankings = rankings.items.map((item) => {
		return (`${item.rank}. ${item.name}. ${item.trophies} 🏆`)
	})

	const msg = formatterRankings.join('\n')

    return msg
}
