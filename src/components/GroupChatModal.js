import {React, useState} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box
} from '@chakra-ui/react'
import { ChatState } from '../context/ChatProvider';
import axios from 'axios'
import UserListItem from "./userAvatar/UserListItem"
import UserBadgeItem from './userAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setgroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const toast = useToast();
    
    const { user, chats, setChats } = ChatState();

    const handleSearch= async(query) =>{
        setSearch(query);
        if(!query) return;

        try{
           setLoading(true);

           const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
           };

           const { data } = await axios.get(`api/user?search=${search}`, config);
           setLoading(false);
           setSearchResult(data);
        //    console.log(data);
        }catch(err){
           toast({
          title: 'Failed to load thr Search Results!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        }
    }

    const handleSubmit= async() =>{
       if(!groupChatName || !selectedUsers){
         toast({
          title: 'Please fill all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top",
        });
       }

       try{
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const {data} = await axios.post('/api/chat/group', {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u)=> u._id)),
        }, config);

        setChats([data, ...chats]);
        onClose();
        toast({
          title: 'New Group Chat Created',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
       }catch(err){
         toast({
          title: 'Failed to create the chat!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
       }
    }

    const handleGroup = (userToAdd) =>{
       if(selectedUsers.includes(userToAdd)){
        toast({
          title: 'User already added',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
       }

       setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (userToBeDelete) =>{
      setSelectedUsers(selectedUsers.filter((sel)=> sel._id != userToBeDelete._id))
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          > Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          >
             <FormControl>
                <Input
                 placeholder="Chat name" 
                 mb={3}
                 onChange={(e)=> setgroupChatName(e.target.value)}
                 />
                 
             </FormControl>
             <FormControl>
                <Input
                 placeholder="Add  users eg: John, Deb" 
                 mb={1}
                 onChange={(e)=> handleSearch(e.target.value)}
                 />
                 
             </FormControl>
             {selectedUsers.map(u=>(
               <Box
               w="100%"
               display="flex"
               flexWrap="wrap"
               >
                <UserBadgeItem
                key={user._id}
                user={u}
                handleFunction={()=> handleDelete(u)}
                />
              </Box>
             ))}
             {loading? <div>Loading...</div>
             :
             searchResult?.slice(0,4).map(user=>(
                <UserListItem 
                key={user._id} 
                user={user}
                handleFunction={()=>handleGroup(user)}
                />
             ))
             }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal