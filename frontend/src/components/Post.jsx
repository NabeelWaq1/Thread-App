import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import useShowToast from '../Hooks/useShowToast'
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'

const Post = ({ post, postedBy }) => {

    const [user, setUser] = useState(null);

    const currUser = useRecoilValue(userAtom);

    const showToast = useShowToast();

    const navigate = useNavigate();

    const [posts,setPost] = useRecoilState(postsAtom);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
                if (!data.success) {
                   showToast('Error', data.message, 'error');
                    return;
                } 
                    setUser(data.user);
            } catch (error) {
                showToast('Error', error, 'error');
                console.log(error);
            }
        }

        getUser();
    }, [showToast, postedBy])


    if (!user) return null;

    const handleDelete = async (e) => {
e.preventDefault();
if(!window.confirm('Do you really want to delete this post?')) return;
try {
    const res = await fetch(`/api/post/${post._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json();
    if (!data.success) {
        showToast('Error', data.msg, 'error');
        return;
    }
    showToast('Success', 'Post deleted successfully','success');
    setPost(posts.filter((p) => p._id !== post._id));
} catch (error) {
    console.log(error);
    showToast('Error',error,'error');
}
    }

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDir={'column'} alignItems={'center'}>
                    <Avatar
                        name={user.name}
                        src={user.profilePic}
                        size={'md'}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
                        }}
                    />
                    <Box w={1} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        {post.replies.length === 0 && <Text textAlign={'center'} fontSize={'xl'}>😒</Text>}
                        {
                            post.replies[0] && <Avatar
                                size={'xs'}
                                name='John Doe'
                                src={post.replies[0].userProfilePic}
                                position={'absolute'}
                                top={'0px'}
                                left={'15px'}
                                padding={'2px'}
                            />
                        }
                        {
                            post.replies[1] &&
                            <Avatar
                                size={'xs'}
                                name='John Doe'
                                src={post.replies[1].userProfilePic}
                                position={'absolute'}
                                bottom={'0px'}
                                right={'-5px'}
                                padding={'2px'}
                            />
                        }
                        {
                            post.replies[2] &&
                            <Avatar
                                size={'xs'}
                                name='John Doe'
                                src={post.replies[2].userProfilePic}
                                position={'absolute'}
                                bottom={'0px'}
                                left={'4px'}
                                padding={'2px'}
                            />
                        }
                    </Box>
                </Flex>
                <Flex flexDir={'column'} gap={2} flex={1}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                        <Flex alignItems={'center'} gap={2} w={'full'}>
                            <Text fontSize={'sm'} fontWeight={'bold'} onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}>{user.username}</Text>
                            <Image src='/verified.png' alt='verify' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex alignItems={'center'} gap={4}>
                            <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
                            {/* <BsThreeDots /> */}
                            {currUser?._id === user._id ? <DeleteIcon onClick={handleDelete} size={24} /> : null}
                        </Flex>

                    </Flex>
                    <Text fontSize={'sm'}>{post.text}</Text>
                    {post.image &&
                        <Box border={'1px solid'} borderColor={'gray.light'} borderRadius={6} overflow={'hidden'}>
                            <Image src={post.image} w={'full'} />
                        </Box>
                    }


                    <Flex justifyContent={'start'} alignItems={'center'} gap={2}>
                        <Actions post={post}/>
                    </Flex>

                   
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post