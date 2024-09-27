import { Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../Hooks/useShowToast'
import { FiLogOut } from'react-icons/fi'

const logoutButton = () => {

    const showToast = useShowToast();

    const setUserAtom = useSetRecoilState(userAtom);

    const handleLogOut = async () => {
try {
    const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    if (data.success) {
        setUserAtom(null)
        localStorage.removeItem('user-threads')
        showToast('Log Out',data.message,'success');
    } else {
        showToast('Error',data.message,'error');
        return;
    }
} catch (error) {
    showToast('Error',error,'error');
}
    }
  return (
    <>
    <Button position={'fixed'} top={'30px'} right={'40px'} size={'md'} onClick={handleLogOut}><FiLogOut size={25}/></Button>
    </>
  )
}

export default logoutButton