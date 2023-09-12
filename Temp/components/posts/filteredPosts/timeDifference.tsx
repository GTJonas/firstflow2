import React from 'react';
import {differenceInSeconds, formatDistanceToNow} from 'date-fns';
import FetchPosts from "../../../api/FetchPosts.tsx";


// this is great to keep track of time since of its creation. However its bad for keeping track of dates.

const TimeDifference = ( { createdAt } ) => {
    const secondsDifference = differenceInSeconds(new Date(), new Date(createdAt));
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(monthsDifference / 12);

    if (yearsDifference > 0) return `${yearsDifference} år sedan`;
    if (monthsDifference > 0) return `${monthsDifference} månader sedan`;
    if (weeksDifference > 0) return `${weeksDifference} veckor sedan`;
    if (daysDifference > 0) return `${daysDifference} dagar sedan`;
    if (hoursDifference > 0) return `${hoursDifference} timmar sedan`;
    if (minutesDifference > 0) return `${minutesDifference} minuter sedan`;

    // Special handling for 1 second, 1 minute, and 1 hour
    if (secondsDifference === 1) return '1 sekund sedan';
    if (minutesDifference === 1) return '1 minut sedan';
    if (hoursDifference === 1) return '1 timme sedan';
    if (weeksDifference === 1) return '1 vecka sedan';
    if (monthsDifference === 1) return '1 månad sedan';
    if (yearsDifference === 1) return '1 år sedan';

    return `${secondsDifference} sekunder sedan`;

    return <p className="htime">{TimeDifference}</p>;
};

export default TimeDifference;
