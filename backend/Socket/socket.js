import { Server } from 'socket.io';
import http from 'http';
import Message from '../Model/message.model.js'
import Conversation from '../Model/conversation.model.js'

import express from 'express';

const app = express();

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: 'http://localhost:3000', methods : ['GET','POST']}  });

export const getReceipantSocketId = (receipantId) => {
    return userSocketMap[receipantId];
}

const userSocketMap = {};
io.on('connection',(socket) => {
    console.log('user connected',socket.id);
    const userId = socket.handshake.query.userId;
    
    if(userId !== 'undefined') userSocketMap[userId] = socket.id;
    io.emit('getOnlineUsers' , Object.keys(userSocketMap));

    socket.on('markMessageAsSeen', async ({conversationId,userId})=>{
        try {
            await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}})
            await Conversation.updateOne({_id:conversationId},{$set:{'lastMessage.seen':true}})
            io.to(userSocketMap[userId]).emit('messagesSeen',{conversationId});
        } catch (error) {
            console.log(error.message);
        }
    })


    socket.on('disconnect',()=>{
        delete userSocketMap[userId];
        io.emit('getOnlineUsers' , Object.keys(userSocketMap));
    })
})

export { io, server, app };