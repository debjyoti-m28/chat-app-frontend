import React from 'react'
import { Box } from '@chakra-ui/react'
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import SideBar from '../components/SideBar';
import { ChatState } from '../context/ChatProvider'

const Chatpage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar/> }
      <Box
      display="flex"
      justifyContent='space-between'
      w='100%'
      h='91.5vh'
      p='10px'
      >
      {user && <MyChats/>}
      {user && <ChatBox/>}
      </Box>
    </div>
  )
}

export default Chatpage;