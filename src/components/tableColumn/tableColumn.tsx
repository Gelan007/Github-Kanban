import React, {ReactNode} from 'react';
import s from "./tableColumn.module.scss"

interface TableColumnProps {
    header: string
    children: ReactNode,
    dragProps: {
        onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
        onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
    }
}

const TableColumn:React.FC<TableColumnProps> = ({header, children, dragProps}) => {
    return (
        <div className={s.tableColumn} {...dragProps}>
            <h4 className={s.header}>{header}</h4>
            <div className={s.column}>
                {children}
            </div>
        </div>
    );
};

export default TableColumn;