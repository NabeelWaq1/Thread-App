import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom'
import useShowToast from '../Hooks/useShowToast'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUser from '../Hooks/useGetUser'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'


const UserPage = () => {

  const { user, loading } = useGetUser();

  const showToast = useShowToast();

  const { username } = useParams();

  const [fetchingPosts, setFetchingPosts] = useState(true)

  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/post/user/${username}`);
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        } else {
          showToast('Error', data.message, 'error');
        }
      } catch (error) {
        console.log(error);
        showToast('Error', error, 'error');
      } finally {
        setFetchingPosts(false);
      }
    }

    getPosts();
  }, [username, showToast, setPosts, user])


  if (!user && loading) return <Flex justifyContent={'center'} alignItems={'center'}><Spinner size={'xl'} mt={20} /></Flex>;
  if (!user && !loading) return <Flex justifyContent={'center'} alignItems={'center'}><Text fontSize={'xl'} fontWeight={'bold'} mt={20}>User Not Found !</Text></Flex>;




  return (
    <>
      <UserHeader user={user} />
      {
        !fetchingPosts && posts.length === 0 ? <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '40px', fontWeight: 'bold' }}>No Posts Found</h1> : null  // show message if no posts found in the end of the list
      }
      {
        fetchingPosts ? <Flex justifyContent={'center'} alignItems={'center'}><Spinner size={'xl'} mt={20} /></Flex> : posts.map((post, index) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      }

    </>
  )
}

export default UserPage