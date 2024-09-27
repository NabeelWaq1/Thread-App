import Conversation from '../Model/conversation.model.js';
import Message from '../Model/message.model.js';
import { getReceipantSocketId, io } from '../Socket/socket.js';
import {v2 as cloudinary} from 'cloudinary';

export const sendMessage = async (req,res) => {
    try {
        const {message, receipentId} = req.body;
        let {image} = req.body;
        const userId = req.user.id;

        let consversation = await Conversation.findOne({
            participants : { $all: [userId, receipentId] }
        })

        if(!consversation){
            consversation = new Conversation({
                participants : [userId, receipentId],
                lastMessage: {
                    sender : userId,
                    text : message
                }
            })
            await consversation.save();
        }

        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url; 
        }

        const newMessage = new Message({
            conversationId : consversation._id,
            sender : userId,
            text : message,
            image: image || '',
        })

        await Promise.all([
         newMessage.save(),
         consversation.updateOne({
            lastMessage:{
                sender : userId,
                text : message
            }
         })
        ])

        const ReceipantSocketId = getReceipantSocketId(receipentId)
        if(ReceipantSocketId){
            io.to(ReceipantSocketId).emit('newMessage', newMessage)
        }

        res.json({success: true, msg: 'Message sent successfully', message: newMessage})


    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, msg: 'Server Error'})
    }
}


export const getMessage = async (req,res) => {
    const { otherUserId } = req.params;
    const userId = req.user.id;
    try {
        const conversation = await Conversation.findOne({
            participants:{$all : [userId, otherUserId]}
        })

        if(!conversation) {
            return res.status(404).json({success: false, msg: 'No conversation found'})
        }

        const messages = await Message.find({conversationId : conversation._id}).sort({ createdAt : 1})

        res.json({success: true, msg: 'Messages fetched successfully', messages})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, msg: 'Server Error'})
    }
}

export const getConversations = async (req,res) => {
    const userId = req.user.id;
    try {
        const conversations = await Conversation.find({participants: userId})
       .populate({
            path: 'participants',
            select: 'username profilePic'
        });
        conversations.forEach((con)=>{
            con.participants = con.participants.filter((participant)=>participant._id.toString() != userId.toString());
        })
        return res.json({success: true, msg: 'Conversations fetched successfully', conversations})
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, msg: 'Server Error'})
    }
}