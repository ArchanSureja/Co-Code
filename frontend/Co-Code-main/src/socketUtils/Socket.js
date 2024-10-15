import io from 'socket.io-client';

let socket = null;

export const getSocket = () => {
 
  return new Promise((resolve, reject) => {
    if (!socket) {
      socket = io('http://localhost:2000'); 

      console.log('Socket initialized, waiting for connection...');
      socket.on('connect', () => {
        console.log("Socket connected successfully:", socket);  
        resolve(socket);  
      });

      
      socket.on('connect_error', (error) => {
        console.error("Connection error:", error);
        reject(error);  
      });

    
      socket.on('disconnect', (reason) => {
        console.log("Socket disconnected:", reason);
      });
    } else {
      resolve(socket);
    }
  });
};