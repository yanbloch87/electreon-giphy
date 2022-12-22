import React, {DependencyList, Dispatch, EffectCallback, SetStateAction, useEffect, useRef} from 'react';

// useState with localStorage support
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

// useEffect that ignores the first change
export function useDidUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
    const didMountRef = useRef(false);
    // in development mode the component is rendered twice.
    const isDevSkip = useRef(process.env.NODE_ENV !== 'development');

    useEffect(() => {
        if (didMountRef.current) {
            if (isDevSkip.current) {
                return effect();
            }
            isDevSkip.current = true;
        }
        didMountRef.current = true;
    }, deps);
}
