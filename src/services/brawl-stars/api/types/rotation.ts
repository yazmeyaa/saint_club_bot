export type SheduledEvents = Array<SheduledEvent>;

export type SheduledEvent = {
  event: SheduledEventLocation;
  slotId: number;
  startTime: string;
  endTime: string;
};

export type EventLocationMode =
  | "soloShowdown"
  | "duoShowdown"
  | "heist"
  | "bounty"
  | "siege"
  | "gemGrab"
  | "brawlBall"
  | "bigGame"
  | "bossFight"
  | "roboRumble"
  | "takedown"
  | "loneStar"
  | "presentPlunder"
  | "hotZone"
  | "superCityRampage"
  | "knockout"
  | "volleyBrawl"
  | "basketBrawl"
  | "holdTheTrophy"
  | "trophyThieves"
  | "duels"
  | "wipeout"
  | "payload"
  | "botDrop"
  | "hunters"
  | "lastStand"
  | "snowtelThieves"
  | "unknown";

export type EventLocationModifier =
  | "unknown"
  | "none"
  | "energyDrink"
  | "angryRobo"
  | "meteorShower"
  | "graveyardShift"
  | "healingMushrooms"
  | "bossFightRockets"
  | "takedownLasers"
  | "takedownChainLightning"
  | "takedownRockets"
  | "waves"
  | "hauntedBall"
  | "superCharge"
  | "fastBrawlers"
  | "showdown+"
  | "peekABoo"
  | "burningBall";

export type SheduledEventLocation = {
  mode: EventLocationMode;
  modifiers: Array<EventLocationModifier>;
  map: string;
};

export type BrawlifyEventsResponse = {
  active: BrawlifyEvent[];
  upcoming: BrawlifyEvent[];
};

export type BrawlifyEvent = {
  slot: BrawlifyEventSlot;
  predicted: boolean;
  startTime: string;
  endTime: string;
  reward: number;
  map: BrawlifyMap;
  modifier: null;
};

export type BrawlifyMap = {
  id: number;
  new: false;
  disabled: false;
  name: string;
  hash: string;
  version: number;
  link: string;
  imageUrl: string;
  credit: null;
  environment: BrawlifyMapEnvironment;
  gameMode: BrawlifyMapGameMode;
  lastActive: number;
  dataUpdated: number;
  stats: BrawlifyMapBrawlerStat[];
  teamStats: unknown[];
};

export type BrawlifyMapGameMode = {
  id: number;
  name: string;
  hash: string;
  version: number;
  color: string;
  bgColor: string;
  link: string;
  imageUrl: string;
};

export type BrawlifyMapEnvironment = {
  id: number;
  name: string;
  hash: string;
  path: string;
  version: number;
  imageUrl: string;
};

export type BrawlifyEventSlot = {
  id: number;
  name: string;
  emoji: string;
  hash: string;
  listAlone: boolean;
  hideable: boolean;
  hideForSlot: number;
  background: null;
};

export type BrawlifyMapBrawlerStat = {
  brawler: number;
  winRate: number;
  useRate: number;
};
