import { useState, useEffect } from 'react';

export const useDebouncedSearch = (searchTerm: string, delay = 500) => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchTerm, delay]);

    return debouncedSearchTerm;
};
