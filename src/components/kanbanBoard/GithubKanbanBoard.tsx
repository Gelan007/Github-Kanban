import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, InputGroup, ListGroup, Row} from "react-bootstrap";
import s from "./GithubKanbanBoard.module.scss"
import TableColumn from "../tableColumn/tableColumn";
import TableItem, {TableItemProps} from "../tableItem/tableItem";
import {GitHubIssue, GroupedIssuesWithTitles} from "../../interfaces/github";
import {useBoardActions} from "../../hooks/board/useBoardActions";
import {BoardTitles} from "../../interfaces/enums";


type GithubKanbanBoardProps = {
    issues: GitHubIssue[]
    userInput: string
    boards: GroupedIssuesWithTitles[]
    setUserInput: Dispatch<SetStateAction<string>>
    fetchData: () => void
    setBoards: (payload: {groupedIssues: GroupedIssuesWithTitles[]}) => void
    addGroupedIssues: (payload: {item: GitHubIssue, title: string}) => void
    setIssueToSessionStorage: (payload: { issue: GitHubIssue, status: BoardTitles }) => void
}

const GithubKanbanBoard: React.FC<GithubKanbanBoardProps> = ({issues, userInput, setUserInput, ...props}) => {
    const {handleDrop, handleColumnDrop} = useBoardActions();

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>, board: GroupedIssuesWithTitles, item:  GitHubIssue) => {
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
        const currentBoardData: GroupedIssuesWithTitles = getParsedDataFromDataTransfer(e, "board") as GroupedIssuesWithTitles;
        const currentItemData: GitHubIssue = getParsedDataFromDataTransfer(e, "item") as GitHubIssue;
        handleDrop(board, item, currentBoardData, currentItemData);
    }

    const dropColumnHandler = (e: React.DragEvent<HTMLDivElement>, board: GroupedIssuesWithTitles) => {
        e.preventDefault()
        const currentBoardData: GroupedIssuesWithTitles = JSON.parse(e.dataTransfer.getData('board'))
        const currentItemData: GitHubIssue = JSON.parse(e.dataTransfer.getData("item"))

        handleColumnDrop(board, currentBoardData, currentItemData)
    }

    const getParsedDataFromDataTransfer = (
        e: React.DragEvent<HTMLDivElement>,
        format: string
    ): GroupedIssuesWithTitles | GitHubIssue =>
    {
        return JSON.parse(e.dataTransfer.getData(format));
    }


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