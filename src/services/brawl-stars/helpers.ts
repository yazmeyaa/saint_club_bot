import { BattleResult } from "./api/types";

export function getTrophyChange(battleLogs: BattleResult[]): number {
  let result = 0;

  for (const battle of battleLogs) {
    if (battle.battle.type !== "ranked" || !battle.battle.trophyChange)
      continue;
    result += battle.battle.trophyChange;
  }

  return result;
}

export function getWinsAndLosesRow(battleLogs: BattleResult[]): string {
  const result: string[] = [];
  for (const battle of battleLogs) {
    if (
      battle.battle.type !== "ranked" ||
      typeof battle.battle.trophyChange === "undefined"
    ) {
      result.unshift("+0");
      continue;
    }
    const { trophyChange } = battle.battle;
    result.unshift(trophyChange >= 0 ? "+" + trophyChange : String(trophyChange));
  }

  return result.join("\t\t");
}
