import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import useShowToast from '../Hooks/useShowToast';

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(false);

    const showToast = useShowToast();

    const [suggestedUsers,setSuggestedUsers] = useState([]);

    useEffect(() => {
       const getSuggestedUsers = async () => {
        if(loading) return;
        setLoading(true);
        try {
            const res = await fetch('/api/users/suggested');
            const data = await res.json();
            if(data.success === false){
                showToast('Error',data.message,'error');
                return;
            }
            
            setSuggestedUsers(data);
        } catch (error) {
            console.log(error.message);
            showToast('Error',error.message,'error')
        } finally {
            setLoading(false);
        }
       }

       getSuggestedUsers();
    }, [showToast])

    

  return (
    <>
    <Text fontWeight={'bold'}>Suggested Users</Text>
    <Flex flexDir={'column'} gap={6} alignItems={'flex-start'} justifyContent={'flex-start'} mt={6}>
        {!loading && suggestedUsers.map((suggesteduser)=>(
            <SuggestedUser key={suggesteduser._id} suggesteduser={suggesteduser}/>
        ) )}
        {
            loading && [0,1,2,3,4].map((_,i) => (
                <Flex  key={i} p={2} rounded={'md'} alignItems={'center'} gap={2}>
                    <Box>
                        <SkeletonCircle size={10} />
                    </Box>
<Box display={'flex'} flexDir={'column'} gap={1}>
<Skeleton h={'8px'} w={'80px'} />
<Skeleton h={'8px'} w={'90px'} />
</Box>
    <Box>
        <Skeleton h={'20px'} w={'60px'} />
    </Box>
                </Flex>
            ))
        }
    </Flex>
    </>
  )
}

export default SuggestedUsers