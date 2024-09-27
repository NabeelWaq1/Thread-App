import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageInput from './MessageInput'
import useShowToast from '../Hooks/useShowToast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/conversationsAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../Context/socketContext'
import notify from '../assets/sound/naruto.mp3'

const MessageContainer = () => {
  const showToast = useShowToast();
  const [messages, setMessages] = useState([]);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [messagesLoading, setMessagesLoading] = useState(true)
  const currUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef();


  const {socket} = useSocket();
  

  useEffect(()=>{
    const getMessages = async () => {
      setMessagesLoading(true);
      setMessages([])
      try {
        if(selectedConversation.mock) return;
        const res = await fetch(`api/message/${selectedConversation.userId}`);
        const data = await res.json();
        if(!data.success){
          showToast('Error',data.msg,'error');
          return;
        }
        setMessages(data.messages);
      } catch (error) {
        console.log(error);
        showToast('Error',error.message,'error');
      }finally{
        setMessagesLoading(false);
      }
    }

    getMessages();
  },[showToast,selectedConversation.userId,selectedConversation.mock])

  useEffect(()=>{
    const lastMessageFromOtherUser = messages.length && messages[messages.length - 1].sender !== currUser._id;
    if(lastMessageFromOtherUser){
      socket.emit('markMessageAsSeen',{
        conversationId: selectedConversation._id,
        userId: currUser._id,
      })
    }

    socket.on('messagesSeen',({conversationId})=>{
      if(selectedConversation._id === conversationId){
        setMessages((prev)=>{
          const updatedMessages = prev.map((msg)=>{
            if(!msg.seen){
              return{
                ...msg,
                seen:true,
              }
            }
            return msg;
          })
          return updatedMessages;
        })
      }
    })
    
  },[socket,currUser._id,messages,selectedConversation])

  useEffect(()=>{

    socket.on('newMessage',(message)=>{
      if(selectedConversation._id === message.conversationId){
        setMessages((prev) => [...prev,message]);
      }

      if(!document.hasFocus()){
        const sound = new Audio(notify);
      sound.play();
      }

      setConversations((prevCon) => {
        const updatedConversations = prevCon.map((con)=>{
          if(con._id === message.conversationId){
            return{
              ...con,
              lastMessage:{
                text:message.text,
                sender:message.sender,
              },
            };
          }
          return con;
        })
        return updatedConversations;
      })

    })

    return () => socket.off('newMessage')

  },[socket,selectedConversation,setConversations])

  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({ behavior:'smooth' });
  },[messages])
  

  return (
    <Flex flexDir={'column'} flex={70} bg={useColorModeValue('gray.300','gray.dark')} borderRadius={'md'}> 
    
    {/* Message Header */}
    <Flex gap={2} alignItems={'center'} w={'full'} h={12} p={2}>
        <Avatar src={selectedConversation.profilePic} size={'sm'} />
        <Text display={'flex'} alignItems={'center'}>
            {selectedConversation.username} <Image src='/verified.png' w={3} h={3} ml={1} />
        </Text>
    </Flex>

    <Divider />

    {/* Message Body */}
    <Flex flexDir={'column'} overflowY={'auto'} my={4} height={'400px'} gap={4} p={2}>
        {
            messagesLoading && [...Array(5)].map((_,i)=>(
                <Flex alignItems={'center'} alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'} gap={4} key={i} p={1}>
                  {i  % 2 === 0 && <SkeletonCircle  size={10} />} 

                   <Flex flexDir={'column'} gap={2}>
                   <Skeleton  h={1} w={'250px'} />
                   <Skeleton  h={1} w={'250px'} />
                   <Skeleton  h={1} w={'250px'} />
                   </Flex>

                   {i % 2!== 0 && <SkeletonCircle  size={10} />}
                </Flex>
            ))
        }

        {(!messagesLoading && messages) && messages.map((message,i)=>(
          <Flex flexDir={'column'}  gap={2} key={i} p={1} ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}>
          <Message key={i} ownMessage={message.sender === currUser._id} message={message} />
          </Flex>
        ))}
    </Flex>

    <MessageInput setMessages={setMessages} />

    </Flex>
  )
}

export default MessageContainer