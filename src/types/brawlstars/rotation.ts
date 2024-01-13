export type SheduledEvents = Array<SheduledEvent>

export type SheduledEvent = {
    event: SheduledEventLocation
    slotId: number
    startTime: string
    endTime: string
}

export type EventLocationMode =
    'soloShowdown' |
    'duoShowdown' |
    'heist' |
    'bounty' |
    'siege' |
    'gemGrab' |
    'brawlBall' |
    'bigGame' |
    'bossFight' |
    'roboRumble' |
    'takedown' |
    'loneStar' |
    'presentPlunder' |
    'hotZone' |
    'superCityRampage' |
    'knockout' |
    'volleyBrawl' |
    'basketBrawl' |
    'holdTheTrophy' |
    'trophyThieves' |
    'duels' |
    'wipeout' |
    'payload' |
    'botDrop' |
    'hunters' |
    'lastStand' |
    'snowtelThieves' |
    'unknown'

export type EventLocationModifier =
    'unknown' |
    'none' |
    'energyDrink' |
    'angryRobo' |
    'meteorShower' |
    'graveyardShift' |
    'healingMushrooms' |
    'bossFightRockets' |
    'takedownLasers' |
    'takedownChainLightning' |
    'takedownRockets' |
    'waves' |
    'hauntedBall' |
    'superCharge' |
    'fastBrawlers' |
    'showdown+' |
    'peekABoo' |
    'burningBall'

export type SheduledEventLocation = {
    mode: EventLocationMode
    modifiers: Array<EventLocationModifier>
    map: string
}