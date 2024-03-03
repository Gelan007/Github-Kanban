import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, InputGroup, ListGroup, Row} from "react-bootstrap";
import s from "./GithubKanbanBoard.module.scss"
import TableColumn from "../tableColumn/tableColumn";
import TableItem, {TableItemProps} from "../tableItem/tableItem";
import {GitHubIssue} from "../../interfaces/github";
import {GroupedIssuesWithTitles} from "./GithubKanbanBoardContainer";

type GithubKanbanBoardProps = {
    issues: GitHubIssue[]
    userInput: string
    groupedIssues: GroupedIssuesWithTitles[]
    setUserInput: Dispatch<SetStateAction<string>>
    fetchData: () => void
}

const GithubKanbanBoard: React.FC<GithubKanbanBoardProps> = ({issues, userInput, setUserInput, ...props}) => {

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
                {props.groupedIssues.map(board => (
                    <TableColumn header={board.title}>
                        {Array.isArray(board.items) && board.items
                            .map(issue => (
                                <TableItem
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