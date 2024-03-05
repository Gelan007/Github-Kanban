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
    setIssueToSessionStorage, addGroupedIssues
} from "../../redux/slices/kanban-board-slice";
import {BoardTitles} from "../../interfaces/enums";
import {getGroupedIssuesWithTitles} from "../../redux/utils/kanban-board-slice-utils";
import Spinner from 'react-bootstrap/Spinner';
import {useIssuesDataFetching} from "../../hooks/board/useIssuesDataFetching";


type MapStatePropsType = {
    issues: GitHubIssue[]
    issuesHeaderLink: string
    groupedIssues: GroupedIssues
    isLoading: boolean
}
type MapDispatchPropsType = {
    setIssues: (issues: GitHubIssue) => void
    updateAllGroupedIssues: (payload: {groupedIssues: GroupedIssuesWithTitles[]}) => void
    addMoreIssues: (issues: GitHubIssue) => void
    getIssues: (payload: {url: string, isLoadMoreData: boolean}) => void
    addGroupedIssues: (payload: {item: GitHubIssue, title: string}) => void
    setIssueToSessionStorage: (payload: { issue: GitHubIssue, status: BoardTitles }) => void
}
type OwnPropsType = {}

type BooksContainerProps = MapStatePropsType & MapDispatchPropsType & OwnPropsType

const GithubKanbanBoardContainer: React.FC<BooksContainerProps> = (props) => {
    const [userInput, setUserInput] = useState<string>('https://github.com/Gelan007/QuestRoad-front/issues');
    const {handleDataFetching} = useIssuesDataFetching();

    const fetchData = async () => {
        await handleDataFetching(userInput, false)
    };

    /*const loadMoreData = async () => {
        if(nextPageUrl) {
            await handleDataFetching(nextPageUrl, true)
        }
    };*/


    return (
       /* <div>
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
                           boards={getGroupedIssuesWithTitles(props.groupedIssues)}
                           setBoards={props.updateAllGroupedIssues}
                           addGroupedIssues={props.addGroupedIssues}
                           setIssueToSessionStorage={props.setIssueToSessionStorage}
                           isLoading={props.isLoading}

        />
    );
};

const mapStateToProps = (state: AppRootStateType): MapStatePropsType => {
    return {
        issues: state.kanbanBoard.issues,
        issuesHeaderLink: state.kanbanBoard.issuesHeaderLink,
        groupedIssues: state.kanbanBoard.groupedIssues,
        isLoading: state.kanbanBoard.isLoading
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppRootStateType>
(mapStateToProps, {setIssues, addMoreIssues, getIssues, updateAllGroupedIssues, addGroupedIssues, setIssueToSessionStorage})(GithubKanbanBoardContainer);

