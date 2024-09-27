import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'

const UserPost = ({likes, replies, postImg, postText}) => {

    const [liked, setliked] = useState(false)

  return (
    <Link to={'/markzuckerburg/post/1'}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDir={'column'} alignItems={'center'}>
                <Avatar
                name='Mark Zuckerburg'
                src='/zuck-avatar.png'
                size={'md'}
                />
                <Box w={1} h={'full'} bg={'gray.light'} my={2}></Box>
                <Box position={'relative'} w={'full'}>
                    <Avatar
                    size={'xs'}
                    name='John Doe'
                    src=''
                    position={'absolute'}
                    top={'0px'}
                    left={'15px'}
                    padding={'2px'}
                    />
                    <Avatar
                    size={'xs'}
                    name='John Doe'
                    src=''
                    position={'absolute'}
                    bottom={'0px'}
                    right={'-5px'}
                    padding={'2px'}
                    />
                    <Avatar
                    size={'xs'}
                    name='John Doe'
                    src=''
                    position={'absolute'}
                    bottom={'0px'}
                    left={'4px'}
                    padding={'2px'}
                    />
                </Box>
            </Flex>
            <Flex flexDir={'column'} gap={2} flex={1}>
                <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                    <Flex alignItems={'center'} gap={2} w={'full'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>markzuckerburg</Text>
                        <Image src='/verified.png' alt='verify' w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex alignItems={'center'} gap={4}>
                        <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
                        <BsThreeDots />
                    </Flex>
                  
                </Flex>
                <Text fontSize={'sm'}>{postText}</Text>
                {postImg &&
                  <Box border={'1px solid'} borderColor={'gray.light'} borderRadius={6} overflow={'hidden'}>
                  <Image src={postImg} w={'full'} />
               </Box>
               }
                  

                    <Flex justifyContent={'start'} alignItems={'center'} gap={2}>
                        <Actions liked={liked} setLiked={setliked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize='sm'>
					{replies} replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text color={"gray.light"} fontSize='sm'>
					{likes} likes
				</Text>
			</Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost