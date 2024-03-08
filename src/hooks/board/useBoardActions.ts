import {GitHubIssue, GroupedIssuesWithTitles} from "../../interfaces/github";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../redux/store";
import {getGroupedIssuesWithTitles} from "../../redux/utils/kanban-board-slice-utils";
import {changeIssueOrderInSessionStorage, updateAllGroupedIssues} from "../../redux/slices/kanban-board-slice";

export const useBoardActions = () => {
    const dispatch = useDispatch();
    const groupedIssues = useSelector((state: AppRootStateType) => state.kanbanBoard.groupedIssues);
    const boards = getGroupedIssuesWithTitles(groupedIssues)

    const handleDrop = (
        board: GroupedIssuesWithTitles,
        item: GitHubIssue,
        currentBoardData: GroupedIssuesWithTitles,
        currentItemData: GitHubIssue
    ) => {
        if (currentBoardData && currentBoardData.items && currentItemData) {
            const updatedCurrentBoard: GroupedIssuesWithTitles = removeCurrentBoardDroppedItem(currentBoardData, currentItemData);
            const updatedBoardItems = addItemAndUpdateAllBoards(board, item, updatedCurrentBoard, currentItemData);
            dispatch(changeIssueOrderInSessionStorage({
                currentBoardItems: updatedCurrentBoard.items!,
                currentBoardTitle: updatedCurrentBoard.title,
                boardItems: updatedBoardItems!,
                boardTitle: board.title
                }
            ));
        }
    }

    const handleColumnDrop = (
        board: GroupedIssuesWithTitles,
        currentBoardData: GroupedIssuesWithTitles,
        currentItemData: GitHubIssue
    ) => {
        if (currentBoardData && currentBoardData.items && currentItemData) {
            // props.addGroupedIssues({item: currentItemData, title: board.title})
            const updatedCurrentBoard: GroupedIssuesWithTitles = removeCurrentBoardDroppedItem(currentBoardData, currentItemData)
            const updatedBoardItems: GitHubIssue[] = getUpdatedBoardItemsForColumn(board, updatedCurrentBoard, currentItemData);

            formAndUpdateAllBoards(board, updatedBoardItems, updatedCurrentBoard);
            dispatch(changeIssueOrderInSessionStorage({
                    currentBoardItems: updatedCurrentBoard.items!,
                    currentBoardTitle: updatedCurrentBoard.title,
                    boardItems: updatedBoardItems!,
                    boardTitle: board.title
                }
            ));
        }
    }

    const addItemAndUpdateAllBoards = (
        board: GroupedIssuesWithTitles,
        item: GitHubIssue,
        updatedCurrentBoard: GroupedIssuesWithTitles,
        currentItemData: GitHubIssue
    ): GitHubIssue[] | null => {
        const dropIndex = board.items?.indexOf(item)
        if (dropIndex !== undefined && dropIndex !== -1 && board.items) {
            const updatedBoardItems: GitHubIssue[] = getUpdatedBoardItems(board, updatedCurrentBoard);
            updatedBoardItems.splice(dropIndex + 1, 0, currentItemData);

            formAndUpdateAllBoards(board, updatedBoardItems, updatedCurrentBoard);
            return updatedBoardItems;
        }
        return null;
    }

    const removeCurrentBoardDroppedItem = (
        currentBoardData:GroupedIssuesWithTitles,
        currentItemData: GitHubIssue
    ): GroupedIssuesWithTitles  => {
        const currentIndex = currentBoardData.items!.map(item => item.id).indexOf(currentItemData.id)
        const updatedCurrentBoardItems = [
            ...currentBoardData.items!.slice(0, currentIndex),
            ...currentBoardData.items!.slice(currentIndex + 1),
        ];
        const updatedCurrentBoard:GroupedIssuesWithTitles = {
            title: currentBoardData.title,
            items: updatedCurrentBoardItems
        }
        return updatedCurrentBoard;
    }

    const getUpdatedBoardItems = (
        board: GroupedIssuesWithTitles,
        updatedCurrentBoard: GroupedIssuesWithTitles
    ): GitHubIssue[] => {
        const checkIfDraggedInCurrentBoard: boolean = board.title === updatedCurrentBoard.title;
        let updatedBoardItems: GitHubIssue[];

        if(checkIfDraggedInCurrentBoard) {
            updatedBoardItems = [...updatedCurrentBoard.items!]
        } else {
            updatedBoardItems = [...board.items!];
        }
        return updatedBoardItems;
    }

    const formAndUpdateAllBoards = (
        board: GroupedIssuesWithTitles,
        updatedBoardItems: GitHubIssue[],
        updatedCurrentBoard: GroupedIssuesWithTitles
    ): void => {
        const updatedBoard: GroupedIssuesWithTitles = {
            title: board.title,
            items: updatedBoardItems,
        };

        dispatch(updateAllGroupedIssues({groupedIssues: getAllUpdatedBoards(updatedBoard, updatedCurrentBoard)}));
    }

    const getUpdatedBoardItemsForColumn = (
        board: GroupedIssuesWithTitles,
        updatedCurrentBoard: GroupedIssuesWithTitles,
        currentItemData: GitHubIssue
    ): GitHubIssue[] => {
        const checkIfDraggedInCurrentBoard: boolean = board.title === updatedCurrentBoard.title;
        let updatedBoardItems: GitHubIssue[];

        if(checkIfDraggedInCurrentBoard) {
            updatedBoardItems = updatedCurrentBoard.items ? [...updatedCurrentBoard.items, currentItemData] : [currentItemData];
        } else {
            updatedBoardItems = board.items ? [...board.items, currentItemData] : [currentItemData];
        }
        return updatedBoardItems;
    }


    const getAllUpdatedBoards = (board: GroupedIssuesWithTitles, updatedCurrentBoard: GroupedIssuesWithTitles): GroupedIssuesWithTitles[] => {

        const updatedBoards = boards.map(b => {
            if (b.title === board.title) {
                return board;
            }
            if (b.title === updatedCurrentBoard!.title) {
                return updatedCurrentBoard!;
            }

            return b;
        });

        return updatedBoards;
    };

    return { handleDrop, handleColumnDrop };
}