import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { io } from 'socket.io-client';


const socketContext = createContext();

export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketContextProvider = ({children}) => {

       const [socket, setSocket] = useState(null);
       const user = useRecoilValue(userAtom);
       const [onlineUsers, setOnlineUsers] = useState([])

         
       useEffect(()=>{
        const socket = io("http://localhost:5000",{
            query:{
                userId: user?._id
            },
           });

           setSocket(socket);

           socket.on('getOnlineUsers',(users) => {
setOnlineUsers(users)
           })

           return () => socket && socket.close();
    
       },[user?._id])

console.log('onlineUsers',onlineUsers);


return <socketContext.Provider value={{socket, onlineUsers}}>{children}</socketContext.Provider>
}