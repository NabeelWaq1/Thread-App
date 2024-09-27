import React, { useState } from 'react'
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const useFollowUnfollow = (user) => {
    const currUser = useRecoilValue(userAtom);
const [isUpdating,setIsUpdating] = useState(false);
const [following, setFollowing] = useState(user.followers.includes(currUser?._id));
const showToast = useShowToast();


    const handleFollowUnfollow = async () => {
        if (!currUser) return showToast('Error', 'You are not logged in', 'error');
        if(isUpdating) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json();

            if (!data.success) {
                showToast('Error', data.message, 'error');
                return;
            } else {
                setFollowing(!following);
                showToast('Success', data.message, 'success');
            }

            if (following) {
                showToast('Suucess', `Unfollowed ${user.username}`, 'success');
                user.followers.pop();
            } else {
                showToast('Suucess', `Followed ${user.username}`, 'success');
                user.followers.push(currUser?._id);
            }

        } catch (error) {
            showToast('Error', error, 'error');
            console.log(error);
            return;
        } finally {
            setIsUpdating(false);
        }
    }

    return {handleFollowUnfollow, following, isUpdating}
}

export default useFollowUnfollow