import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom'
import useFollowUnfollow from '../Hooks/useFollowUnfollow.jsx'

const SuggestedUser = ({suggesteduser}) => {
	const {handleFollowUnfollow,following, isUpdating} = useFollowUnfollow(suggesteduser);

  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"} minW={'80%'}>
			{/* left side */}
			<Flex gap={2} as={Link} to={`${suggesteduser.username}`}>
				<Avatar src={suggesteduser.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{suggesteduser.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{suggesteduser.name}
					</Text>
				</Box>
			</Flex>
			{/* right side */}
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnfollow}
				isLoading={isUpdating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
  )
}

export default SuggestedUser