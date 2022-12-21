import React, {useEffect, useMemo, useState} from 'react';
import {Column, useTable} from 'react-table';
import {GiTableRow} from '../../lib/types';

import './table.css';

interface GiTableProps {
    tableData: GiTableRow[];
}

const cols: Column<GiTableRow>[] = [
    {
        Header: 'User Name',
        accessor: 'userName',
    },
    {
        Header: 'Image',
        Cell: tableProps => (
            <img
                src={tableProps.row.original.imgUrl}
                height={80}
                alt='imgUrl'
            />
        ),
        accessor: 'imgUrl',
    },
    {
        Header: 'Tiny Image',
        Cell: tableProps => (
            <video
                height={45}
                src={tableProps.row.original.tinyImgUrl}
            />
        ),
        accessor: 'tinyImgUrl',
    },
];

const mobileCols: Column<GiTableRow>[] = [
    {
        Header: 'User Name',
        accessor: 'userName',
    },
    {
        Header: 'Image',
        Cell: tableProps => (
            <video
                height={45}
                src={tableProps.row.original.tinyImgUrl}
            />
        ),
        accessor: 'tinyImgUrl',
    },
];

export function GiTable({tableData}: GiTableProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleStatusChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        }

        const isMobileMQ = window.matchMedia('(max-width: 600px)');
        isMobileMQ.addEventListener('change', handleStatusChange);
        setIsMobile(isMobileMQ.matches);

        return () => {
            isMobileMQ.removeEventListener('change', handleStatusChange);
        };
    }, []);

    const columns: Column<GiTableRow>[] = useMemo(
        () => isMobile ? mobileCols : cols,
        [isMobile],
    );

    const {
        headerGroups,
        rows,
        prepareRow,
        getTableProps,
        getTableBodyProps,
    } = useTable<GiTableRow>({columns, data: tableData});

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
