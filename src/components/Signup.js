import React from 'react'
import { useState } from "react"
import { useToast, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);
    
    const postDetails = (dp) =>{
       setLoading(true);
       if(dp==undefined){
          toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        return;
       }

       if(dp.type==="image/jpeg" || dp.type==="image/png"){
         const data = new FormData();
         data.append("file", dp);
         data.append("upload_preset", "chat-app");
         data.append("cloud_name", "dkzcebxsw");
         fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
            method: 'post',
            body: data,
         }).then((res)=>res.json())
         .then(data=>{
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
         })
         .catch((err)=>{
            console.log(err);
            setLoading(false);
         });

       }else{
         toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
       }
    }
    const submitHandler = async() =>{
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
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

        if(password !== confirmPassword){
         toast({
          title: 'Password do not match!',
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
        return;
        }

        try{
            const config = {
                headers: {
                    "content-type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user", {name,email, password, pic}, config);
            toast({
            title: 'Registration Successful',
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "bottom",
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        history.pushState('/chats');

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
    }

  return (
    <VStack spacing='5px'>
        <FormControl id="name" isRequired>
           <FormLabel>Name</FormLabel>
           <Input
            placeholder='Enter Your Name'
            onChange={(e)=>setName(e.target.value)}
           />
        </FormControl>

        <FormControl id="email" isRequired>
           <FormLabel>Email</FormLabel>
           <Input
            placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}
           />
        </FormControl>

        <FormControl id="password" isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>
           <Input
           type={show? "text" : "password"}
            placeholder='Enter Your Paaword'
            onChange={(e)=>setPassword(e.target.value)}
           />
           <InputRightElement>
             <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
             </Button>
           </InputRightElement>
           </InputGroup>
        </FormControl>

        <FormControl id="confirm-password" isRequired>
           <FormLabel>Confirm Password</FormLabel>
           <InputGroup>
           <Input
           type={show? "text" : "password"}
            placeholder='Confirm Password'
            onChange={(e)=>setConfirmPassword(e.target.value)}
           />
           <InputRightElement>
             <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
             </Button>
           </InputRightElement>
           </InputGroup>
        </FormControl>

        <FormControl id="pic">
           <FormLabel>Upload Your Profile Picture</FormLabel>
           <Input
           type="file"
           p={1.5}
           accept="image/*"
           onChange={(e)=>postDetails(e.target.files[0])}
           />
        </FormControl>
        
        <Button
        colorScheme="blue"
        width="100%"
        style={{ margin: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup