import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { selectedConversationAtom } from '../atoms/conversationsAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';

const Message = ({ ownMessage, message }) => {
  const [selectedConversation,setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
    {
        ownMessage ? 
        (
         <Flex alignItems={'center'} alignSelf={'flex-end'} gap={2} p={1}>
             {message.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
         
							<Text color={"white"}>{message.text}</Text>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.500" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
            
						</Flex>
              )}
            {message.image && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.image}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.image && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.image} alt='Message image' borderRadius={4} />
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}
           
            <Avatar src={user.userProfilePic} name={user.name} w={8} h={8} />
         </Flex>  
        ) 
        : (
            <Flex alignItems={'center'} alignSelf={'flex-start'} gap={2} p={1}>
                 <Avatar src={selectedConversation.profilePic} name={selectedConversation.username} w={8} h={8} />
				 
                 {message.text && (
            <Text maxW={'350px'} bg={'gray.400'} color={'black'} borderRadius={'md'} p={2} fontSize={'sm'}>
                {message.text}
            </Text>
          )}
            {message.image && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.image}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.image && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.image} alt='Message image' borderRadius={4} />
						</Flex>
					)}
         </Flex>  
        )
    }
    </>
  )
}

export default Message