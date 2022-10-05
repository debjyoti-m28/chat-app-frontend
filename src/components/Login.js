import React from 'react'
import { useState } from 'react'
import { useToast, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);
    
    const submitHandler = async() =>{
         setLoading(true);
        if( !email || !password){
          toast({
          title: 'Please fill all the fields!',
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
        }

        try{
            const config = {
                headers: {
                    "content-type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user/login", {email, password}, config);
            toast({
            title: 'Login Successful',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "bottom",
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        history.push('/chats');

        }catch(err){
           toast({
            title: 'Error Occured!',
            description: err.response.data.message,
            status: 'warning',
            duration: 9000,
            isClosable: true,
            position: "bottom",
        });

        setLoading(false);
        }
    };

  return (
    <VStack spacing='5px'>

        <FormControl id="email" isRequired>
           <FormLabel>Email</FormLabel>
           <Input
            placeholder='Enter Your Email'
            value = {email}
            onChange={(e)=>setEmail(e.target.value)}
           />
        </FormControl>

        <FormControl id="password" isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>
           <Input
           type={show? "text" : "password"}
            placeholder='Enter Your Paaword'
            value = {password}
            onChange={(e)=>setPassword(e.target.value)}
           />
           <InputRightElement>
             <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
             </Button>
           </InputRightElement>
           </InputGroup>
        </FormControl>
        
        <Button
        colorScheme="blue"
        width="100%"
        style={{ margin: 15 }}
        onClick={submitHandler}
        isLoading = {loading}
        >
            Login
        </Button>

        <Button
        colorScheme="red"
        width="100%"
        onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
        }}
        >
            Get Guest User Credentials
        </Button>
    </VStack>
  )
}

export default Login