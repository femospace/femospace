import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_URL } from '../config';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            const newSocket = io(SOCKET_URL, {
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
                newSocket.emit('identify', { userId: user.id || (user as any)._id });
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
