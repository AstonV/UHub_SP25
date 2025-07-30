import {Badge, Fieldset, Flex, Heading, Icon, Image, Separator, Stack, Text, VStack} from "@chakra-ui/react";
import Logo from "../assets/navLogo.png";
import {Avatar} from "@/components/ui/avatar.jsx";
import {Button} from "@/components/ui/button.jsx";
import {MdCheckCircle, MdLogout} from "react-icons/md";
import api from "@/services/api.js";
import {useNavigate} from "react-router-dom";
import {Toaster, toaster} from "@/components/ui/toaster.jsx";
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
import React, {useEffect} from "react";
import UserProfile from "@/Pages/UserProfile.jsx";
import SideBarComponent from "@/components/SideBarComponent.jsx";
import {API_BASE, APP_NAME} from "@/config.js";
import {getNotifications, getUserData} from "@/services/profileService.js";
import {logout} from "@/services/authenticationService.js";
import {ColorModeButton} from "@/components/ui/color-mode.jsx";
import {PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger} from "@/components/ui/popover.jsx";
import {IoMdNotifications} from "react-icons/io";


const MainLayout = ({children}) => {

    const [userDetails, setUserDetails] = React.useState()
    const [notifications, setNotifications] = React.useState([])

    const loadUser = async () => {
        const res = await getUserData()
        setUserDetails(res)
        localStorage.setItem('user', JSON.stringify(res))
    }

    const loadNotifications = async () => {
        const res = await getNotifications()
        if(res){
            setNotifications(res)
        }
    }

    useEffect(
        () => {
            loadUser()
            loadNotifications()
            setInterval(() => {
                loadNotifications()
            }, 10000)
        }
        , [])

    const navigate = useNavigate();
    const logoutApplication = async () => {
        const res = await logout();
        if (res) {
            navigate('/login');
        } else {
            toaster.error({
                title: 'Error',
                description: 'Failed to logout',
                status: 'error',
            });
        }
    }
    const sampleProfile = "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg";


    return (
        <Flex direction="column" align="center" justify="flex-start" minH="100vh" w="full">
            <Toaster/>
            <Flex direction="row" align="center" justify="space-between" w="full">
                <Image src={Logo} alt="Skill Link Logo" w="50px" h="60px"/>
                <Heading as="h1" size="4xl" textAlign="center">
                    {APP_NAME}
                </Heading>
                <Flex>

                    <DialogRoot size={"lg"}>
                        <DialogTrigger>
                            <Avatar size="lg" name="UHub Admin"
                                    src={userDetails?.profileImage ? `${API_BASE}/${userDetails?.profileImage}` : sampleProfile}
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle as="h1" textAlign="center">
                                    Profile</DialogTitle>
                                <DialogCloseTrigger/>
                            </DialogHeader>
                            <DialogBody>
                                <UserProfile/>
                            </DialogBody>
                        </DialogContent>
                    </DialogRoot>

                    {/*Dark Mode Toggle*/}
                    <Flex align="center" justify="center" mx={2}>
                        <ColorModeButton/>
                    </Flex>
                    <Flex align="center" justify="center" mx={2}>
                        <PopoverRoot>
                            <PopoverTrigger asChild>
                                <Icon fontSize="28px">
                                    <IoMdNotifications/>
                                </Icon>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow/>
                                <PopoverBody>
                                    <Fieldset.Root>
                                        <VStack spacing={4}>
                                            <Heading as="h2" size="md">Notifications</Heading>
                                            {notifications && notifications.map((item, index) => (
                                                <Flex key={index} direction="row" align="center" justify="space-between"
                                                      w="full" p={2}>
                                                    <Text>{item.message}</Text>
                                                    <Badge colorScheme="green">New</Badge>
                                                </Flex>
                                            ))}
                                            {notifications && notifications.length === 0 && (
                                                <Text>No new notifications</Text>
                                            )}
                                        </VStack>
                                    </Fieldset.Root>
                                </PopoverBody>
                            </PopoverContent>
                        </PopoverRoot>
                    </Flex>


                    <Button
                        variant="subtle"
                        colorPalette="green"
                        ml={4}
                        onClick={() => logoutApplication()}
                    >
                        <MdLogout/>
                        Logout
                    </Button>
                </Flex>
            </Flex>
            <Separator size="lg" mx={2}/>

            <Flex direction="row" align="flex-start" justify="flex-start" w="full" h="calc(100vh - 60px)">
                <SideBarComponent/>
                <Separator size="lg" orientation="vertical" mx={2}/>
                <Flex direction="column" align="center" justify="flex-start" w="full" h="calc(100vh - 62px)"
                      maxH="calc(100vh - 62px)" overflowY="auto" p={1}>
                    {children}
                </Flex>
            </Flex>

        </Flex>
    );
};

export default MainLayout;