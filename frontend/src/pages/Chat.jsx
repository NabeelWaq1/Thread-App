import { Search2Icon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Consversations from '../components/Consversations'
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../Hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/conversationsAtom';
import { GiConversation } from 'react-icons/gi';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../Context/socketContext';


const Chat = () => {
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

  const [searchInput, setSearchInput] = useState('')
  const [loadingUser, setLoadingUser] = useState(false);
  const currUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on('messagesSeen', ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              }
            }
          }
          return conversation;
        })
        return updatedConversations;
      })
    })
  }, [socket, setConversations])

  useEffect(() => {
    const getConversations = async () => {
      setLoadingConversations(true);
      try {
        const res = await fetch('api/message/conversations');
        const data = await res.json();
        if (!data.success) {
          showToast('Error', data.message, 'error');
          return;
        }
        setConversations(data.conversations);
      } catch (error) {
        console.log(error);
        showToast('Error', error.message, 'error')
      } finally {
        setLoadingConversations(false);
      }
    }

    getConversations();

  }, [showToast, setConversations])

  const handleSearchConversation = async (e) => {
    e.preventDefault();
    setLoadingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchInput}`);
      const data = await res.json();
      if (!data.success) {
        showToast('Error', data.message, 'error');
        return;
      }

      const messagingYourself = data.user?._id === currUser?._id
      if (messagingYourself) {
        showToast('Error', 'You cannot add yourself as a conversation partner', 'error');
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]?._id === data.user?._id
      );


      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists?._id,
          userId: data.user?._id,
          username: data.user.username,
          profilePic: data.user.profilePic,
        });
        return;
      }


      if (!conversationAlreadyExists) {
        const mockConversation = {
          mock: true,
          lastMessage: {
            text: "",
            sender: "",
          },
          _id: Date.now(),
          participants: [
            {
              _id: data.user?._id,
              username: data.user.username,
              profilePic: data.user.profilePic,
            },
          ],
        };
        setConversations((prevConvs) => [...prevConvs, mockConversation]);


      }
    } catch (error) {
      console.log(error.message);
      showToast('Error', error.message, 'error');
    } finally {
      setLoadingUser(false);
    }


  }



  return (

    <Box position={'absolute'} p={4} left={'50%'} transform={'translateX(-50%)'} w={{ 'base': '100%', 'md': '80%', 'lg': '750px' }}>
      <Flex gap={4} flexDir={{ 'base': 'column', 'md': 'row' }} maxW={{ 'sm': '400px', 'md': 'full' }} mx={'auto'}>
        <Flex flex={30} flexDir={'column'} gap={3}>
          <Text fontWeight={700} color={useColorModeValue('gray.800', 'gray.400')}>Your Conversations</Text>
          <form onSubmit={handleSearchConversation}>
            <Flex gap={2} alignItems={'center'}>
              <Input placeholder='Search for a user..' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              <Button size={'md'} onClick={handleSearchConversation} isLoading={loadingUser}><Search2Icon /></Button>
            </Flex>
          </form>
          {
            loadingConversations && [0, 1, 2, 3, 4].map((_, i) => (
              <Flex key={i} gap={2} alignItems={'center'} p={1} borderRadius={'md'}>
                <Box><SkeletonCircle size={10} /></Box>
                <Flex flexDir={'column'} gap={2} w={'full'}>
                  <Skeleton w={'80px'} h={'10px'} />
                  <Skeleton w={'90%'} h={'8px'} />
                </Flex>
              </Flex>
            ))
          }
          {
            !loadingConversations && conversations.map((conversation, i) => (
              <Consversations key={conversation?._id} conversation={conversation} isOnline={onlineUsers.includes(conversation.participants[0]?._id)} />
            ))
          }

        </Flex>
        {!selectedConversation?._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation?._id && <MessageContainer />}


      </Flex>
    </Box>

  )
}

export default Chat