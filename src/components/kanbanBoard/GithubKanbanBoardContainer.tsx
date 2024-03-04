import React, {useEffect, useState} from 'react';
import GithubKanbanBoard from "./GithubKanbanBoard";
import {GitHubIssue, GroupedIssues, GroupedIssuesWithTitles} from "../../interfaces/github";
import {connect} from "react-redux";
import {AppRootStateType} from "../../redux/store";
import {
    setIssues,
    addMoreIssues,
    getIssues,
    updateAllGroupedIssues,
    addGroupedIssues
} from "../../redux/slices/kanban-board-slice";
import {BoardTitles} from "../../interfaces/enums";



type MapStatePropsType = {
    issues: GitHubIssue[]
    issuesHeaderLink: string
    groupedIssues: GroupedIssues
}
type MapDispatchPropsType = {
    setIssues: (issues: GitHubIssue) => void
    updateAllGroupedIssues: (payload: {groupedIssues: GroupedIssuesWithTitles[]}) => void
    addMoreIssues: (issues: GitHubIssue) => void
    getIssues: (payload: {url: string, isLoadMoreData: boolean}) => void
    addGroupedIssues: (payload: {item: GitHubIssue, title: string}) => void
}
type OwnPropsType = {}

type BooksContainerProps = MapStatePropsType & MapDispatchPropsType & OwnPropsType

const GithubKanbanBoardContainer: React.FC<BooksContainerProps> = (props) => {
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [userInput, setUserInput] = useState<string>('https://github.com/Gelan007/QuestRoad-front/issues');

    const fetchData = async () => {
        await handleDataFetching(userInput, false)
    };

    const loadMoreData = async () => {
        if(nextPageUrl) {
            await handleDataFetching(nextPageUrl, true)
        }
    };

     const handleDataFetching = async (url: string, isLoadMoreData: boolean) => {
        try {
            props.getIssues({url, isLoadMoreData});
            if (props.issuesHeaderLink) {
                setNextPage(props.issuesHeaderLink)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const getGroupedIssuesWithTitles = (): GroupedIssuesWithTitles[] => {
        const issues: GroupedIssuesWithTitles[] = [
            {title: BoardTitles.ToDo, items: props.groupedIssues.todoIssues},
            {title: BoardTitles.InProgress, items: props.groupedIssues.inProgressIssues},
            {title: BoardTitles.Done, items: props.groupedIssues.doneIssues},
        ]

        return issues;
    }


    return (
        /*<div>
            <h1>GitHub Issues</h1>
            <ul>
                {props.issues.map((issue) => (
                    <li key={issue.id}>{issue.title}</li>
                ))}
            </ul>
            {nextPageUrl && <button onClick={loadMoreData}>Load More</button>}
        </div>*/
        <GithubKanbanBoard issues={props.issues} userInput={userInput}
                           setUserInput={setUserInput} fetchData={fetchData}
                           boards={getGroupedIssuesWithTitles()}
                           setBoards={props.updateAllGroupedIssues}
                           addGroupedIssues={props.addGroupedIssues}

        />
    );
};

const mapStateToProps = (state: AppRootStateType): MapStatePropsType => {
    return {
        issues: state.kanbanBoard.issues,
        issuesHeaderLink: state.kanbanBoard.issuesHeaderLink,
        groupedIssues: state.kanbanBoard.groupedIssues
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppRootStateType>
(mapStateToProps, {setIssues, addMoreIssues, getIssues, updateAllGroupedIssues, addGroupedIssues})(GithubKanbanBoardContainer);

