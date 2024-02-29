import React from 'react';
import s from "./tableItem.module.scss"

interface TableItemProps {
    title: string
    mainInfo: string
    secondaryInfo: string
}
// Here will be another information, not just mainInfo or secondaryInfo
const TableItem: React.FC<TableItemProps> = ({title, mainInfo, secondaryInfo}) => {
    return (
        <div className={s.tableItem}>
            <div className={s.title}>{title}</div>
            <div className={s.mainInfo}>{mainInfo}</div>
            <div className={s.secondaryInfo}>{secondaryInfo}</div>
        </div>
    );
};

export default TableItem;