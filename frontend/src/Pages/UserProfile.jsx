import {
    Badge,
    Box,
    Button,
    CheckboxGroup,
    Flex,
    Grid,
    Heading,
    IconButton,
    Input,
    Stack,
    Text, Textarea
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {assignSkill, changeUserBio, getAllSkills, getUserData, uploadProfileImage} from "@/services/profileService.js";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {toaster} from "@/components/ui/toaster.jsx";
import {FaEdit} from "react-icons/fa";
import {API_BASE} from "@/config.js";
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
} from "@/components/ui/dialog"

const UserProfile = () => {


    const [user, setUser] = useState()
    const [skills, setSkills] = useState([])
    const [allSkills, setAllSkills] = useState([])
    const [newSkill, setNewSkill] = useState([])
    const [profileImage, setProfileImage] = useState()

    const [userNewBio, setUserNewBio] = useState()

    const handleAddSkill = async () => {
        const res = await assignSkill(newSkill)
        if (res) {
            toaster.success({
                title: 'Success',
                description: 'Skills updated',
                status: 'success',
            })
            await loadUser()

        } else {
            toaster.error({
                title: 'Error',
                description: 'Failed to update skills',
                status: 'error',
            })
        }
    }

    const obtainAllSkills = async () => {
        const res = await getAllSkills()
        setSkills(res)
        setAllSkills(res)
    }

    const loadUser = async () => {
        const res = await getUserData()
        setUser(res)
        setNewSkill(res.skills.map(skill => skill._id))
    }

    useEffect(() => {
        obtainAllSkills()
        loadUser()
    }, [])

    const searchSkills = (e) => {
        const search = e.target.value
        const filteredSkills = allSkills.filter(skill => skill.name.toLowerCase().includes(search.toLowerCase()))
        setSkills(filteredSkills)
    }

    const triggerChangeProfileImage = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()
        input.onchange = async (e) => {
            const file = e.target.files[0]
            await uploadProfileImage(file)
            setProfileImage(file)
            await loadUser()

        }

    }

    const changeBio = async (bio) => {
        const res = await changeUserBio(bio)
        if (res) {
            toaster.success({
                title: 'Success',
                description: 'Bio updated',
                status: 'success',
            })
            await loadUser()
        } else {
            toaster.error({
                title: 'Error',
                description: 'Failed to update bio',
                status: 'error',
            })
        }
    }


    const sampleProfile = "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg";

    return (
        <Flex gap={3} flexDir={"column"} p={4} borderWidth={1} borderRadius="lg" overflow="hidden">
            <Flex justify="space-between">
                <Flex flexDir="column" gap={2}>
                    <Text><strong>Name:</strong> {user?.name}</Text>
                    <Text><strong>Email:</strong> {user?.email}</Text>
                    <Text><strong>Role:</strong> {user?.role[0].toUpperCase() + user?.role.slice(1)}</Text>
                    <Text><strong>Status:</strong> {user?.status}</Text>
                    <Text><strong>Created At:</strong> {new Date(user?.createdAt).toLocaleDateString()}</Text>
                    <Text textAlign={'start'}>
                        <strong>Bio : </strong>
                        {user?.bio}     <DialogRoot>
                        <DialogTrigger asChild>
                            <IconButton
                                size="sm"
                                aria-label="Edit Bio">
                                <FaEdit/>
                            </IconButton>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Bio</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                                <Textarea placeholder="Enter your bio" onChange={(e) => setUserNewBio(e.target.value)}/>
                            </DialogBody>
                            <DialogFooter>
                                <DialogActionTrigger asChild>
                                    <Button variant="outline"
                                            onClick={() => changeBio(userNewBio)}>Save</Button>

                                </DialogActionTrigger>
                            </DialogFooter>
                            <DialogCloseTrigger />
                        </DialogContent>
                    </DialogRoot>
                    </Text>


                </Flex>
                <Flex flexDir="column" gap={2}>
                    <Box w="200px" h="200px" borderRadius="full" bg="gray.900"
                        // background={`url(${sampleProfile}) no-repeat center center / cover`}
                         background={`url(${user?.profileImage !== undefined ? API_BASE + "/" + user?.profileImage : sampleProfile}) no-repeat center center / cover`}
                    />
                    <Button variant={'subtle'} colorPalette="green" onClick={triggerChangeProfileImage}>
                        <FaEdit/>
                        Change Profile Image
                    </Button>
                </Flex>
            </Flex>
            <Box mt={4}>
                <Heading as="h2" size="md" mb={2}>Skills</Heading>
                <Stack spacing={2}>
                    {/* Render skills here */}
                    {user && (
                        <CheckboxGroup defaultValue={user?.skills && user.skills.map(skill => skill._id)}>
                            <Input placeholder="Search skills" onChange={(e) => searchSkills(e)}/>
                            <Grid templateColumns="repeat(3, 1fr)" gap={4} maxH="400px" overflowY="auto">
                                {skills.map((skill) => (
                                    <CheckboxCard
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setNewSkill([...newSkill, skill._id])
                                            } else {
                                                setNewSkill(newSkill.filter(id => id !== skill._id))
                                            }
                                        }}
                                        colorPalette={user?.skills && user.skills.map(userSkill => userSkill._id).includes(skill._id) ? 'green' : 'gray'}
                                        variant={user?.skills && user.skills.map(userSkill => userSkill._id).includes(skill._id) ? 'subtle' : 'outline'}
                                        label={skill.name}
                                        description={skill.description}
                                        key={skill._id}
                                        value={skill._id}>
                                    </CheckboxCard>
                                ))}
                            </Grid>
                        </CheckboxGroup>
                    )}

                </Stack>
                <Flex mt={4} justify="flex-end">
                    <Button variant={'subtle'} onClick={handleAddSkill} mt={2} colorPalette="green">Save
                        Profile</Button>
                </Flex>
            </Box>
        </Flex>
    )
}

export default UserProfile