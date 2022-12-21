import {Column} from "react-table";
import {GifVM} from "../../shared/types";
import React from "react";

export const cols: Column<GifVM>[] = [
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

export const mobileCols: Column<GifVM>[] = [
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
