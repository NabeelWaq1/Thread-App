import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Actions from '../components/Actions'
import Comments from '../components/Comments'
import useGetUser from '../Hooks/useGetUser'
import useShowToast from '../Hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'

const PostPage = () => {
  const { user, loading } = useGetUser();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currUser = useRecoilValue(userAtom);
  const navigate = useNavigate();



  useEffect(() => {
    const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/post/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

  const currPost = posts[0];

  const handleDelete = async () => {
    try {
      if (!window.confirm('Do you really want to delete this post?')) return;
      const res = await fetch(`/api/post/${currPost._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (!data.success) {
        showToast('Error', data.msg, 'error');
        return;
      }
      showToast('Success', 'Post deleted successfully', 'success');
      navigate(`/${user.username}`);
    } catch (error) {
      console.log(error);
      showToast('Error', error, 'error');
    }
  }



  if (loading) return <Flex justifyContent={'center'} alignItems={'center'}><Spinner size={'xl'} /></Flex>;
  if (!user) return <h1>No User Found!</h1>; // Handle user not found
  if (!currPost) return null;




  return (
    <>
  <Flex>
				<Flex w={"full"} alignItems={"center"} gap={3}>
					<Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
					<Flex>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Image src='/verified.png' w='4' h={4} ml={4} />
					</Flex>
				</Flex>
				<Flex gap={4} alignItems={"center"}>
					<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
						{formatDistanceToNow(new Date(currPost.createdAt))} ago
					</Text>

					{currUser?._id === user._id && (
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDelete} />
					)}
				</Flex>
			</Flex>

			<Text my={3}>{currPost.text}</Text>

			{currPost.image && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currPost.image} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currPost} />
			</Flex>

			<Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>

      <Divider my={4} bg={'gray.light'} color={'gray.light'} />

{currPost.replies && Array.isArray(currPost.replies) ? (
  currPost.replies.map((reply) => {
    return (
      <Comments
      key={reply._id ? reply._id : reply.text + Math.random()} // Fallback if _id is missing
        reply={reply}
        lastReply={reply._id === currPost.replies[currPost.replies.length - 1]._id}
      />
    );
  })
) : (
  <Text>No replies available.</Text>
)}



    </>
  )
}

export default PostPage