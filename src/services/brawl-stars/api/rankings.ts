import axios, { AxiosRequestConfig } from "axios"
import { BrawlStarsService } from "./service"
import { ClubRankingList, PlayerRankingsList, PowerPlaySeasonList } from "@services/brawl-stars/api/types"

type LimitParams = {
    before?: string
    after?: string
    limit?: string
}

class Rankings {
    private root: BrawlStarsService
    private baseUrl: string;

    constructor(root: BrawlStarsService) {
        this.root = root
        this.baseUrl = this.root.getUrl() + '/rankings'
    }


    async getPowerPlayRankingsList(county = 'global', params?: LimitParams): Promise<PowerPlaySeasonList> {
        const url = this.baseUrl + `/${county}/powerplay/seasons`
        const config: AxiosRequestConfig = this.getAxiosConfig(params)

        const request = await axios.get<PowerPlaySeasonList>(url, config)
        return request.data
    }

    async getClubsRankings(county = 'global', params?: LimitParams): Promise<ClubRankingList> {
        const url = this.baseUrl + `/${county}/clubs`
        const config: AxiosRequestConfig = this.getAxiosConfig(params)

        const request = await axios.get<ClubRankingList>(url, config)
        return request.data
    }

    async getRankingsByBrawler(county = 'global', brawlerId: string, params?: LimitParams):Promise<PlayerRankingsList> {
        const url = this.baseUrl + `/${county}/brawlers/${brawlerId}`
        const config: AxiosRequestConfig = this.getAxiosConfig(params)

        const request = await axios.get<PlayerRankingsList>(url, config)
        return request.data
    }

    async getPowerPlayRankingsBySeason(county = 'global', seasonId: string, params?: LimitParams): Promise<PlayerRankingsList> {
        const url = this.baseUrl + `/${county}/powerplay/seasons/${seasonId}`
        const config: AxiosRequestConfig = this.getAxiosConfig(params)

        const request = await axios.get<PlayerRankingsList>(url, config)
        return request.data
    }

    async getRankingsPlayers(county = 'global', params?: LimitParams): Promise<PlayerRankingsList> {
        const url = this.baseUrl + `/${county}/players`
        const config: AxiosRequestConfig = this.getAxiosConfig(params)

        const request = await axios.get<PlayerRankingsList>(url, config)
        return request.data
    }

    private getAxiosConfig(params?: LimitParams): AxiosRequestConfig {
        return {
            headers: this.root.getHeaders(),
            params: params
        }
    }
}

export { Rankings }