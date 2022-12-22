import React, {useEffect, useRef} from 'react';
import {GifVM} from "../../shared/types";

import './list.css';

interface ListProps {
    listItems: GifVM[];
    totalItems: number;
    fetchItems: () => void;
}

export const GiList = ({listItems, fetchItems, totalItems}: ListProps) => {
    const listElementRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listElementRef.current) {
            listElementRef.current.addEventListener('scroll', handleScroll);
        }
    }, []);

    function handleScroll() {
        if (listItems.length >= totalItems) {
            return;
        }
        if (!listElementRef.current) {
            return;
        }
        if ((listElementRef.current.scrollTop + listElementRef.current.offsetHeight) >= listElementRef.current.scrollHeight) {
            fetchItems();
        }
    }

    return (
        <ul className="list-group" ref={listElementRef}>
            {listItems.map((listItem, i) => (<li key={i} className="list-group-item">
                <div className={'list-item'} key={i}>
                    <img alt={listItem.userName}
                         height={80}
                         src={listItem.imgUrl}/>
                </div>
            </li>))}
        </ul>
    );
};
