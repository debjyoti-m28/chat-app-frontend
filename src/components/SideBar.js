import {React, useState} from 'react'
import { Spinner, useToast,Input, Box, Tooltip, Button, Text, Menu ,MenuButton, Avatar, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../context/ChatProvider';
import Profile from './Profile';
import { useHistory } from "react-router-dom"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import axios from "axios"
import ChatLoading from './ChatLoading';
import UserListItem from './userAvatar/UserListItem';
import { getSender } from '../config/ChatLogics';

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

const { user, setSelectedChat, chats, setChats,  notification, setNotification } = ChatState();
const history = useHistory();
const { isOpen, onOpen, onClose } = useDisclosure()
const toast = useToast();
// const btnRef = React.useRef()

const logoutHandler = () =>{
  localStorage.removeItem("userInfo");
  history.push("/");
}

const handleSearch = async() =>{
  if(!search){
    toast({
          title: 'Please Enter something in search!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
  }

  try{
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(`/api/user?search=${search}`, config)
    setLoading(false);
    setSearchResult(data);
  }catch(err){
        toast({
          title: 'Error Occured!',
          description: "Failed to Load thr Search Results...",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
  }
};

const accessChat = async(userId) =>{
      try{
        setLoadingChat(true);

        const config = {
          headers: {
            "Content-type": "application/json",
           Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post('/api/chat', {userId}, config);

        if(!chats.find((c)=>c._id ==data._id)) setChats([data, ...chats]);
        setLoadingChat(false);
        setSelectedChat(data);
        onClose();
      }catch(err){
          toast({
          title: 'Error in fetching the chat!',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
  }

  return (
    <>
     <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
     >
       <Tooltip label="Search Users to Chat" 
       hasArrow 
       placement='bottom-end'
       >
        <Button varient="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text
            display={{base: "none", md: "flex"}} 
            px="4"
            >
                Search User
            </Text>
        </Button>
       </Tooltip>

       <Text fontSize="2xl" fontFamily="Work sans">
        Talk-A-Tive
       </Text>
       <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "Now new messages"}
            {notification.map((notif)=> (
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n)=> n!==notif));
              }}>
                {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}` }
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
            <MenuButton 
            as={Button} 
            rightIcon={<ChevronDownIcon/>}
            >
             <Avatar 
             size='sm' 
             cursor='pointer' 
             name={user.name}
             src={user.pic}
             />
            </MenuButton>

            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              
              <MenuDivider/>

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
       </div>
     </Box>

     {/* side bar */}

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
          <Box display="flex" pb={2}>
            <Input
            placeholder="Search by name or email"
            mr={2}
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
            />
            <Button 
            onClick={handleSearch}
            >Go</Button>
          </Box>
          {loading? (
               <ChatLoading/>
          ):(
            searchResult?.map(user=> (
              <UserListItem 
              user = {user}
              key={user._id} 
              handleFunction={()=>accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner ml="auto" display="flex"/>}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar;