import {Flex, Heading, Icon, VStack} from "@chakra-ui/react";
import {useLocation, useNavigate} from "react-router-dom";
import {AiFillDashboard, AiFillProfile, AiOutlineCalendar} from "react-icons/ai";
import {FaProjectDiagram, FaTasks} from "react-icons/fa";
import {FaUsers} from "react-icons/fa6";
import {HiChatBubbleLeft} from "react-icons/hi2";
import {LuFolderOpen, LuLayoutDashboard, LuNetwork, LuUser, LuUsersRound} from "react-icons/lu";
import {toaster} from "@/components/ui/toaster.jsx";
import {useEffect} from "react";


const SideBarComponent = () => {

    const navigate = useNavigate();
    const location = useLocation()
    const path = location.pathname.split('/')[1];

    const userRole = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role : 'user';

    const sidebarItems = [
        {
            name: 'Dashboard',
            icon: LuLayoutDashboard,
            path: '/dashboard',
            keyWords: ['dashboard', 'home','admin-dashboard'],
            allowedRoles: ['user']
        },
        {
            name: 'Admin Panel',
            icon: LuLayoutDashboard,
            path: '/admin-dashboard',
            keyWords: ['dashboard', 'home','admin-dashboard'],
            allowedRoles: ['admin']
        },
        {
            name: 'Projects',
            icon: LuFolderOpen,
            path: '/projects',
            keyWords: ['projects', 'tasks'],
            allowedRoles: ['user']
        },
        {
            name: 'Community',
            icon: LuNetwork,
            path: '/community',
            keyWords: ['community', 'network'],
            allowedRoles: ['user', 'admin']
        },
        {
            name: 'Calendar',
            icon: AiOutlineCalendar,
            path: '/calender',
            keyWords: ['calender', 'schedule'],
            allowedRoles: ['user']
        },
        {
            name: 'Users',
            icon: LuUsersRound,
            path: '/users',
            keyWords: ['users', 'user'],
            allowedRoles: ['admin']
        },
        {
            name: 'Profile',
            icon: LuUser,
            path: '/profile',
            keyWords: ['profile'],
            allowedRoles: ['user', 'admin']
        }
    ]

    // Restrict to login for users with unauthorized roles
    useEffect(() => {
        if (!localStorage.getItem('user') || !(sidebarItems.filter(item => item.path.includes(path)).map(item => item.allowedRoles).flat().includes(userRole))) {
            toaster.error({
                title: 'Unauthorized',
                description: 'You are not authorized to access this page',
                status: 'error'
            })
            console.log("Path is " + path)
            console.log("Role is allowed + " + userRole)
            console.log(sidebarItems.filter(item => item.path.includes(path)).map(item => item.allowedRoles))
            console.log(sidebarItems.filter(item => item.path.includes(path)).map(item => item.allowedRoles).includes(userRole))
            console.log(sidebarItems.filter(item => item.path.includes(path)).map(item => item.allowedRoles).flat().includes(userRole))



            navigate('/login')
            // window.location.href = '/login'
        }else{
            console.log("Path is " + path)
            console.log("Role is allowed + " + userRole)
            console.log(sidebarItems.filter(item => item.path.includes(path)).map(item => item.allowedRoles))
            console.log(sidebarItems.filter(item => item.path.includes(path)).map(item => item.allowedRoles).includes(userRole))
        }
    },[userRole])

    return (
        <Flex direction="column"
              w="20%"
              minW="180px"
              maxW="150px"
              h="100%"
              p={4}
        >
            <VStack spacing={4} align="start" justify="center">
                {sidebarItems.map((item, index) => (
                    item.allowedRoles.includes(userRole) &&
                    <Flex key={index} align="center" justify="start" gap={4} w="100%" h={'60px'} p={2} borderRadius="md"
                          onClick={() => navigate(`${item.path}`)}
                          cursor="pointer"
                          bg={item.keyWords.includes(location.pathname.split('/')[1])
                              ? 'blue.500' : 'transparent'}
                          color={item.keyWords.includes(location.pathname.split('/')[1]) ? 'white' : 'black'}
                          _hover={{bg: item.keyWords.includes(location.pathname.split('/')[1]) ? 'blue.500' : 'blue.500', color: 'white'}}
                          _dark={{
                              bg: item.keyWords.includes(location.pathname.split('/')[1]) ? 'gray.800' : 'transparent',
                              _hover: {bg: 'gray.800'},
                                color:item.keyWords.includes(location.pathname.split('/')[1]) ? 'white' : 'gray.100'
                          }}
                    >
                        <Icon fontSize="2xl">
                            <item.icon/>
                        </Icon>
                        <Heading as="h1" size="md" onClick={() => navigate(`/${item.name.toLowerCase()}`)}>
                            {item.name}
                        </Heading>
                    </Flex>
                ))}
            </VStack>
        </Flex>
    );
}

export default SideBarComponent;