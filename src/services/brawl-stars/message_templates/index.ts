import { template_BS_brawler_rankings } from "./brawler_rankings";
import { template_BS_clan_members } from "./clan_members";
import { template_BS_club_info } from "./club_info";
import { template_BS_events } from "./events";
import { template_BS_players_rankings } from "./players_rankings";
import { template_BS_profile } from "./profile";

const templatesMap = {
  profile: template_BS_profile,
  club_info: template_BS_club_info,
  event_list: template_BS_events,
  players_rankings: template_BS_players_rankings,
  brawler_rankings: template_BS_brawler_rankings,
  club_members: template_BS_clan_members,
} as const;

type TemplateFunction = typeof templatesMap;
type KeyofTemplates = keyof TemplateFunction;
type PayloadType<T extends KeyofTemplates> = Parameters<TemplateFunction[T]>[0];

/**
 * Recieve key of template (template name) and need payload for this template and returns message template string.
 * Usage example:
 * ```
 *  const msg = tempaltesBS('profile', userProfile);
 *  bot.sendMessage(msg);
 * ```
 * @param key {string}
 * @param payload {Object}
 * @returns {string}
 */
export function templatesBS<K extends KeyofTemplates, P extends PayloadType<K>>(
  key: K,
  payload: P
): string {
  //! TS-IGNORE user cause TypeScript doesn't support this type cast.
  //! This may be solved by Reflect.apply(templatesMap[key], null, [payload])
  //! But its hard to understand.
  // @ts-ignore
  return templatesMap[key](payload);
}
