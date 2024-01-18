import { PlayerIcon } from "./player"

export type PlayerRankingsList = {
    items: Array<PlayerRanking>
}

export type PlayerRanking = {
    club: PlayerRankingClub
    icon: PlayerIcon
    trophies: number
    tag: string
    name: string
    rank: number
    nameColor: string
}

export type PlayerRankingClub = {
    name: string
}

export type ClubRankingList = Array<ClubRanking>

export type ClubRanking = {
    tag: string
    name: string
    trophies: number
    rank: number
    memberCount: number
    badgeId: number
}

export type PowerPlaySeasonList = Array<PowerPlaySeason>

export type PowerPlaySeason = {
    id: string
    startTime: string
    endTime: string
}