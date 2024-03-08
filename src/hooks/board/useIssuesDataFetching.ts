import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../redux/store";
import {getIssues, setNextPageUrl} from "../../redux/slices/kanban-board-slice";

export const useIssuesDataFetching = () => {
    const issuesHeaderLink = useSelector((state: AppRootStateType) => state.kanbanBoard.issuesHeaderLink);
    const dispatch = useAppDispatch();

    const handleDataFetching = async (url: string, isLoadMoreData: boolean) => {
        try {
            dispatch(getIssues({url, isLoadMoreData}));
            if (issuesHeaderLink) {
                dispatch(setNextPageUrl({headerLink: issuesHeaderLink}))
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return {handleDataFetching}
}