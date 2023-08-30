import http from 'http';
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const ioServer = new Server(server);

// Event listener for incoming connections
ioServer.on('connection', (socket) => {
    console.log('New client connected');

    // Event listener for new posts (replace this with your event name)
    socket.on('new-post', (data) => {
        console.log('New post received:', data);
        // Broadcast the new post to all connected clients (including sender)
        ioServer.emit('new-post', data);
    });

    // Event listener for client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = 6001; // Choose any available port number
server.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
});
