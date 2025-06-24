import type { JSX } from '@emotion/react/jsx-runtime';
import { type ReactNode } from 'react';
import { Loader } from '../Loader';

export type Row = { [key: string]: unknown };
export type Column = {
    field : string
    title : string 
    renderCell?: (row: Row, index: number) => ReactNode
    align? : FlexAlignment,
};

type FlexAlignment = "flex-start" | "center" | "flex-end";

interface TableProps {
    columns : Column[]
    data : Row[],
    columnsTemplate?: Map<string,number>
    children?: JSX.Element | JSX.Element[]
    loading?: boolean
};

export const Table = ({ columns, data, columnsTemplate, children, loading } : TableProps) => {

    const getTemplateColumns = () => {
        return columns.reduce((template, column) => {
            const widthRatio = columnsTemplate?.get(column.field) ?? 1;
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

    const displayColumns = (row : Row, rowIndex: number) => {
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
                            ? column.renderCell(row, rowIndex)
                            : <p>{String(value)}</p>
                    }
                </div>
            );
        })
    }

    const displayRows = () => {
        
        if (loading) {
            return <Loader/>
        }

        if (data.length === 0) {
            return (
                <div className="no-content">
                    <span>Ce tableau est vide</span>
                </div>
            )
        }

        return data.map((row,index) => 
            <div 
                className="row"
                key={index}
                style={{ gridTemplateColumns: getTemplateColumns() }}>
                {displayColumns(row, index)}
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
            <div className="footer">
                { children ?? null }
            </div>
        </div>
    );
}