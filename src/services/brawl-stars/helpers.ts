import { BattleLog } from "@orm/models/BattleLog";

export function getTrophyChange(battleLogs: BattleLog[]): number {
  let result = 0;
  for (const battle of battleLogs) {
    result += battle.trophyChange;
  }

  return result;
}

export function getWinsAndLosesRow(battleLogs: BattleLog[]): string {
  const result: string[] = [];
  for (const battle of battleLogs) {
    const { trophyChange } = battle;
    result.unshift(
      trophyChange >= 0 ? "+" + trophyChange : String(trophyChange)
    );
  }

  return result.join("\t");
}
