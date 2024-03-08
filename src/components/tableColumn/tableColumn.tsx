import React, {ReactNode} from 'react';
import s from "./tableColumn.module.scss"
import {BoardTitles} from "../../interfaces/enums";

interface TableColumnProps {
    header: string
    children: ReactNode,
    dragProps: {
        onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
        onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
    }
}

const TableColumn:React.FC<TableColumnProps> = ({header, children, dragProps}) => {
    const mapColumnStyle = (title: string): string => {
        const columnStyles = {
            [`${BoardTitles.ToDo}`]: s.blue,
            [`${BoardTitles.InProgress}`]: s.yellow,
            [`${BoardTitles.Done}`]: s.green,
        }

        return columnStyles[title] && columnStyles[title];
    }
    return (
        <div className={s.tableColumn} {...dragProps} draggable={false}>
            <h4 className={s.header} draggable={false}>{header}</h4>
            <div className={`${s.column} ${mapColumnStyle(header)}`}>
                {children}
            </div>
        </div>
    );
};

export default TableColumn;