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
import {useEffect, useRef, useState} from "react";
import {
    createNewMeeting,
    getAllUsers,
    getChatHistory,
    getProjectChatHistory,
    uploadFile, uploadProjectFile
} from "@/services/chatService.js";
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
import {getCollaborateProjects} from "@/services/projectService.js";
import {useLocation} from "react-router-dom";


const ProjectChat = () => {

    const [allProjects, setAllProjects] = useState([])
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null
    const location = useLocation()
    const {project} = location.state
    const fileInputRef = useRef(null);

    const [meetingDetails, setMeetingDetails] = useState({
        title: '',
        date: '',
        duration: 15,
    });


    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // message Index and Date Label , whether Today Yesterday or Date
    const [messageIndex, setMessageIndex] = useState([]);

    const loadMessages = async (user2) => {
        const res = await getProjectChatHistory(user2);
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
            const res = await createNewMeeting(userId, meetingDetails.date, meetingDetails.title);
            toaster.create({message: 'Meeting Created Successfully', type: 'success'});
            setMessages((prevState) => [...prevState, {
                sender: 'system',
                receiver: userId,
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
        fileInputRef.current.click();
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const res = await uploadProjectFile(userId,project._id, file);
        if (res) {
            await loadMessages(project._id);
        }
    };

    useEffect(() => {
        loadMessages(project._id);
    }, [])


    useEffect(() => {

        const updateMessages = (data) => {
            setMessages((prevState) => [...prevState, data]);
        }
        // Register the user ID with the server
        socket.emit('register', userId);

        // Listen for messages
        socket.on('receiveProjectMessage', updateMessages);

        return () => socket.off('receiveProjectMessage');

    }, [messages]);

    const sendMessage = (projectId, message) => {
        socket.emit('projectMessage', {senderId: userId, projectId, message});
        setMessage('');
        // setMessages((prevState) => [...prevState, {
        //     sender: userId,
        //     receiver: projectId,
        //     message,
        //     timestamp: new Date()
        // }]);
    };


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
            <Flex w="100%" h="100%" flexDir="column" gap={2} align="start" justify="center">
                {(

                    <VStack w="100%" h="100%" _dark={{bg: 'gray.900'}} background={`url(${ChatImage})`} bgSize="cover"
                            p={2} justify="flex-end">
                        {/*Show User Details*/}
                        <Flex w="full" h="10%" _dark={{bg: 'gray.800'}} gap={2} p={4} align="center" justify="center">
                            <Heading as="h1" size="lg" textAlign="center">
                                {project.name} - Discussion
                            </Heading>
                        </Flex>

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
                                                  flexDir={msg.sender._id === userId ? 'row-reverse' : 'row'} gap={4}>
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
                                              mt={messages[index - 1]?.sender._id === msg.sender._id ? '2' : '35px'}

                                              borderRadius="md" align="center"
                                              justify={msg.system ? 'center' : msg.sender._id === userId ? 'end' : 'start'}
                                              gap={2}>
                                            {msg.file && (
                                                //     Dpwload File
                                                <Flex pos={'relative'} _dark={{bg: 'gray.800'}} bg={'gray.200'} p={2}
                                                      borderRadius="md" align="center">
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
                                                  _dark={{bg: msg.sender._id === userId ? 'green.800' : msg.sender._id === 'system' ? 'orange.700' : 'gray.800'}}
                                                  bg={msg.sender._id === userId ? 'green.200' : msg.sender._id === 'system' ? 'orange.200' : 'gray.200'}
                                                  p={3}
                                                  borderRadius="md" align="center"
                                                  flexDir={msg.sender._id === userId ? 'row-reverse' : 'row'} gap={4}>
                                                <Text
                                                    display={msg.sender._id === userId || messages[index - 1]?.sender._id === msg.sender._id ? 'none' : 'block'}
                                                    pos={'absolute'}
                                                    top={'-20px'}
                                                    left={'10px'}
                                                    fontSize={'xs'}>{msg.sender.name}</Text>
                                                <Flex align="center" gap={2}>

                                                    <Avatar size="md" name={msg.sender.name}
                                                            src={msg.sender.profileImage}/>

                                                    <Heading as="h2" size="md" pr={'60px'}>
                                                        {msg.message}
                                                    </Heading>
                                                </Flex>
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
                                        sendMessage(project._id, message);
                                    }
                                }}
                            />

                            <IconButton
                                colorPalette="blue"
                                rounded="full"
                                size="lg"
                                variant="subtle"
                                onClick={() => uploadFileToChat()}>
                                <FaUpload/>
                            </IconButton>
                            <Flex display={'none'}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    multiple // Remove this if you want single file selection
                                />
                            </Flex>
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
                                onClick={() => sendMessage(project._id, message)}>
                                <MdSend/>
                            </IconButton>
                        </Flex>
                    </VStack>
                )}
            </Flex>

        </Flex>
    )
}

export default ProjectChat