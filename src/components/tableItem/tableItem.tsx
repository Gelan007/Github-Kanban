import React, {useEffect, useState} from 'react';
import s from "./tableItem.module.scss"
import {getTransformedDate} from "../../utils/date";


export type TableItemProps =  {
    title: string
    number: number
    createdAt: Date
    user: string
    comments: number
    dragProps: {
        draggable?: boolean
        onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
        onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
        onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
        onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
        onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
    }
}

const TableItem: React.FC<TableItemProps> = (props) => {
    const transformedDate: string = getTransformedDate(props.createdAt);

    return (
        <div
            className={s.tableItem}
            {...props.dragProps}
        >
            <div className={s.title}>{props.title}</div>
            <div className={s.mainInfo}>{`#${props.number} opened ${transformedDate}`}</div>
            <div className={s.secondaryInfo}>{`${props.user} | Comments: ${props.comments}`}</div>
        </div>
    );
};

export default TableItem;