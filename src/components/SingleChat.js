import {React, useState, useEffect} from 'react'
import { ChatState } from '../context/ChatProvider'
import {Box, Text, IconButton, Spinner, FormControl, Input, useToast} from '@chakra-ui/react'
import {ArrowBackIcon} from "@chakra-ui/icons"
import { getSender, getSenderFull } from '../config/ChatLogics'
import Profile from './Profile'
import UpdateGroupChatModal from './UpgradeGroupChatModal'
import axios from "axios"
import './style.css'
import ScrollableChat from './ScrollableChat'

 
// socket. io connection
import io from "socket.io-client"
const ENDPOINT = "http://localhost:5001/"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [newMessage, setNewMessage] = useState();
   const [socketConnected, setSocketConnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [isTyping, setIsTyping] = useState(false);
    

   const  {user, selectedChat, setSelectedChat,  notification, setNotification } = ChatState();
   const toast = useToast()
   
   const fetchMessages = async() =>{
       if(!selectedChat) return;

       try{
          const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            setLoading(true);
            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
            console.log(data);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
       }catch(err){
           toast({
          title: 'Failed to Load the Message!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
       }
   }
  

     // Socket.io connection
  useEffect(() => {
     socket = io(ENDPOINT);
     socket.emit("setup", user);
     socket.on('connected', ()=> setSocketConnected(true));
     socket.on('typing', ()=>setIsTyping(true));
     socket.on('stop typing', ()=>setIsTyping(false));
   }, []);
   
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  
  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        //give notification
         if(!notification.includes(newMessageRecieved)){
           setNotification([newMessageRecieved, ...notification]);
           setFetchAgain(!fetchAgain);
         }
      }
      else{
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  

   const sendMessage = async(event) =>{
      if(event.key === "Enter" && newMessage){
        socket.emit('stop typing', selectedChat._id);
        try{
            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            setNewMessage("");
            const {data} = await axios.post('/api/message',{
                content: newMessage,
                chatId: selectedChat._id,
            }, config);
            // console.log(data);

            socket.emit('new message', data);
            setMessages([...messages, data]);
        }catch(err){
           toast({
          title: 'Failed to Send the Message!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        }
      }
   };
   
   
   const typingHandler = (e) =>{
      setNewMessage(e.target.value);
      //Typing indicator logic
      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit('typing', selectedChat._id);
      }

      let lastTypingTime = new Date().getTime()
      var timerLength = 3000;
      setTimeout(()=>{
         var timeNow = new Date().getTime();
         var timeDiff = timeNow - lastTypingTime;

         if(timeDiff >= timerLength && typing){
           socket.emit('stop typing', selectedChat._id);
           setTyping(false);
         }
      }, timerLength);
   }

  return (
    <>
    {selectedChat? (
        <>
         <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
         >
           <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat? (
                <>
                {getSender(user, selectedChat.users)}
                <Profile user={getSenderFull(user, selectedChat.users)}/>
                </>
            ):(
                <>
                  {selectedChat.chatName.toUpperCase() }
                  <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                </>
            )}
         </Text>
         
         <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
         >
          {loading?(
            <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
            />
          ):(
            <div className="messages">
                <ScrollableChat messages={messages}/>
            </div>
          )}

          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping? (
              <div style={{color: "green"}}>Typing...</div>
            ):(
              <></>
            )}
             <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
             />
          </FormControl>
         </Box>
        </>
    ):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
    )
    }
    </>
  )
}

export default SingleChat