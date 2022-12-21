import React from 'react';

interface GiPaginatorProps {
    gotoPage: (pageIndex: number) => void;
    canPreviousPage: boolean;
    previousPage: () => void;
    nextPage: () => void;
    canNextPage: boolean;
    pageCount: number;
    pageIndex: number;
    totalPages: number;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
}

export function GiPaginator({
                                gotoPage,
                                canPreviousPage,
                                previousPage,
                                nextPage,
                                canNextPage,
                                pageCount,
                                pageIndex,
                                totalPages,
                                pageSize,
                                setPageSize
                            }: GiPaginatorProps) {

    return (
        <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
            </button>
            {' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
            </button>
            {' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
            </button>
            {' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
            </button>
            {' '}
            <span>
          Page{' '}
                <strong>
            {pageIndex + 1} of {totalPages}
          </strong>{' '}
        </span>

            <select
                value={pageSize}
                onChange={e => {
                    setPageSize(Number(e.target.value))
                }}>
                {[10, 25, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                ))}
            </select>
        </div>
    )
}
