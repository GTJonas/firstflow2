import React, { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [filteredPosts, setFilteredPosts] = useState([]);

    // You can add more state variables and functions related to posts here

    return (
        <PostContext.Provider value={{ filteredPosts, setFilteredPosts }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    return useContext(PostContext);
};
