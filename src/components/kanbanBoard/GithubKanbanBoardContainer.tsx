import React, {useEffect, useState} from 'react';
import GithubKanbanBoard from "./GithubKanbanBoard";
import {githubAPI} from "../../api/github";
import axios, {AxiosResponse} from "axios";
import {GitHubIssue} from "../../interfaces/github";


const GithubKanbanBoardContainer = () => {
    const [issues, setIssues] = useState<GitHubIssue[]>([]);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        await handleDataFetching("https://github.com/octocat/hello-worId", false)
    };

    const loadMoreData = async () => {
        if(nextPageUrl) {
            await handleDataFetching(nextPageUrl, true)
        }
    };

     const handleDataFetching = async (url: string, isLoadMoreData: boolean) => {
        try {
            const response = await githubAPI.getIssues(url, isLoadMoreData);
            const { data, headers } = response;
            !isLoadMoreData ? setIssues(data) : setIssues((prevIssues) => [...prevIssues, ...data]);

            if (headers.link) {
                setNextPage(headers.link)
            }
        } catch (error) {
            console.error('Error fetching more data:', error);
        }
    }

    const setNextPage = (headerLink: string) => {
        const links = headerLink.split(', ');
        for (const link of links) {
            const [url, rel] = link.split('; ');
            const parsedUrl = url.slice(1, -1);
            const parsedRel = rel.slice(5, -1);
            if (parsedRel === 'next') {
                setNextPageUrl(parsedUrl);
                break;
            }
        }
    }


    return (
        <div>
            <h1>GitHub Issues</h1>
            <ul>
                {issues.map((issue) => (
                    <li key={issue.id}>{issue.title}</li>
                ))}
            </ul>
            {nextPageUrl && <button onClick={loadMoreData}>Load More</button>}
        </div>
        // <GithubKanbanBoard></GithubKanbanBoard>
    );
};

export default GithubKanbanBoardContainer;