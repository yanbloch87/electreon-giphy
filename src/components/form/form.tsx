import React, {FormEvent, useState} from 'react';
import Select from 'react-select';
import {GetDataParams, Option, Rating, RatingOption} from '../../shared/types';
import {find, includes, map} from "lodash";
import {useStickyState} from "../../shared/hooks";
import {STORAGE_KEYS} from "../../shared/config";
import CreatableSelect from "react-select/creatable";
import {languages, ratings} from "./form.config";

import './form.css';

interface FormFormProps {
    handleSubmit: (e: GetDataParams) => void;
    currentSearch: string;
    currentRating: Rating;
    currentLanguage: string;
}

function GiForm({
                    handleSubmit,
                    currentSearch,
                    currentRating,
                    currentLanguage,
                }: FormFormProps): JSX.Element {
    const [search, setSearch] = useState<string>(currentSearch);
    const [rating, setRating] = useState<Rating>(currentRating);
    const [language, setLanguage] = useState<string>(currentLanguage);
    const [history, setHistory] = useStickyState<string[]>([], STORAGE_KEYS.history);
    const selectedRating = find(ratings, {value: rating}) as RatingOption;
    const historyOptions: Option[] = map(history, h => ({
        value: h,
        label: h,
    }));
    const selectedHistory: Option = find(historyOptions, {value: search}) as Option;
    const selectedLanguage = find(languages, {value: language});

    const handleCreate = (newSearch: string) => {
        if (!includes(history, newSearch)) {
            setHistory([...history, newSearch]);
        }
        setSearch(newSearch);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        return handleSubmit({
            search,
            rating,
            language,
        });
    };

    return (
        <form onSubmit={onSubmit} className={'form'}>
            <span className={'label'}>Free Search</span>
            <CreatableSelect className={'input'}
                             isClearable
                             options={historyOptions}
                             value={selectedHistory}
                             placeholder="Search"
                             onChange={(newValue) => setSearch(newValue !== null ? newValue.value : '')}
                             onCreateOption={handleCreate}/>

            <span className={'label'}>Select Rating</span>
            <Select className={'select'} options={ratings} value={selectedRating}
                    onChange={(e) => setRating((e !== null) ? e.value : 'g')}/>

            <span className={'label'}>Select Language</span>
            <Select className={'select'} options={languages} value={selectedLanguage}
                    onChange={(e) => setLanguage((e !== null) ? e.value : 'en')}/>

            <button type="submit" className={'btn'}>Search</button>
        </form>
    );
}

export default GiForm;
