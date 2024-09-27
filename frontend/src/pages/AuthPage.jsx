import React from 'react'
import SignupCard from '../components/SignUp'
import Login from '../components/Login'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'



const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);
  return (
    <>
    {authScreenState === 'login' ? <Login /> : <SignupCard />}
    </>
  )
}

export default AuthPage