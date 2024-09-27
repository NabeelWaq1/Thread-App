import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { IoSendSharp } from'react-icons/io5';
import useShowToast from '../Hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/conversationsAtom';
import { BsFillImageFill } from 'react-icons/bs';
import useShowImage from '../Hooks/useShowImage'

const MessageInput = ({setMessages}) => {
  const [message, setMessage] = useState('');
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { handleImageChange, imgUrl, setImgUrl } = useShowImage();
  const [isSending, setIsSending] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    if(!message && !imgUrl) return showToast('Error','Please enter a message or send a image','error');
    if(isSending) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/message/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, receipentId: selectedConversation.userId, image: imgUrl }),
      })
      const data = await res.json();
      if(!data.success){
        showToast('Error',data.message,'error');
        return;
      }
      setMessage('');
      setImgUrl('')
      setMessages((messages)=>[...messages,data.message])
      setConversations( prevConvers =>{
        const updatedConversations = prevConvers.map((conv)=>{
          if(conv._id === selectedConversation._id){
          return {
            ...conv,
            lastMessage :{
              text : message,
              sender : data.message.sender,
            },
          };
          }
          return conv;
        })
        return updatedConversations;
      })
     
    } catch (error) {
      console.log(error.message);
      showToast('Error',error.message,'error');
    } finally {
      setIsSending(false);
    }
     }


  return (
    <Flex gap={2} alignItems={'center'} p={2} pt={0}>
    <form style={{flex:'95'}} onSubmit={handleSubmit} >
    <InputGroup>
    <Input placeholder='Enter a message..' value={message} onChange={(e)=> setMessage(e.target.value)} w={'full'} />
    <InputRightElement onClick={handleSubmit} cursor={'pointer'}><IoSendSharp cursor={'pointer'}/></InputRightElement>
    </InputGroup>
    </form>
    <Flex flex={5} cursor={'pointer'}>
   <BsFillImageFill size={20} onClick={()=>imageRef.current.click()} />
<input type="file" hidden  ref={imageRef} onChange={handleImageChange}/>
    </Flex>
    <Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSubmit} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
    </Flex>
  )
}

export default MessageInput