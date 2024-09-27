import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../Hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	const [loading , setLoading] = useState(true);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();

	useEffect(()=>{
		const getFeedPosts = async () => {
			setPosts([]);
			setLoading(true);
			try {
				const res = await fetch('/api/post/feed');
				const data = await res.json();
				if(data.success){
					setPosts(data.posts);
				}else{
					showToast('Error',data.msg,'error');
				}
			} catch (error) {
				showToast('Error',error,'error');
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
		getFeedPosts();
	},[showToast,setPosts]);


	
return(
	<Flex gap={10} alignItems={{'base':'center','md':'flex-start'}} flexDir={{'base':'column-reverse','md':'row'}}>
	<Box flex={70}>
		{
				(posts.length === 0 && !loading) && (
					 <h1 style={{textAlign:'center',marginTop:'100px',fontWeight:'bold',fontSize:'20px'}}>No posts found. Follow some users to see posts!</h1>
				)
		}
		{
			loading && (
			 <Flex justifyContent={'center'} alignItems={'center'} mt={20}><Spinner size={'xl'} /></Flex>
			)
		}
            {posts.map((post, index) => (
                <Post key={index} post={post} postedBy={post.postedBy} />
            ))}
	</Box>
	<Box flex={30} flexDir={'column'}>
		<SuggestedUsers />
	</Box>
	</Flex>
)
	
	

};

export default HomePage;
