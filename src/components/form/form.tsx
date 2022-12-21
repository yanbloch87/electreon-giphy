import React, {FormEvent} from 'react';
import Select from 'react-select';
import {Rating} from '../../lib/types';
import {find} from "lodash";

import './form.css';

interface RatingOption {
    value: Rating
    label: string
}

const ratings: RatingOption[] = [
    {value: 'g', label: 'General audiences'},
    {value: 'pg', label: 'Parental guidance suggested'},
    {value: 'pg-13', label: 'Parents strongly cautioned'},
    {value: 'r', label: 'Restricted'},
];

interface FormFormProps {
    handleSubmit: (e: FormEvent) => Promise<void>;
    search: string;
    searchChange: (search: string) => void;
    rating: Rating | null;
    ratingChange: (rating: Rating | null) => void;
}

function GiForm({handleSubmit, search, searchChange, rating, ratingChange}: FormFormProps): JSX.Element {
    const selectedRating = find(ratings, {value: rating}) as RatingOption;

    return (
        <form onSubmit={handleSubmit} className={'form'}>
            <span className={'label'}>Free Search</span>
            <input
                type="text"
                className={'input'}
                value={search}
                placeholder="Search"
                onChange={(e) => searchChange(e.target.value)}
            />

            <span className={'label'}>Select Rating</span>
            <Select className={'select'} options={ratings} value={selectedRating}
                    onChange={(e) => ratingChange((e != null) ? e.value : null)}/>

            <button type="submit" className={'btn'}>Search</button>
        </form>
    );
}

export default GiForm;
