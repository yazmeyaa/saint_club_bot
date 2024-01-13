import { BaseBrawler, BrawlersResponseType } from "types/brawlstars/player"
import { BrawlStarsService } from "./service"
import axios from "axios"

class Brawlers {
    root: BrawlStarsService

    constructor(root: BrawlStarsService) {
        this.root = root
    }

    getBrawlersList = async (): Promise<BrawlersResponseType> => {
        const url = encodeURI(this.root.getUrl() + '/brawlers')
        const response = await axios.get<BrawlersResponseType>(url, {
            headers: this.root.getHeaders()
        })
        return response.data
    }

}

export { Brawlers }