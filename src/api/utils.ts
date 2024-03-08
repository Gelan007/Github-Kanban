export const getValidUrlFormat = (inputUrl: string): string => {
    const parts = inputUrl.split('/');

    if (parts[3] === 'repos') {
        return `https://api.github.com/repos/${parts[4]}/${parts[5]}/issues?state=all`;
    } else if (parts[2] === "github.com") {
        return `https://api.github.com/repos/${parts[3]}/${parts[4]}/issues?state=all`;
    }

    return ''
}

export const getValidRepositoryUrlFormat = (inputUrl: string): string => {
    const parts = inputUrl.split('/');

    if (parts[3] === 'repos') {
        return `https://api.github.com/repos/${parts[4]}/${parts[5]}`;
    } else if (parts[2] === "github.com") {
        return `https://api.github.com/repos/${parts[3]}/${parts[4]}`;
    }

    return ''
}