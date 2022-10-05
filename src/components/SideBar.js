import React from 'react'
import { Box, Tooltip, Button, Text, Menu ,MenuButton } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

const SideBar = () => {
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingChat, setLoadingChat] = useState();

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
        <Button varient="ghost">
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
            <BellIcon/>
          </MenuButton>
        </Menu>
       </div>
     </Box>
    </>
  )
}

export default SideBar;