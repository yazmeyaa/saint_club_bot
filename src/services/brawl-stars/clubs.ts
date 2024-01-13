import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { BrawlStarsService } from "./service";
import { BrawlStarsClub } from "types/brawlstars";
import { ClubMemberListReponseType } from "types/brawlstars/club";

export type GetClanMembersOptions = {
    before?: string
    after?: string
    limit?: string
}

class Clubs {
    root: BrawlStarsService

    constructor(root: BrawlStarsService) {
        this.root = root
    }

    getClanInfo = async (clubTag: string): Promise<BrawlStarsClub> => {
        try {
            const url = `${this.root.getUrl()}/clubs/${clubTag.replace("#", "%23")}`

            const config: AxiosRequestConfig = {
                headers: this.root.getHeaders()
            }

            const response = await axios.get<BrawlStarsClub>(url, config);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error: ${error.message}`)
            }
            if (error instanceof AxiosError) {
                throw new Error(`Error: ${error.message}`)
            }
            throw new Error("Error: Unexpected error!");
        }
    };

    getClanMembers = async (clubTag: string, options?: GetClanMembersOptions): Promise<ClubMemberListReponseType> => {
        const url = this.root.getUrl() + `/clubs/${clubTag.replace("#", "%23")}/members`
        const params = new URLSearchParams(options)
        const requestOptions: AxiosRequestConfig = {
            headers: this.root.getHeaders(),
            params
        }

        try {
            const response = await axios.get<ClubMemberListReponseType>(url, requestOptions)
            if (!response.data) throw new Error('Cannot get club members with tag: ' + clubTag)
            return response.data
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

export { Clubs }