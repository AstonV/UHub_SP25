import React, {useEffect, useState} from "react";
import {
    Badge,
    Box,
    CheckboxGroup,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Image,
    Input,
    Stack,
    Text,
    Textarea, VStack
} from "@chakra-ui/react";
import {Button} from "../components/ui/button.jsx";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog"
import {useNavigate} from "react-router-dom";
import {
    NativeSelectField,
    NativeSelectRoot,
} from "@/components/ui/native-select"
import { createListCollection } from "@chakra-ui/react"
import {MdCalendarMonth, MdCalendarViewDay, MdCheckCircle, MdOutlineDelete} from "react-icons/md";
import { Toaster, toaster } from "../components/ui/toaster"
import {addNewSkill, addUser, deleteUser, getUsers} from "@/services/AdminService.js";
import {FaPlus} from "react-icons/fa";
import {FaUpload} from "react-icons/fa6";
import {Field} from "@/components/ui/field.jsx";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {API_BASE} from "@/config.js";
import {Avatar} from "@/components/ui/avatar.jsx";
const items = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
]

const User = () => {

    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const [newSkill, setNewSkill] = useState({
        name: '',
        description: '',
    })

    const sampleProfile = "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg";


    const navigate =
        useNavigate()


    useEffect(() => {
        const loadUsers = async () => {
            const users= await getUsers()
            setUsers(users)
            /*
            *     {
        "_id": "676866e80c5c19132c0532fa",
        "name": "User2",
        "email": "user2@mail.com",
        "password": "$2a$10$T/Bm4xj8vXjkE.yqMu6FwOoqwmHkGPTGrmyqbCveF2VkWnZcUUQKa",
        "refreshToken": null,
        "skills": [],
        "interests": [],
        "role": "user",
        "status": "inactive",
        "createdAt": "2024-12-22T19:22:16.415Z",
        "updatedAt": "2024-12-22T19:22:16.415Z",
        "__v": 0
    },
            * */
        }
        loadUsers()
    },[]);





    const handleAddUser =async () => {
        const res = await addUser(newUser)
        if (res) {
            toaster.success({
                title: "User Added",
                description: "User has been added successfully",
            })
            setUsers([...users, res])
        }else {
            toaster.error({
                title: "Failed to Add User",
                description: "User could not be added",
            })
        }
    }

    const deleteAUser = async (id) => {
        const res = await deleteUser(id)
        if (res) {
            toaster.success({
                title: "User Deleted",
                description: "User has been deleted successfully",
            })
            setUsers(users.filter(user => user._id !== id))
        }else {
            toaster.error({
                title: "Failed to Delete User",
                description: "User could not be deleted",
            })
        }
    }

    const addSkill = async () => {
        const res = await addNewSkill(newSkill)
        if (res) {
            toaster.success({
                title: "Skill Added",
                description: "Skill has been added successfully",
            })
        }else {
            toaster.error({
                title: "Failed to Add Skill",
                description: "Skill could not be added",
            })
        }
    }


    return (
        <>
            <Toaster />
            <Flex
                flexDir="column"
                minH="100vh"
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="start"
                p={4}
                position="relative"
            >
                {/*Floating Button to Add New Project*/}
                <Flex w="full" p={6} justifyContent="space-between" mb={6}>
                    <Heading as="h1" size="4xl" mb={6} textAlign="center">
                        Users
                    </Heading>
                    <Flex gap={4}>
                        <DialogRoot size={'lg'}>
                            <DialogTrigger>
                                <Button
                                    variant="surface"
                                    gap={2}
                                    p={5}
                                    borderRadius="full"
                                    cursor="pointer"
                                    boxShadow="md"
                                >
                                    <FaPlus size={24}/>
                                    User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogCloseTrigger/>
                                </DialogHeader>
                                <DialogBody>
                                    <VStack spacing={4}>
                                        <Field label="Name" id="name" type="text" placeholder="Enter Name">
                                            <Input placeholder="Enter Name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})}/>
                                        </Field>
                                        <Field label="Email" id="email" type="email" placeholder="Enter Email">
                                            <Input placeholder="Enter Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})}/>
                                        </Field>
                                    </VStack>
                                </DialogBody>
                                <DialogFooter>
                                    <DialogActionTrigger>
                                        <Button variant="surface" colorPalette="green" onClick={handleAddUser}>Add
                                            User</Button>
                                    </DialogActionTrigger>
                                </DialogFooter>
                            </DialogContent>
                        </DialogRoot>

                        {/*    Create a New Skill*/}
                        <DialogRoot size={'lg'}>
                            <DialogTrigger>
                                <Button
                                    variant="surface"
                                    gap={2}
                                    p={5}
                                    borderRadius="full"
                                    cursor="pointer"
                                    boxShadow="md"
                                >
                                    <FaPlus size={24}/>
                                    Skill
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Skill</DialogTitle>
                                    <DialogCloseTrigger/>
                                </DialogHeader>
                                <DialogBody>
                                    <VStack spacing={4}>
                                        <Field label="Name" id="name" type="text" placeholder="Enter Name">
                                            <Input placeholder="Enter Name" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}/>
                                        </Field>
                                        <Field label="Description" id="description" type="text" placeholder="Enter Description">
                                            <Input placeholder="Enter Description" value={newSkill.description} onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}/>
                                        </Field>
                                    </VStack>
                                </DialogBody>
                                <DialogFooter>
                                    <DialogActionTrigger>
                                        <Button variant="surface"
                                                onClick={addSkill}
                                                colorPalette="green">Add Skill</Button>
                                    </DialogActionTrigger>
                                </DialogFooter>
                            </DialogContent>
                        </DialogRoot>
                    </Flex>

                </Flex>
                <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={2} w="full">
                    {users.map((user) => (
                        <GridItem key={user._id} p={4} boxShadow="md" borderRadius="md" w="full" border="1px solid" borderColor="gray.200" position={'relative'}>
                            <Box w="200px" h="200px" mb={2}
                                 backgroundImage={`url(${user?.profileImage ? `${API_BASE}/${user?.profileImage}` : sampleProfile})`}
                                 backgroundSize="cover" backgroundPosition="center" borderRadius="full"/>
                            <Heading as="h2" size="lg" mb={4}>
                                {user.name}
                            </Heading>
                            <Text>
                                {user.email}
                            </Text>
                            <HStack mb={'50px'}>
                                <Badge colorPalette={user.status === 'active' ? 'green' : 'red'}>
                                    {user.status}
                                </Badge>
                            </HStack>
                            <Flex gap={1} mt={2} position="absolute" bottom={4} w="full">
                                <DialogRoot>
                                    <DialogTrigger>
                                        <Button
                                            variant="subtle"
                                            colorPalette="green"
                                            mt={4}
                                        >
                                            <MdCheckCircle/>
                                            View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>View User</DialogTitle>
                                            <DialogCloseTrigger/>
                                        </DialogHeader>
                                        <DialogBody>
                                            <Stack spacing={4}>
                                                <Text>
                                                    Name: {user.name}
                                                </Text>
                                                <Text>
                                                    Email: {user.email}
                                                </Text>
                                                <Text>
                                                    Status: <Badge colorPalette={user.status === 'active' ? 'green' : 'red'}> {user.status} </Badge>
                                                </Text>

                                                {/*    Interests*/}
                                                <Flex direction="column" border="1px solid" borderColor="gray.200" p={4} borderRadius="md" mb={4}>
                                                    <Heading as="h3" size="md">
                                                        BIO
                                                    </Heading>
                                                    <Flex>
                                                        {user.bio && (
                                                            <Text>
                                                                {user.bio}
                                                            </Text>
                                                        )}
                                                        {!user.bio && (
                                                            <Text>No bio added</Text>
                                                        )}
                                                    </Flex>
                                                </Flex>

                                                {/*    Skills*/}
                                                <Flex direction="column" border="1px solid" borderColor="gray.200" p={4} borderRadius="md" mb={4}>
                                                    <Heading as="h3" size="md">
                                                        Skills
                                                    </Heading>
                                                    <Flex>
                                                        {user.skills && user.skills.map((skill) => (
                                                            <Badge key={skill} colorPalette="purple" mr={2}>
                                                                {skill.name}
                                                            </Badge>
                                                        ))}
                                                        {user.skills && user.skills.length === 0 && (
                                                            <Text>No skills added</Text>
                                                        )}
                                                    </Flex>
                                                </Flex>


                                            </Stack>
                                        </DialogBody>
                                        <DialogFooter>
                                            <DialogActionTrigger>
                                                <Button variant="surface" colorPalette="red">Close</Button>
                                            </DialogActionTrigger>
                                        </DialogFooter>
                                    </DialogContent>
                                </DialogRoot>

                                {/*    Delete User*/}
                                <DialogRoot>
                                    <DialogTrigger>
                                        <Button
                                            variant="subtle"
                                            colorPalette="red"
                                            mt={4}
                                        >
                                            <MdOutlineDelete/>
                                            Delete
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Delete User</DialogTitle>
                                            <DialogCloseTrigger/>
                                        </DialogHeader>
                                        <DialogBody>
                                            <Text>
                                                Are you sure you want to delete this user?
                                            </Text>
                                        </DialogBody>
                                        <DialogFooter>
                                            <DialogActionTrigger>
                                                <Button variant="surface" colorPalette="red"
                                                        onClick={() => deleteAUser(user._id)}
                                                >Delete</Button>
                                            </DialogActionTrigger>
                                        </DialogFooter>
                                    </DialogContent>
                                </DialogRoot>
                            </Flex>


                        </GridItem>
                    ))}
                </Grid>
            </Flex>
        </>
    )
}

export default User