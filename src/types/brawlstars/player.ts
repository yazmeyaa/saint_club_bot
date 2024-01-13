interface PlayerClub {
    tag: string
    name: string
}

export interface PlayerIcon {
    id: string
}

export type Player = {
    tag: string
    name: string
    nameColor: string
    icon: PlayerIcon
    trophies: number
    highestTrophies: number
    expLevel: number
    expPoints: number
    isQualifiedFromChampionshipChallenge: boolean
    "3vs3Victories": number
    soloVictories: number
    duoVictories: number
    bestRoboRumbleTime: number
    bestTimeAsBigBrawler: number
    club: PlayerClub
    brawlers: BrawlerStatList
    powerPlayPoints: number
    highestPowerPlayPoints: number
}

interface BrawlerStat extends BaseBrawler {
    power: number
    rank: number
    trophies: number
    highestTrophies: number
    gears: Array<BrawlerGear>
}

interface BrawlerGear {
    id: number
    name: string
    level: number
}

interface BrawlerStarPower {
    id: number
    name: string
}

interface BrawlerGadget {
    id: number
    name: string
}

export type BaseBrawler = {
    gadgets: Array<BrawlerGadget>
    name: string
    id: number
    starPowers: Array<BrawlerStarPower>
}

export type BrawlersResponseType = {
    items: Array<BaseBrawler>
}

type BrawlerStatList = Array<BrawlerStat>