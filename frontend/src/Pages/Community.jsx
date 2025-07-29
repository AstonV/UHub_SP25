import {
    Badge, Box, CheckboxGroup,
    Circle,
    Flex, Grid,
    Heading,
    HStack,
    IconButton, Image,
    Input,
    Separator,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {createNewMeeting, getAllUsers, getChatHistory, uploadFile} from "@/services/chatService.js";
import {Avatar} from "@/components/ui/avatar.jsx";
import socket from "@/services/socket-service.js";
import {Button} from "@/components/ui/button.jsx";
import {FaDownload, FaMessage, FaUpload} from "react-icons/fa6";
import {MdOutlineDelete, MdSend} from "react-icons/md";
import ChatImage from "@/assets/chat-img.png";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent, DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.jsx";
import {FaPlus} from "react-icons/fa";
import {Field} from "@/components/ui/field.jsx";
import {NativeSelectField, NativeSelectRoot} from "@/components/ui/native-select.jsx";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {toaster} from "@/components/ui/toaster.jsx";
import {CiVideoOn} from "react-icons/ci";
import {API_BASE} from "@/config.js";


const Community = () => {

    const [allUsers, setAllUsers] = useState([])
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null

    const [selectedUser, setSelectedUser] = useState(null);

    const [meetingDetails, setMeetingDetails] = useState({
        title: '',
        date: '',
        duration: 15,
    });

    const loadAllUsers = async () => {
        const res = await getAllUsers();
        //remove current user from list
        const index = res.findIndex(user => user._id === userId);
        res.splice(index, 1);
        setAllUsers(res);
    }

    useEffect(() => {
        loadAllUsers();
    }, []);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // message Index and Date Label , whether Today Yesterday or Date
    const [messageIndex, setMessageIndex] = useState([]);

    const loadMessages = async (user2) => {
        const res = await getChatHistory(user2);
        // sort with timestamp
        res.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        //group with same data and crate jsons with dateLabel and start index
        let index = 0;
        let dateLabel = '';
        let messageIndex = [];
        for (let i = 0; i < res.length; i++) {
            const date = new Date(res[i].timestamp);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === today.toDateString()) {
                dateLabel = 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateLabel = 'Yesterday';
            } else {
                dateLabel = date.toDateString();
            }
            if (dateLabel !== messageIndex[index]?.dateLabel) {
                //get Last Date Label
                const lastDateLabel = messageIndex[messageIndex.length - 1]?.dateLabel;
                //if Last Date Label is not same as current date label then add new date label
                if (lastDateLabel !== dateLabel) {
                    messageIndex.push({dateLabel, index});
                }
                index++;
            }
        }
        setMessageIndex(messageIndex);
        setMessages(res);

    }

    const createMeeting = async () => {
        try {
            const res = await createNewMeeting(selectedUser._id, meetingDetails.date, meetingDetails.title);
            toaster.create({message: 'Meeting Created Successfully', type: 'success'});
            setMessages((prevState) => [...prevState, {
                sender: 'system',
                receiver: selectedUser._id,
                system: true,
                meetLink: res.data.meetingLink,
                message: `Meeting created Click to Join on ${new Date(meetingDetails.date).toLocaleDateString()} at ${new Date(meetingDetails.date).toLocaleTimeString()}`,
                timestamp: new Date()
            }]);
        } catch (err) {
            console.error(err);
        }
    }

    const uploadFileToChat = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            const res = await uploadFile(userId, selectedUser._id, file);
            if (res) {
                await loadMessages(selectedUser._id);
            }
        }
        input.click();
    }


    useEffect(() => {

        const updateMessages = (data) => {
            setMessages((prevState) => [...prevState, data]);
        }
        // Register the user ID with the server
        socket.emit('register', userId);

        // Listen for messages
        socket.on('receiveMessage', updateMessages);

        return () => socket.off('receiveMessage');

    }, [messages]);

    const sendMessage = (receiverId, message) => {
        socket.emit('privateMessage', {senderId: userId, receiverId, message});
        setMessage('');
        setMessages((prevState) => [...prevState, {
            sender: userId,
            receiver: receiverId,
            message,
            timestamp: new Date()
        }]);
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        await loadMessages(user._id);
    }

    const getTime = (timestamp) => {
        // Only Hour and Minute in 24 hour format
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    const joinMeeting = (meetLink) => {
        window.open(meetLink, '_blank');
    }

    const downloadFile = (file) => {
        const fileUrl = `${API_BASE}/${file}`;
        window.open(fileUrl, '_blank');
    }


    return (
        <Flex w="full" h="100%" gap={2} align="start" justify="center">
            <VStack w="20%" h="100%" _dark={{bg: 'gray.900'}} p={4}>
                <Heading as="h1" size="xl">
                    Community Users
                </Heading>
                <Separator/>
                <VStack w="full" h="100%" p={2}>
                    {allUsers.map((user, index) => (
                        <Flex key={index} w="full" h="60px" p={2} borderRadius="md" align="center"
                              border="1px" borderColor="gray.700"
                              justify="start" gap={4} position="relative"
                              boxShadow="sm"
                              _hover={{bg: 'gray.200', cursor: 'pointer'}}
                              _dark={{bg: 'gray.800', _hover: {bg: 'gray.700'}}}
                              onClick={() => handleUserSelect(user)}

                        >
                            <Avatar size="lg" name={user.name} src={API_BASE + "/" + user?.profileImage}/>
                            <Flex flexDir="column" align="start" justify="center">
                                <Heading as="h3" size="md">
                                    {user.name}
                                </Heading>
                                <Badge colorPalette="purple">
                                    <Text fontSize="sm">
                                        {user.role[0].toUpperCase() + user.role.slice(1)}
                                    </Text>
                                </Badge>
                            </Flex>
                            {user.status === 'active' ? (
                                <Circle size="10px" bg="green.500" position="absolute" right="10px"/>
                            ) : (
                                <Circle size="10px" bg="red.500" position="absolute" right="10px"/>
                            )}
                        </Flex>
                    ))}
                </VStack>
            </VStack>
            <Flex w="100%" h="100%" flexDir="column" gap={2} align="start" justify="center">
                {selectedUser && (
                    <Flex w="full" h="80px" _dark={{bg: 'gray.900'}} gap={2} p={2} align="center" justify="center" bg="gray.200">
                        <Flex w="full" h="60px" p={2} borderRadius="md" align="center" justify="center" gap={4}>
                            <Avatar size="lg" name={selectedUser.name} src={API_BASE + "/" + selectedUser?.profileImage}/>
                            <Flex flexDir="column" align="start" justify="center">
                                <Heading as="h2" size="md">
                                    {selectedUser.name}
                                </Heading>
                                <Badge colorPalette="purple">
                                    <Text fontSize="sm">
                                        {selectedUser.role[0].toUpperCase() + selectedUser.role.slice(1)}
                                    </Text>
                                </Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                )}
                {selectedUser && (

                    <VStack w="100%" h="100%" _dark={{bg: 'gray.900'}} background={`url(${ChatImage})`} bgSize="cover"
                            p={4} justify="flex-end">
                        {/*Show User Details*/}

                        <Flex
                            flexDir="column"
                            w="full" _dark={{bg: 'gray.900'}} p={4} maxH="calc(100vh - 10px)" overflowY="auto">
                            {messages && messages.map((msg, index) => (
                                <>
                                    {/*Check Whether Date is same as previous message if not show date in center as badge and add Yesterday or Today for today and yesterday, others show date with Day*/}
                                    {messageIndex && messageIndex.map((date, i) => {
                                        if (index === date.index) {
                                            return (
                                                <Badge key={i} _dark={{bg: 'gray.700', color: 'white'}} p={2}
                                                       borderRadius="md"
                                                       textAlign="center" w="fit-content" alignSelf="center" mb={2}>
                                                    {date.dateLabel}
                                                </Badge>
                                            )
                                        }
                                    })}

                                    {msg.system && (
                                        <Flex key={index} w="full" h="60px" p={2}
                                              borderRadius="md" align="center" justify={'center'}
                                              gap={4}
                                        >
                                            <Flex pos={'relative'}
                                                  _dark={{bg: 'orange.800'}}
                                                  bg={'orange.200'}
                                                  cursor={'pointer'}
                                                  p={2}
                                                  borderRadius="md" align="center"
                                                  onClick={() => joinMeeting(msg.meetLink)}
                                                  flexDir={msg.sender === userId ? 'row-reverse' : 'row'} gap={4}>
                                                <Heading as="h2" size="md" pr={'60px'}>
                                                    {msg.message}
                                                </Heading>
                                                <Badge
                                                    position="absolute"
                                                    bottom="3px"
                                                    right="2px"
                                                    size="xs"
                                                    fontSize="xs"
                                                    variant="ghost">
                                                    <Text fontSize={'xs'}>{getTime(msg.timestamp)}</Text>
                                                </Badge>

                                            </Flex>
                                        </Flex>
                                    )}

                                    {!msg.system && (

                                        <Flex key={index} w="full" h="60px" p={2}
                                              borderRadius="md" align="center"
                                              justify={msg.system ? 'center' : msg.sender === userId ? 'end' : 'start'}
                                              gap={2}>
                                            {msg.file && (
                                                //     Dpwload File
                                                <Flex pos={'relative'} _dark={{bg: 'gray.800'}} bg={'gray.200'} p={2} borderRadius="md" align="center" >
                                                    <IconButton
                                                        colorPalette="blue"
                                                        rounded="full"
                                                        size="xs"
                                                        variant="subtle"
                                                        onClick={() => downloadFile(msg.file)}>
                                                        <FaDownload/>
                                                    </IconButton>
                                                </Flex>
                                            )}
                                            <Flex pos={'relative'}
                                                  _dark={{bg: msg.sender === userId ? 'green.800' : msg.sender === 'system' ? 'orange.700' : 'gray.800'}}
                                                  bg={msg.sender === userId ? 'green.200' : msg.sender === 'system' ? 'orange.200' : 'gray.200'}
                                                  p={3}
                                                  borderRadius="md" align="center"
                                                  flexDir={msg.sender === userId ? 'row-reverse' : 'row'} gap={4}>

                                                <Heading as="h2" size="md" pr={'60px'}>
                                                    {msg.message}
                                                </Heading>
                                                {/*    Time On Righr botom*/}
                                                <Badge
                                                    position="absolute"
                                                    bottom="3px"
                                                    right="2px"
                                                    size="xs"
                                                    fontSize="xs"
                                                    variant="ghost">
                                                    <Text fontSize={'xs'}>{getTime(msg.timestamp)}</Text>
                                                </Badge>

                                            </Flex>

                                        </Flex>
                                    )}
                                </>
                            ))}
                        </Flex>
                        <Flex w="full" h="10%"
                              _dark={{bg: 'gray.900'}} gap={2} p={4} align="center" justify="center">
                            <Input
                                bg={'white'}
                                _dark={{bg: 'gray.800'}}
                                h="70px"
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage(selectedUser._id, message);
                                    }
                                }}
                            />

                            {/*Attach File */}
                            <IconButton
                                colorPalette="blue"
                                rounded="full"
                                size="lg"
                                variant="subtle"
                                onClick={() => uploadFileToChat()}>
                                <FaUpload/>
                            </IconButton>

                            <DialogRoot size={'lg'}>
                                <DialogTrigger>
                                    <IconButton
                                        variant="surface"
                                        gap={2}
                                        borderRadius="full"
                                        colorPalette="blue"
                                        boxShadow="md"
                                    >
                                        <CiVideoOn/>
                                    </IconButton>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create A Meeting</DialogTitle>
                                        <DialogCloseTrigger/>
                                    </DialogHeader>
                                    <DialogBody>
                                        <Stack spacing={4}>
                                            <HStack>
                                                <Field label="Meeting Title">
                                                    <Input id="title" type="text" value={meetingDetails.title}
                                                           onChange={(e) => setMeetingDetails({
                                                               ...meetingDetails,
                                                               title: e.target.value
                                                           })}/>
                                                </Field>

                                                <Field label="Meeting Date">
                                                    <Input id="date" type="date" value={meetingDetails.date}
                                                           onChange={(e) => setMeetingDetails({
                                                               ...meetingDetails,
                                                               date: e.target.value
                                                           })}/>
                                                </Field>
                                            </HStack>
                                        </Stack>
                                    </DialogBody>
                                    <DialogFooter>
                                        <DialogActionTrigger>
                                            <Button variant="surface" colorPalette="blue"
                                                    onClick={() => createMeeting()}>
                                                Create Meeting<
                                    /Button>
                                        </DialogActionTrigger>
                                    </DialogFooter>
                                </DialogContent>
                            </DialogRoot>


                            <IconButton
                                colorPalette="green"
                                rounded="full"
                                size="lg"
                                variant="subtle"
                                onClick={() => sendMessage(selectedUser._id, message)}>
                                <MdSend/>
                            </IconButton>
                        </Flex>
                    </VStack>
                )}
                {!selectedUser && (
                    <VStack w="100%" h="100%" _dark={{bg: 'gray.900'}} p={4} justify="center" align="center">
                        <Heading as="h1" size="xl">
                            Select a User to Start Chat
                        </Heading>
                    </VStack>
                )}
            </Flex>

        </Flex>
    )
}

export default Community