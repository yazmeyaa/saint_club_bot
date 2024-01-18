export type BrawlStarsClub = {
    tag: string
    name: string
    description: string
    trophies: number
    requiredTrophies: number
    type: 'open' | 'inviteOnly' | 'closed' | 'unknown'
    badgeId: number
}

export type ClubMemberListReponseType = {
    items: ClubMemberList
}

export type ClubMemberList = Array<ClubMember>

type PlayerIcon = {
    id: number
}

export type ClubMember = {
    icon: PlayerIcon
    role: 'notMember'|  'member'|  'president'|  'senior'|  'vicePresident'|  'unknown'
    nameColor: string
    tag: string
    name: string
    trophies: number
}

