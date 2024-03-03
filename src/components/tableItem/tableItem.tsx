import React, {useEffect, useState} from 'react';
import s from "./tableItem.module.scss"
import {formatDistanceToNow} from "date-fns";
import {getTransformedDate} from "../../utils/date";

export type TableItemProps =  {
    title: string
    number: number
    createdAt: Date
    user: string
    comments: number
}

const TableItem: React.FC<TableItemProps> = (props) => {
    const transformedDate: string = getTransformedDate(props.createdAt);

    return (
        <div
            className={s.tableItem}
            draggable={true}
        >
            <div className={s.title}>{props.title}</div>
            <div className={s.mainInfo}>{`#${props.number} opened ${transformedDate}`}</div>
            <div className={s.secondaryInfo}>{`${props.user} | Comments: ${props.comments}`}</div>
        </div>
    );
};

export default TableItem;