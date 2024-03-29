import React, {useState} from 'react';
import GithubKanbanBoard from "./GithubKanbanBoard";
import {GitHubIssue, GroupedIssues, GroupedIssuesWithTitles, RepositoryData} from "../../interfaces/github";
import {connect} from "react-redux";
import {AppRootStateType} from "../../redux/store";
import {
    setIssues,
    addMoreIssues,
    getIssues,
    updateAllGroupedIssues,
    setIssueToSessionStorage
} from "../../redux/slices/kanban-board-slice";
import {BoardTitles} from "../../interfaces/enums";
import {getGroupedIssuesWithTitles} from "../../redux/utils/kanban-board-slice-utils";
import {useIssuesDataFetching} from "../../hooks/board/useIssuesDataFetching";


type MapStatePropsType = {
    issues: GitHubIssue[]
    issuesHeaderLink: string
    groupedIssues: GroupedIssues
    repoData: RepositoryData
    isLoading: boolean
    error: string | null
    nextPageUrl: string | null
}
type MapDispatchPropsType = {
    setIssues: (issues: GitHubIssue) => void
    updateAllGroupedIssues: (payload: {groupedIssues: GroupedIssuesWithTitles[]}) => void
    addMoreIssues: (issues: GitHubIssue) => void
    getIssues: (payload: {url: string, isLoadMoreData: boolean}) => void
    setIssueToSessionStorage: (payload: { issue: GitHubIssue, status: BoardTitles }) => void
}
type OwnPropsType = {}

type BooksContainerProps = MapStatePropsType & MapDispatchPropsType & OwnPropsType

const GithubKanbanBoardContainer: React.FC<BooksContainerProps> = (props) => {
    const [userInput, setUserInput] = useState<string>('');
    const {handleDataFetching} = useIssuesDataFetching();

    const fetchData = async () => {
        await handleDataFetching(userInput, false)
    };

    const loadMoreData = async () => {
        if(props.nextPageUrl) {
            await handleDataFetching(props.nextPageUrl, true)
        }
    };

    return (
        <GithubKanbanBoard issues={props.issues} userInput={userInput}
                           setUserInput={setUserInput} fetchData={fetchData}
                           boards={getGroupedIssuesWithTitles(props.groupedIssues)}
                           repoData={props.repoData}
                           isLoading={props.isLoading}
                           error={props.error}
                           loadMoreData={loadMoreData}
        />
    );
};

const mapStateToProps = (state: AppRootStateType): MapStatePropsType => {
    return {
        issues: state.kanbanBoard.issues,
        issuesHeaderLink: state.kanbanBoard.issuesHeaderLink,
        groupedIssues: state.kanbanBoard.groupedIssues,
        isLoading: state.kanbanBoard.isLoading,
        error: state.kanbanBoard.error,
        repoData: state.kanbanBoard.repoData,
        nextPageUrl: state.kanbanBoard.nextPageUrl
    }
}

export default connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppRootStateType>
(mapStateToProps, {setIssues, addMoreIssues, getIssues, updateAllGroupedIssues, setIssueToSessionStorage})(GithubKanbanBoardContainer);

