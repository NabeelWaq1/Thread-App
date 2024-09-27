import { Flex, Image, useColorMode, Link, Button } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { AiFillHome, AiOutlineSetting } from 'react-icons/ai'
import { RxAvatar } from 'react-icons/rx'
import { Link as RouterLink } from 'react-router-dom'
import useLogout from '../Hooks/useLogout'
import { FiLogOut } from 'react-icons/fi'
import authScreenAtom from '../atoms/authAtom'
import { ChatIcon } from '@chakra-ui/icons'
import { BsChatLeftDotsFill, BsChatSquareDotsFill } from 'react-icons/bs'


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const user = useRecoilValue(userAtom);
  const handleLogOut = useLogout();
  const setAuthScreenLogin = useSetRecoilState(authScreenAtom);
  return (
    <Flex justifyContent={ 'space-between' } mt={6} mb={12}>
      {
        user && (
          <Link as={RouterLink} to={`/`}>
            <AiFillHome size={24} />
          </Link>
        )
      }
      {
        !user && (
          <Link as={RouterLink} to={`/auth`} onClick={()=> setAuthScreenLogin('login')}>

            Login
          </Link>
        )
      }
      <Image
        alt='logo'
        src={colorMode === 'light' ? '/dark-logo.svg' : '/light-logo.svg'}
        onClick={toggleColorMode}
        w={6}
        cursor={'pointer'}
      />

      {
        user && (
          <Flex justifyContent={'center'} alignItems={'center'} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
          <RxAvatar size={24} />
        </Link>
        <Link as={RouterLink} to={`/chat`}>
        <BsChatSquareDotsFill size={20}/>
        </Link>
        <Link as={RouterLink} to={`/settings`}>
        <AiOutlineSetting size={20}/>
        </Link>
        <Button onClick={handleLogOut} size={'sm'}><FiLogOut size={20}/></Button>
        </Flex>
        )
      }
      {
        !user && (
          <Link as={RouterLink} to={`/auth`} onClick={()=> setAuthScreenLogin('Signin')}>
            Signin
          </Link>
        )
      }
    </Flex>
  )
}

export default Header