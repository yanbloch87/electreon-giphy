export const subscribeToMQ = (query: string, handler: (event: MediaQueryListEvent) => void): MediaQueryList => {
    const handleStatusChange = (event: MediaQueryListEvent) => {
        handler(event);
    }

    const isMobileMQ = window.matchMedia(query);
    isMobileMQ.addEventListener('change', handleStatusChange);

    return isMobileMQ;
};
