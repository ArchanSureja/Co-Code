import React, { createContext, useReducer, useContext } from 'react';
import { roomReducer, initialRoomState } from './roomReducer';


const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [roomState,dispatch] = useReducer(roomReducer, initialRoomState);
    return (
        <RoomContext.Provider value={{ roomState,dispatch }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    return useContext(RoomContext);
};
