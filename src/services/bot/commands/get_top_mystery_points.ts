import { Composer } from "telegraf";
import { CommandType } from ".";
import { userService } from "@services/user";
import { brawlStarsService } from "@services/brawl-stars/api";
import { textTemplates } from "../templates";
import { TopMysteryPayload } from "../templates/types";

export const getTopMysteryPlayers: CommandType = Composer.command(/^get_top_mystery/, async (ctx) => {
    const users = await userService.getTopUsersByMysteryTrophies(5);

    const _players = users.map(item => {
        return brawlStarsService.players.getPlayerInfo(item.player_tag!)
    })
    const players = await Promise.all(_players);

    const templatePayload: TopMysteryPayload['players'] = users.map((item, index) => {
        const player = players.find(player => player?.tag === item.player_tag)
        return {
            index,
            mystery_points: item.mystery_points,
            name: player!.name
        }
    })
    const msg = await textTemplates.getTemplate({
        type: 'TOP_MYSTERY',
        payload: {
            players: templatePayload
        }
    })
    await ctx.react("👍");
    return await ctx.reply(msg)
})