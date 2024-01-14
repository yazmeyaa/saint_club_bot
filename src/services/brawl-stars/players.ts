import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Player } from "types/brawlstars/player";
import { BrawlStarsService } from "./service";
import { BattleLogResponse } from "types/brawlstars";

class Players {
    private root: BrawlStarsService
    private baseUrl: string
    constructor(root: BrawlStarsService) {
        this.root = root
        this.baseUrl = root.getUrl() + '/players/'
    }

    getPlayerInfo = async (playerTag: string): Promise<Player> => {
        const config: AxiosRequestConfig = {
            headers: this.root.getHeaders()
        }
        const url = this.baseUrl + `${encodeURIComponent(playerTag)}`

        try {
            const response = await axios.get<Player>(url, config);

            if (!response.data) throw new Error(`Player with tag ${playerTag} is not found`)

            return response.data;
        } 
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error: ${error.message}`)
            }
            if (error instanceof AxiosError) {
                throw new Error(`Error: ${error.message}`)
            }
            throw new Error("Error: Unexpected error!")
        }
    };

    getPlayerBattleLog = async (playerTag: string): Promise<BattleLogResponse> => {
        const config: AxiosRequestConfig = {
            headers: this.root.getHeaders()
        }
        const url = this.baseUrl + `%23${playerTag}/battlelog`

        try {
            const response = await axios.get<BattleLogResponse>(url, config);

            if (!response.data) throw new Error(`Player with tag ${playerTag} is not found`)
            return response.data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error: ${error.message}`)
            }
            if (error instanceof AxiosError) {
                throw new Error(`Error: ${error.message}`)
            }
            throw new Error("Error: Unexpected error!")
        }

    }
}

export { Players }