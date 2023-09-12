// useWebSocket.js
import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const useWebSocket = (callback) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = socketIOClient('http://192.168.1.78:6001'); // Replace with your WebSocket server URL
        setSocket(socket);

        // Clean up the socket connection on unmount
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (socket) {
            // Listen for the 'newPost' event from the server and call the provided callback function
            socket.on('newPost', (post) => {
                callback(post);
            });
        }
    }, [socket, callback]);

    return { socket };
};

export default useWebSocket;
