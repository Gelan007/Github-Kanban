import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../redux/store";
import {getIssues, setNextPageUrl} from "../../redux/slices/kanban-board-slice";
import {useEffect} from "react";


export const useIssuesDataFetching = () => {
    const issuesHeaderLink = useSelector((state: AppRootStateType) => state.kanbanBoard.issuesHeaderLink);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (issuesHeaderLink) {
            dispatch(setNextPageUrl({ headerLink: issuesHeaderLink }));
        }
    }, [issuesHeaderLink])

    const handleDataFetching = async (url: string, isLoadMoreData: boolean) => {
        try {
            dispatch(getIssues({url, isLoadMoreData}));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return {handleDataFetching}
}