import React, {ChangeEvent, FormEvent} from 'react';
import './App.css';
import {useDidUpdateEffect, useStickyState} from './lib/hooks';
import GiForm from './components/form/form';
import {STORAGE_KEYS} from './lib/config';
import {GiTableRow, Rating, View} from './lib/types';
import {GiTable} from './components/table/table';
import {getGifsData} from "./services/giphy.service";
import {GiPaginator} from "./components/table/paginator/paginator";
import InfiniteScroll from 'react-infinite-scroll-component';
import {map} from "lodash";

function App(): JSX.Element {
    const [view, setView] = useStickyState<View>('table', STORAGE_KEYS.view);
    const [search, setSearch] = useStickyState<string>('', STORAGE_KEYS.search);
    const [limit, setLimit] = useStickyState<number>(25, STORAGE_KEYS.limit);
    const [offset, setOffset] = useStickyState<number>(0, STORAGE_KEYS.offset);
    const [total, setTotal] = useStickyState<number>(0, STORAGE_KEYS.total);
    const [gifs, setGifs] = useStickyState<GiTableRow[]>([], STORAGE_KEYS.gifs);
    const [rating, setRating] = useStickyState<Rating | null>('r', STORAGE_KEYS.rating);

    const getData = async () => {
        const {data, pagination} = await getGifsData(search, limit, offset, rating);
        setGifs(view === 'table' ? data : [...gifs, ...data]);
        setTotal(pagination.totalCount);
    };

    useDidUpdateEffect(() => {
        getData();
    }, [limit, offset]);

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        await getData();
    };

    const goToPage = (page: number) => {
        setOffset(page * limit);
    };

    const setPageSize = (pageSize: number) => {
        setLimit(pageSize);
        goToPage(0);
    };

    const onViewChange = (event: ChangeEvent<HTMLInputElement>) => {
        setView(event.currentTarget.value as View);
    }

    return (
        <div className="app">
            <div className={'form-container'}>
                <GiForm handleSubmit={handleSubmit}
                        rating={rating}
                        ratingChange={setRating}
                        search={search}
                        searchChange={setSearch}/>

                <div className={'toggle-view'}>
                    <div>
                        <input type="radio" name="view" value="table"
                               checked={view === 'table'} onChange={onViewChange}/>
                        <span>Table</span>
                    </div>

                    <div>
                        <input type="radio" name="view" value="scroll"
                               checked={view === 'scroll'} onChange={onViewChange}/>
                        <span>Scroll</span>
                    </div>
                </div>
            </div>

            <div className={'content'}>
                {view === 'table' ?
                    <>
                        <GiPaginator gotoPage={goToPage}
                                     canPreviousPage={offset > 0}
                                     previousPage={() => goToPage(offset / limit - 1)}
                                     nextPage={() => goToPage(offset / limit + 1)}
                                     canNextPage={offset + limit < total}
                                     pageCount={total}
                                     pageIndex={offset / limit}
                                     totalPages={Math.ceil(total / limit)}
                                     pageSize={limit}
                                     setPageSize={setPageSize}/>

                        <div className={'table-container'}>
                            <GiTable tableData={gifs}/>
                        </div>
                    </> :
                    <div className={'scroll-container'}>
                        <InfiniteScroll
                            dataLength={gifs.length} //This is important field to render the next data
                            next={() => goToPage(offset / limit + 1)}
                            hasMore={gifs.length < total}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            // below props only if you need pull down functionality
                            refreshFunction={() => goToPage(0)}
                            pullDownToRefresh
                            pullDownToRefreshThreshold={50}
                            pullDownToRefreshContent={
                                <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
                            }
                            releaseToRefreshContent={
                                <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
                            }
                        >
                            {map(gifs, (gif, i) => <div key={i}><img alt={gif.userName} height={80}
                                                                         src={gif.imgUrl}/></div>)}
                        </InfiniteScroll>
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
