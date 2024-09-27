

import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowImage from '../Hooks/useShowImage';
import useShowToast from '../Hooks/useShowToast';


export default function UserProfileEdit() {
    const [user, setUser] = useRecoilState(userAtom);

    const showToast = useShowToast();

    const fileRef = useRef(null);


    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: '',
    })

    const [isUpdating,setIsUpdating] = useState(false);

    const { handleImageChange, imgUrl } = useShowImage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isUpdating) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
            })
            const data = await res.json();

            if(data.success){
                showToast('Success',data.message,'success');
                setUser(data.user);

                localStorage.setItem('user-threads',JSON.stringify(data.user));
                
               
                setInputs({
                    name: data.user.name,
                    username: data.user.username,
                    email: data.user.email,
                    password: '',
                    bio: data.user.bio,
                });
            }else{
                showToast('Error',data.message,'error');
                return;
            }
        } catch (error) {
            showToast('Error', error, 'error');
            console.log(error);
            
        } finally {
            setIsUpdating(false);
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <Flex
                align={'center'}
                justify={'center'}
            >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    my={12}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" src={imgUrl || user.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button
                                    w="full"
                                    bg={useColorModeValue('gray.600', 'gray.700')}
                                    color={'white'}
                                    _hover={{
                                        bg: useColorModeValue('gray.800', 'gray.900'),
                                    }}
                                    onClick={() => fileRef.current.click()}
                                >Change Avatar</Button>
                                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl >
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="Nabeel Waqas"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder="nabeelwaq"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="your bio..."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={useColorModeValue('red.600', 'red.700')}
                            color={'white'}
                            _hover={{
                                bg: useColorModeValue('red.800', 'red.900'),
                            }}
                            w={'full'}>
                            Cancel
                        </Button>
                        <Button
                            w="full"
                            bg={useColorModeValue('gray.600', 'gray.700')}
                            color={'white'}
                            _hover={{
                                bg: useColorModeValue('gray.800', 'gray.900'),
                            }}
                            type='submit'
                            isLoading={isUpdating}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}