import React, {FormEvent} from 'react';
import Select from 'react-select';
import {Option, Rating, RatingOption} from '../../shared/types';
import {find, includes, map} from "lodash";
import {useStickyState} from "../../shared/hooks";
import {STORAGE_KEYS} from "../../shared/config";
import CreatableSelect from "react-select/creatable";
import {languages, ratings} from "./form.config";

import './form.css';

interface FormFormProps {
    handleSubmit: (e: FormEvent) => Promise<void>;
    search: string;
    searchChange: (search: string) => void;
    rating: Rating | null;
    ratingChange: (rating: Rating) => void;
    language: string;
    languageChange: (language: string) => void;
}

function GiForm({
                    handleSubmit,
                    search,
                    searchChange,
                    rating,
                    ratingChange,
                    language,
                    languageChange
                }: FormFormProps): JSX.Element {
    const [history, setHistory] = useStickyState<string[]>([], STORAGE_KEYS.history);
    const selectedRating = find(ratings, {value: rating}) as RatingOption;
    const historyOptions: Option[] = map(history, h => ({
        value: h,
        label: h,
    }));
    const selectedHistory = find(historyOptions, {value: search});
    const selectedLanguage = find(languages, {value: language});

    const handleCreate = (newSearch: string) => {
        if (!includes(history, newSearch)) {
            setHistory([...history, newSearch]);
        }
        searchChange(newSearch);
    };

    return (
        <form onSubmit={handleSubmit} className={'form'}>
            <span className={'label'}>Free Search</span>
            <CreatableSelect className={'input'}
                             isClearable
                             options={historyOptions}
                             value={selectedHistory}
                             placeholder="Search"
                             onChange={(newValue) => searchChange(newValue !== null ? newValue.value : '')}
                             onCreateOption={handleCreate}/>

            <span className={'label'}>Select Rating</span>
            <Select className={'select'} options={ratings} value={selectedRating}
                    onChange={(e) => ratingChange((e !== null) ? e.value : 'g')}/>

            <span className={'label'}>Select Language</span>
            <Select className={'select'} options={languages} value={selectedLanguage}
                    onChange={(e) => languageChange((e !== null) ? e.value : 'en')}/>

            <button type="submit" className={'btn'}>Search</button>
        </form>
    );
}

export default GiForm;
