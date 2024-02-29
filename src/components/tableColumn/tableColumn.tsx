import React, {ReactNode} from 'react';
import s from "./tableColumn.module.scss"

interface TableColumnProps {
    header: string
    children: ReactNode
}

const TableColumn:React.FC<TableColumnProps> = ({header, children}) => {
    return (
        <div className={s.tableColumn}>
            <h4 className={s.header}>{header}</h4>
            <div className={s.column}>
                {children}
            </div>
        </div>
    );
};

export default TableColumn;