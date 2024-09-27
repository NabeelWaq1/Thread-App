import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useColorMode, useToast, VStack } from '@chakra-ui/react'
import { BsInstagram } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as LinkRouter } from 'react-router-dom'
import useShowToast from '../Hooks/useShowToast';
import useFollowUnfollow from '../Hooks/useFollowUnfollow';

const UserHeader = ({ user }) => {

    const currUser = useRecoilValue(userAtom);

   const { handleFollowUnfollow, following, isUpdating } = useFollowUnfollow(user);

    const { colorMode } = useColorMode();

    const toast = useToast()

    const copyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({ description: 'URL Copied To Clipboard' })
        })
    }
    if(!user) return null;

    

    return (
        <VStack gap={4} alignItems={'start'}>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>{user.name}</Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'}>{user.username}</Text>
                        <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} px={2} borderRadius={'full'}>threads.net</Text>
                    </Flex>
                </Box>
                <Box>
                    {
                        user.profilePic ? <Avatar name={user.name} src={user.profilePic} size={{ base: 'md', md: 'xl' }} /> : <Avatar name='Profile Pitchure' size={{ base: 'md', md: 'xl' }} />
                    }
                </Box>
            </Flex>

            <Text>{user.bio ? user.bio : 'No Bio'}</Text>

            {
                currUser?._id === user._id && (
                    <Link as={LinkRouter} to={'/update'}>
                        <Button size={'sm'}>Update Profile</Button>
                    </Link>
                )
            }
            {
                currUser?._id !== user._id && (
                    <Button size={'sm'} isLoading={isUpdating} onClick={handleFollowUnfollow}>
                        {
                            following ? 'Unfollow' : 'Follow'
                        }
                    </Button>
                )
            }



            <Flex justifyContent={'space-between'} w={'full'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>{user.followers.length}K followers</Text>
                    <Box w={1} h={1} borderRadius={'full'} bg={'gray.light'}></Box>
                    <Link color={'gray.light'}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram fontSize={24} cursor={'pointer'} />
                    </Box>
                    <Menu>
                        <MenuButton>
                            <Box className='icon-container'>
                                <CgMoreO fontSize={24} cursor={'pointer'} />
                            </Box>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={'gray.dark'}>
                                <MenuItem onClick={copyUrl} bg={'gray.dark'}>Copy Link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Flex>

            </Flex>

            <Flex w={'full'} justifyContent={'center'}>
                <Flex flex={1} justifyContent={'center'} pb={3} borderBottom={'1.5px solid'} borderColor={colorMode} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>
                        Threads
                    </Text>
                </Flex>
                <Flex flex={1} justifyContent={'center'} pb={3} borderBottom={'1px solid gray'} color={'gray.light'} cursor={'pointer'}>
                    <Text fontWeight={'bold'}>
                        Replies
                    </Text>
                </Flex>
            </Flex>

        </VStack>
    )
}

export default UserHeader