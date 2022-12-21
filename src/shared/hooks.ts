import React, {DependencyList, Dispatch, EffectCallback, SetStateAction, useEffect, useRef} from 'react';

export function useStickyState<T>(defaultValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = React.useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        try {
            return stickyValue !== null
                ? JSON.parse(stickyValue)
                : defaultValue;
        } catch (err) {
            window.localStorage.removeItem(key);
            return defaultValue;
        }
    });
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

export function useDidUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current) {
            return effect();
        }
        didMountRef.current = true;
    }, deps);
}
