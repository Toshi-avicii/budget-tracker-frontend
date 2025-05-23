import { io, Socket } from 'socket.io-client'

let socket: ReturnType<typeof io>;

export const getSocket = (token: string, username: any): Socket => {
    if (!socket) {
        socket = io('https://budget-tracker-backend-z91v.onrender.com', {
            auth: {
                token // passing token for authentication
            },
            withCredentials: true,
            autoConnect: false,
            reconnection: false,
            // retries: 3,
            reconnectionAttempts: 3,
            
        });
    }
   return socket;
};