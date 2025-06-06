import { type ReactNode } from 'react';

export type Row = { [key: string]: unknown };
export type Column = {
    field : string
    title : string 
    renderCell?: (row: Row) => ReactNode
    align? : FlexAlignment
};

type FlexAlignment = "flex-start" | "center" | "flex-end";

interface TableProps {
    columns : Column[]
    data : Row[],
    columnsTemplate : Map<string,number>
};

export const Table = ({ columns, data, columnsTemplate } : TableProps) => {

    const getTemplateColumns = () => {
        return columns.reduce((template, column) => {
            const widthRatio = columnsTemplate.get(column.field) || 1;
            return template + widthRatio + 'fr '
        }, '');
    }
   

    const displayHeader = () => {
        return (
            <div 
                className="table-header"
                style={{ gridTemplateColumns: getTemplateColumns() }}
            >
                {
                    columns.map(column => 
                        <p 
                            key={column.field}
                            style={{
                                display: "flex", 
                                justifyContent: column.align ? column.align : 'flex-start' }}
                        >
                            {column.title}
                        </p>
                    )
                }
            </div>
        );
    }

    const displayColumns = (row : Row) => {
        return columns.map(column => {

            const value = row[column.field];

            return (
                <div 
                    key={column.field} 
                    className="column"
                    style={{ justifyContent: column.align ? column.align : 'flex-start' }}
                >
                    {
                        column.renderCell 
                            ? column.renderCell(row)
                            : <p>{String(value)}</p>
                    }
                </div>
            );
        })
    }

    const displayRows = () => {
        return data.map((row,index) => 
            <div 
                className="row"
                key={index}
                style={{ gridTemplateColumns: getTemplateColumns() }}>
                {displayColumns(row)}
            </div>
        );
    }

    return (
        <div className="table">
            {displayHeader()}
            <div 
                className="rows" 
            >
                {displayRows()}
            </div>
        </div>
    );
}