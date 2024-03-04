import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, InputGroup, ListGroup, Row} from "react-bootstrap";
import s from "./GithubKanbanBoard.module.scss"
import TableColumn from "../tableColumn/tableColumn";
import TableItem, {TableItemProps} from "../tableItem/tableItem";
import {GitHubIssue, GroupedIssuesWithTitles} from "../../interfaces/github";


type GithubKanbanBoardProps = {
    issues: GitHubIssue[]
    userInput: string
    boards: GroupedIssuesWithTitles[]
    setUserInput: Dispatch<SetStateAction<string>>
    fetchData: () => void
    setBoards: (payload: {groupedIssues: GroupedIssuesWithTitles[]}) => void
    addGroupedIssues: (payload: {item: GitHubIssue, title: string}) => void
}

const GithubKanbanBoard: React.FC<GithubKanbanBoardProps> = ({issues, userInput, setUserInput, ...props}) => {

    const [currentBoard, setCurrentBoard] = useState<GroupedIssuesWithTitles>()
    const [currentItem, setCurrentItem] = useState<GitHubIssue>()

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>, board: GroupedIssuesWithTitles, item:  GitHubIssue) => {
        //setCurrentBoard(board)
        //setCurrentItem( item)
        e.dataTransfer.setData('board', JSON.stringify(board));
        e.dataTransfer.setData('item', JSON.stringify(item));
    }

    const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        target.style.boxShadow = 'none'
    }

    const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        target.style.boxShadow = 'none'
    }

    const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        const target = e.target as HTMLDivElement;
        if(target.className === s.tableItem) {
            target.style.boxShadow = '0 2px 3px grey'
        }
    }

    const dropHandler = (e: React.DragEvent<HTMLDivElement>, board: GroupedIssuesWithTitles, item: GitHubIssue) => {
        e.preventDefault()
        e.stopPropagation()
        const currentBoardData: GroupedIssuesWithTitles = getParsedDataFromDataTransfer(e, "board");
        const currentItemData: GitHubIssue = getParsedDataFromDataTransfer(e, "item") as GitHubIssue;

        if (currentBoardData && currentBoardData.items && currentItemData) {
            const updatedCurrentBoard: GroupedIssuesWithTitles = removeCurrentBoardDroppedItem(currentBoardData, currentItemData);
            addItemAndUpdateAllBoards(board, item, updatedCurrentBoard, currentItemData);
        }
    }

    const addItemAndUpdateAllBoards = (
        board: GroupedIssuesWithTitles,
        item: GitHubIssue,
        updatedCurrentBoard: GroupedIssuesWithTitles,
        currentItemData: GitHubIssue
    ) => {
        const dropIndex = board.items?.indexOf(item)
        if (dropIndex !== undefined && dropIndex !== -1 && board.items) {
            const updatedBoardItems: GitHubIssue[] = getUpdatedBoardItems(board, updatedCurrentBoard);
            updatedBoardItems.splice(dropIndex + 1, 0, currentItemData);

            formAndUpdateAllBoards(board, updatedBoardItems, updatedCurrentBoard);
        }
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

    const getParsedDataFromDataTransfer = (
        e: React.DragEvent<HTMLDivElement>,
        format: string
    ): GroupedIssuesWithTitles | GitHubIssue =>
    {
        return JSON.parse(e.dataTransfer.getData(format));
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

        props.setBoards({groupedIssues: getAllUpdatedBoards(updatedBoard, updatedCurrentBoard)});
    }


    const dropColumnHandler = (e: React.DragEvent<HTMLDivElement>, board: GroupedIssuesWithTitles) => {
        e.preventDefault()
        const currentBoardData: GroupedIssuesWithTitles = JSON.parse(e.dataTransfer.getData('board'))
        const currentItemData: GitHubIssue = JSON.parse(e.dataTransfer.getData("item"))

        if (currentBoardData && currentBoardData.items && currentItemData) {
            // props.addGroupedIssues({item: currentItemData, title: board.title})
            const updatedCurrentBoard: GroupedIssuesWithTitles = removeCurrentBoardDroppedItem(currentBoardData, currentItemData)
            const updatedBoardItems: GitHubIssue[] = getUpdatedBoardItemsForColumn(board, updatedCurrentBoard, currentItemData);

            formAndUpdateAllBoards(board, updatedBoardItems, updatedCurrentBoard);
        }
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
        const updatedBoards = props.boards.map(b => {
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


    return (
        <div className={s.githubKanbanBoard}>
            <InputGroup className={s.topBlock}>
                <Form.Control
                    placeholder="Enter repo URL"
                    style={{ borderRadius: '5px' }}
                    onChange={(e) => setUserInput(e.target.value)}
                    value={userInput}
                >

                </Form.Control>
                <Button variant="primary"
                        size="sm"
                        style={{ borderRadius: '5px' }}
                        onClick={props.fetchData}
                >
                    Load issues
                </Button>
            </InputGroup>
            <div className={s.board}>
                {props.boards.map(board => (
                    <TableColumn
                        header={board.title}
                        dragProps={{
                            onDragOver: (e) => dragOverHandler(e),
                            onDrop: (e) => dropColumnHandler(e, board),
                        }}
                    >
                        {Array.isArray(board.items) && board.items
                            .map(issue => (
                                <TableItem
                                    dragProps={{
                                        draggable: true,
                                        onDragStart: (e) => dragStartHandler(e, board, issue),
                                        onDragEnd: (e) => dragEndHandler(e),
                                        onDragLeave: (e) => dragLeaveHandler(e),
                                        onDragOver: (e) => dragOverHandler(e),
                                        onDrop: (e) => dropHandler(e, board, issue),
                                    }}

                                    title={issue.title}
                                    comments={issue.comments}
                                    createdAt={issue.created_at}
                                    number={issue.number}
                                    user={issue.user.login}
                                    key={issue.id}
                                />
                            ))}
                    </TableColumn>
                ))}
            </div>
        </div>
    );
};

export default GithubKanbanBoard;