import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useLogout = () => {
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

    return handleLogOut;
}

export default useLogout