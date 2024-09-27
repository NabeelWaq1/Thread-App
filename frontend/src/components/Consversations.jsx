import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import userAtom from '../atoms/userAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { BsCheck2All, BsFillImageFill } from'react-icons/bs'
import { selectedConversationAtom } from '../atoms/conversationsAtom'


const Consversations = ({conversation, isOnline}) => {
    const user = conversation.participants[0];
    const currUser = useRecoilValue(userAtom);
     const lastMessage = conversation.lastMessage;
     const [selectedConversation , setSelectedConversation] = useRecoilState(selectedConversationAtom);
     

if(!user) return null;

    return (
        <Flex
            alignItems={'center'}
            gap={4}
            p={1}
            _hover={
                {
                    bg: useColorModeValue('gray.600', 'gray.dark'),
                    color: 'white',
                    cursor: 'pointer'
                }
            }
            borderRadius={'md'}
            onClick={()=>setSelectedConversation({
                _id : conversation._id,
                userId: user._id,
                username:user.username,
                profilePic:user.profilePic,
                mock:conversation.mock,
            })}
            bg={selectedConversation._id === conversation._id? (useColorMode === 'light' ? 'gray.400' : 'gray.dark') : ''}
            color={selectedConversation._id === conversation._id? (useColorMode === 'light' ? 'white' : 'white') : ''}
        >
            <WrapItem>
                <Avatar size={{
                    base: 'xs',
                    sm: 'sm',
                    md: 'md',
                }}
                    src={user.profilePic}
                >
                {isOnline ? <AvatarBadge boxSize={'1em'} bg='green.500' /> : <AvatarBadge boxSize={'1em'} bg='gray.500' />}
                </Avatar>
            </WrapItem>
            <Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight='700' display={"flex"} alignItems={"center"}>
					{user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
					{currUser._id === lastMessage.sender ? (
						
							<BsCheck2All color={lastMessage.seen ? "#2c739e" : ""} size={16} />
				
					) : (
						""
					)}
					{lastMessage.text.length > 18
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
				</Text>
			</Stack>

        </Flex>
    )
}

export default Consversations