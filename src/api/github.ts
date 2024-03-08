import axios from "axios";
import {getValidRepositoryUrlFormat, getValidUrlFormat} from "./utils";


export const githubAPI = {
    async getIssues(url: string, isValidUrl: boolean) {
        const transformedUrl = getValidUrlFormat(url)
        const response = await axios.get(isValidUrl ? url : transformedUrl)

        return response;
    },
    async getRepositoryInformation(url: string, isValidUrl: boolean) {
        const transformedUrl = getValidRepositoryUrlFormat(url)
        const response = await axios.get(isValidUrl ? url : transformedUrl)

        return response;
    }
}

