import React from 'react';
import { useFetchData1, useFetchData2 } from './api'; // Update the path to the actual location of the `api.js` file

const MyComponent = () => {
    const apiUrl1 = 'http://api.example.com/data1';
    const apiUrl2 = 'http://api.example.com/data2';

    const { data: data1, isLoading: isLoading1, error: error1 } = useFetchData1(apiUrl1);
    const { data: data2, isLoading: isLoading2, error: error2 } = useFetchData2(apiUrl2);

    if (isLoading1 || isLoading2) {
        return <div>Loading...</div>;
    }

    if (error1 || error2) {
        return <div>Error: {error1?.message || error2?.message}</div>;
    }

    // Use the fetched data from data1 and data2 here
    return (
        <div>
            {/* Display data from data1 */}
            {/* Display data from data2 */}
        </div>
    );
};

export default MyComponent;





