export type BattleLogResponse = {
    items: Array<BattleResult>
}

export type BattleResult = {
    battleTime: string,
    event: BattleEvent,
    battle: BattleInfo
}

export type BattleEvent = {
    id: number
    mode: string
    map: string
}

export type BattleInfo = {
    mode: string
    type: string,
    result: string,
    duration: number,
    trophyChange: number,
    starPlayer: StarPlayer
    teams: Array<unknown>
}

export type StarPlayer = {
     tag: string
     name: string
     brawler: BattlePlayerBrawler
}

export type BattlePlayerBrawler = {
    id: number
    name: string
    power: number
    trophies: number
}