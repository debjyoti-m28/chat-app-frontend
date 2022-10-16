import {React, useEffect, useState} from 'react'
import { ChatState } from '../context/ChatProvider';
import { useToast } from "@chakra-ui/react"
import axios from 'axios';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  
  const toast = useToast();

  const fetchChats = async()=>{
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);

    }catch(err){
       toast({
          title: 'Failed to load the Chats!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])
  
  return (
    <div>MyChats</div>
  )
}

export default MyChats