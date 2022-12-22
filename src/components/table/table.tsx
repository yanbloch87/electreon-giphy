import React, {useEffect, useMemo, useState} from 'react';
import {Column, useTable} from 'react-table';
import {GifVM} from '../../shared/types';
import {cols, mobileCols} from "./table.config";

import './table.css';

interface GiTableProps {
    tableData: GifVM[];
}

export function GiTable({tableData}: GiTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleStatusChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        }

        const isMobileMQ = window.matchMedia('(max-width: 700px)');
        isMobileMQ.addEventListener('change', handleStatusChange);
        setIsMobile(isMobileMQ.matches);

        return () => {
            isMobileMQ.removeEventListener('change', handleStatusChange);
        };
    }, []);

    const columns: Column<GifVM>[] = useMemo(
        () => isMobile ? mobileCols : cols,
        [isMobile],
    );

    const {
        headerGroups,
        rows,
        prepareRow,
        getTableProps,
        getTableBodyProps,
    } = useTable<GifVM>({columns, data: tableData});

    return (
        <table {...getTableProps()} className={'table'}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
