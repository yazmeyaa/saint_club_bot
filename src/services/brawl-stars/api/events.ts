import { SheduledEvents } from "@services/brawl-stars/api/types/rotation"
import { BrawlStarsService } from "./service"
import axios from "axios"

class Events {
    root: BrawlStarsService

    constructor(root: BrawlStarsService) {
        this.root = root
    }

    getRotation = async (): Promise<SheduledEvents> => {
        const url = this.root.getUrl() + "/events/rotation"
        const request = await axios.get<SheduledEvents>(url, {
            headers: this.root.getHeaders()
        })
        return request.data
    }

}

export { Events }