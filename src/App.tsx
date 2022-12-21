import React, {ChangeEvent, FormEvent} from 'react';
import './App.css';
import {useDidUpdateEffect, useStickyState} from './shared/hooks';
import GiForm from './components/form/form';
import {STORAGE_KEYS} from './shared/config';
import {GifVM, Rating, View} from './shared/types';
import {GiTable} from './components/table/table';
import {getGifsData} from "./services/giphy.service";
import {GiPaginator} from "./components/paginator/paginator";
import InfiniteScroll from 'react-infinite-scroller';
import {find, map, reduce} from "lodash";

function App(): JSX.Element {
    const [view, setView] = useStickyState<View>('table', STORAGE_KEYS.view);
    const [search, setSearch] = useStickyState<string>('', STORAGE_KEYS.search);
    const [limit, setLimit] = useStickyState<number>(25, STORAGE_KEYS.limit);
    const [offset, setOffset] = useStickyState<number>(0, STORAGE_KEYS.offset);
    const [total, setTotal] = useStickyState<number>(0, STORAGE_KEYS.total);
    const [gifs, setGifs] = useStickyState<GifVM[]>([], STORAGE_KEYS.gifs);
    const [rating, setRating] = useStickyState<Rating>('r', STORAGE_KEYS.rating);
    const [language, setLanguage] = useStickyState<string>('en', STORAGE_KEYS.language);

    const getScrollGifs = (newGifs: GifVM[]): GifVM[] => {
        return reduce(newGifs, (acc: GifVM[], gif: GifVM) => {
            if (!find(acc, {imgUrl: gif.imgUrl})) {
                acc.push(gif);
            }
            return acc;
        }, gifs);
    };

    const getData = async () => {
        const {data, totalCount} = await getGifsData(search, limit, offset, rating, language);
        setGifs(view === 'table' ? data : getScrollGifs(data));
        setTotal(totalCount);
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
                        searchChange={setSearch}
                        language={language}
                        languageChange={setLanguage}/>

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
                            pageStart={0}
                            loadMore={() => goToPage(offset / limit + 1)}
                            hasMore={gifs.length < total}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                            useWindow={false}>
                            {map(gifs, (gif, i) => (
                                <div className={'list-item'} key={i}>
                                    <img alt={gif.userName}
                                         height={80}
                                         src={gif.imgUrl}/>
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
