import React, {ChangeEvent, useState} from 'react';
import {useDidUpdateEffect, useStickyState} from './shared/hooks';
import GiForm from './components/form/form';
import {STORAGE_KEYS} from './shared/config';
import {GetDataParams, GifVM, Rating, View} from './shared/types';
import {GiTable} from './components/table/table';
import {getGifsData} from "./services/giphy.service";
import {GiPaginator} from "./components/paginator/paginator";
import {find, reduce} from "lodash";
import {GiList} from "./components/list/list";
import './App.css';
import {GiLoader} from "./components/loader/loader";

// fix for strange behaviour
let _offset = 0;

function App(): JSX.Element {
    const [view, setView] = useStickyState<View>('table', STORAGE_KEYS.view);
    const [search, setSearch] = useStickyState<string>('', STORAGE_KEYS.search);
    const [limit, setLimit] = useStickyState<number>(25, STORAGE_KEYS.limit);
    const [offset, setOffset] = useStickyState<number>(0, STORAGE_KEYS.offset);
    const [total, setTotal] = useStickyState<number>(0, STORAGE_KEYS.total);
    const [gifs, setGifs] = useStickyState<GifVM[]>([], STORAGE_KEYS.gifs);
    const [rating, setRating] = useStickyState<Rating>('r', STORAGE_KEYS.rating);
    const [language, setLanguage] = useStickyState<string>('en', STORAGE_KEYS.language);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    _offset = offset;

    const getScrollGifs = (newGifs: GifVM[]): GifVM[] => {
        return reduce(newGifs, (acc: GifVM[], gif: GifVM) => {
            if (!find(acc, {imgUrl: gif.imgUrl})) {
                acc.push(gif);
            }
            return acc;
        }, [...gifs]);
    };

    const getData = async () => {
        setIsLoading(true);
        const {data, totalCount} = await getGifsData(search, limit, offset, rating, language);
        if (view === 'table') {
            setGifs(data);
        } else {
            const _gifs = getScrollGifs(data);
            setGifs(_gifs);
        }
        setTotal(totalCount);
        setIsLoading(false);
    };

    useDidUpdateEffect(() => {
        getData();
    }, [limit, offset, search, rating, language]);

    const handleSubmit = (e: GetDataParams): void => {
        _offset = 0;
        setOffset(0);
        setGifs([]);
        setSearch(e.search);
        setRating(e.rating);
        setLanguage(e.language);
    };

    const goToPage = (page: number) => {
        _offset = page * limit;
        setOffset(page * limit);
    };

    const goToNextPage = () => {
        goToPage(_offset / limit + 1);
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
                        currentRating={rating}
                        currentSearch={search}
                        currentLanguage={language}/>

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
                    <GiList listItems={gifs} fetchItems={goToNextPage} totalItems={total}/>
                }
            </div>

            {isLoading ? <div className={'loader-overlay'}>
                <GiLoader/>
            </div> : null}
        </div>
    );
}

export default App;
