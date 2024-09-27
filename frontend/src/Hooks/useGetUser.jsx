import React, { useEffect, useState } from 'react'
import useShowToast from './useShowToast';
import { useParams } from 'react-router-dom';

const useGetUser = () => {
    const [user, setUser] = useState(null)

    const showToast = useShowToast();
  
    const { username } = useParams();
  
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const getUser = async () => {
          try {
            const res = await fetch(`/api/users/profile/${username}`);
            const data = await res.json();
            
            if(!data.success){
              showToast('Error',data.message,'error');
              setUser(null);
              return;
            }
            if(data.user.freezed){
              setUser(null);
              return;
            }
            setUser(data.user);
          } catch (error) {
            showToast('Error',error,'error');
            console.log('error in getting User');
          }finally {
             setLoading(false);
          }
        }
   
    
        getUser();
      },[username,showToast])

      return {loading , user};
    
}

export default useGetUser