import React, {useState} from 'react';
import {Button, Card, Col, Container, Form, InputGroup, ListGroup, Row} from "react-bootstrap";
import s from "./GithubKanbanBoard.module.scss"
import TableColumn from "../tableColumn/tableColumn";
import TableItem from "../tableItem/tableItem";

const GithubKanbanBoard = () => {

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', status: 'todo', mainInfo: "#315 opened 3 days ago", secondaryInfo: "Admin | Comments: 3"},
        { id: 2, title: 'Task 2', status: 'inProgress', mainInfo: "#315 opened 3 days ago", secondaryInfo: "Admin | Comments: 3" },
        { id: 3, title: 'Task 3', status: 'done', mainInfo: "#315 opened 3 days ago", secondaryInfo: "Admin | Comments: 3" }
    ]);

    const handleStatusChange = (taskId: number, newStatus: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    return (
        <div className={s.githubKanbanBoard}>
            <InputGroup className={s.topBlock}>
                <Form.Control
                    placeholder="sdfsdf"
                    style={{ borderRadius: '5px' }}
                >

                </Form.Control>
                <Button variant="primary"
                        size="sm"
                        style={{ borderRadius: '5px' }}
                >
                    Load issues
                </Button>
            </InputGroup>
            <div className={s.board}>
                <TableColumn header={"ToDo"}>
                    {tasks.map(task => (
                        <TableItem title={task.title} mainInfo={task.mainInfo} secondaryInfo={task.secondaryInfo}></TableItem>
                    ))}
                </TableColumn>
                <TableColumn header={"In Progress"}>
                    {tasks.map(task => (
                        <TableItem title={task.title} mainInfo={task.mainInfo} secondaryInfo={task.secondaryInfo}></TableItem>
                    ))}
                </TableColumn>
                <TableColumn header={"Done"}>
                    {tasks.map(task => (
                        <TableItem title={task.title} mainInfo={task.mainInfo} secondaryInfo={task.secondaryInfo}></TableItem>
                    ))}
                </TableColumn>
            </div>

        </div>
    );
};

export default GithubKanbanBoard;