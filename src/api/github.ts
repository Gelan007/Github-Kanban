import axios, {AxiosResponse} from "axios";


export const githubAPI = {
    async getIssues(url: string, isValidUrl: boolean) {
        const transformedUrl = getValidUrlFormat(url)
        const response = await axios.get(isValidUrl ? url : transformedUrl)

        return response;
    }
}

const getValidUrlFormat = (inputUrl: string): string => {
    const parts = inputUrl.split('/');

    if (parts.length === 7 && parts[3] === 'repos') {
        return inputUrl;
    } else if (parts[2] === "github.com") {
        return `https://api.github.com/repos/${parts[3]}/${parts[4]}/issues?state=all`;
    }

    return ''
}