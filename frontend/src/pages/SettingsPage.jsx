import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../Hooks/useShowToast'
import useLogout from '../Hooks/useLogout';

const SettingsPage = () => {
    const showToast = useShowToast();
    const handleLogOut = useLogout();
    const handleFreeze = async () => {
        if(!window.confirm('Are you sure you want to freeze your account?')) return;
        try {
            const res = await fetch('api/users/freeze',{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            if(data.success){
                await handleLogOut();
                showToast('Success',data.message,'success');
            } else {
                showToast('Error',data.message,'error');
            }
        } catch (error) {
            console.log(error.message);
            showToast('Error',error.message,'error')
        }
    } 
  return (
    <>
    <Text fontWeight={'bold'} my={2}>Freeze Account</Text>
    <Text my={2}>You can simply unfreeze your account by logging in!</Text>
    <Button colorScheme='red' my={1} onClick={handleFreeze}>Freeze</Button>
    </>
  )
}

export default SettingsPage