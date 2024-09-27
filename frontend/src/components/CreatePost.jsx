import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { BsFillImageFill } from 'react-icons/bs'
import useShowImage from '../Hooks/useShowImage'
import useShowToast from '../Hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
import { useParams } from 'react-router-dom'

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { handleImageChange, imgUrl, setImgUrl } = useShowImage();

    const imageRef = useRef(null);

    const [postText, setPostText] = useState('');

    const Max_Chars = 500;

    const [remainingChars, setRemainingChars] = useState(Max_Chars);

    const [loading, setLoading] = useState(false);

    const user = useRecoilValue(userAtom);
    const [posts,setPosts] = useRecoilState(postsAtom);

    const showToast = useShowToast();

    const { username } = useParams();

    const handleTextChange = (e) => {
        let inputText = e.target.value;

        if (inputText.length > Max_Chars) {
            let truncatedText = inputText.slice(0, Max_Chars);
            setPostText(truncatedText);
            setRemainingChars(0);
        } else {
            setPostText(inputText);
            setRemainingChars(Max_Chars - inputText.length)
        }
    }

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postedBy: user._id, text: postText, image: imgUrl }),
            })
            const data = await res.json();
            if (data.success) {
                showToast('Success', data.msg, 'success');
                onClose();
                setPostText('');
                setImgUrl('');
                if(username === user.username) {
                    setPosts([data.post,...posts])
                }
            } else {
                showToast('Error', data.msg, 'error');
                return;
            }
        } catch (error) {
            showToast('Error', error, 'error');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button position={'fixed'} bottom={10} right={10} bg={useColorModeValue('gray.300', 'gray.dark')} onClick={onOpen} size={{base:'sm',md:'md'}}><AddIcon/></Button>



            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Textarea _placeholder={'Post text goes here...'} onChange={handleTextChange} value={postText}></Textarea>
                            <Text fontSize={'xs'} color={'gray.500'} textAlign={'right'}>{remainingChars}/{Max_Chars}</Text>
                            <Input type='file' ref={imageRef} onChange={handleImageChange} hidden />
                            <BsFillImageFill onClick={() => imageRef.current.click()} style={{ marginLeft: '5px', cursor: 'pointer' }} size={16} />

                            {imgUrl && (<Flex position={'relative'} w={'full'} mt={5}>
                                <Image src={imgUrl} alt='Selected Image' />
                                <CloseButton position={'absolute'} top={5} right={5} onClick={() => { setImgUrl('') }} bg={'gray.800'} />
                            </Flex>)
                            }

                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost