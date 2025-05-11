import {useEffect, useState} from "react";
import {
    Badge,
    Box,
    CheckboxGroup,
    Circle,
    Flex,
    Grid,
    Heading,
    HStack, IconButton,
    Image,
    Input,
    Stack,
    Text
} from "@chakra-ui/react";
import {FaPlus} from "react-icons/fa";
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
    acceptCollaborateRequest, assignToProject,
    CalloborateRequestAccept,
    createProject, declineToProject,
    deleteProject, getAllProjectCollaborateRequest,
    getAllProjects,
    getUserCollaborateRequest, rejectCollaborateRequest,
    uploadProjectImage
} from "@/services/projectService.js";
import AssignUserComponent from "@/Pages/AssignUserComponent.jsx";
import {API_BASE, API_URL} from "@/config.js";
import {FaCodePullRequest, FaTrash, FaUpload, FaUsers} from "react-icons/fa6";
import {MdOutlineDelete} from "react-icons/md";
import {Field} from "@/components/ui/field.jsx";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {getAllSkills} from "@/services/profileService.js";
import {NativeSelectField, NativeSelectRoot} from "@/components/ui/native-select.jsx";
import {toaster} from "@/components/ui/toaster.jsx";


const AdminDashboard = () => {

    const [projects, setProjects] = useState([])
    const [projectImage, setProjectImage] = useState(null)
    const [projectImagePreview, setProjectImagePreview] = useState(null)
    const [skills, setSkills] = useState([])
    const [allSkills, setAllSkills] = useState([])
    const [newSkill, setNewSkill] = useState([])

    const [projectCollaborationRequest, setProjectCollaborationRequest] = useState([])


    const navigate =
        useNavigate()

    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        type: 'personal',
        skill_level: [],
        subject: '',
        start_date: '',
        end_date: '',
        priority: '',
        cost: ''
    })

    const [newProjectError, setNewProjectError] = useState({
        name: '',
        description: '',
        type: '',
        skill_level: '',
        subject: '',
        start_date: '',
        end_date: '',
        priority: '',
        cost: ''
    })


    const [open, setOpen] = useState(false)

    const loadProjects = async () => {
        const res = await getAllProjects()
        setProjects(res)
    }

    const loadProjectCollaborationRequest = async () => {
        const res = await getAllProjectCollaborateRequest()
        setProjectCollaborationRequest(res)
    }

    const obtainAllSkills = async () => {
        const res = await getAllSkills()
        setSkills(res)
        setAllSkills(res)
    }

    useEffect(() => {
        loadProjects()
        loadProjectCollaborationRequest()
        obtainAllSkills()
    }, [])

    const projectTypes = ["Personal", "Group"]

    const handleAddProject = async () => {
        if (validateProject()) {
            newProject.skills = newSkill
            const res = await createProject(newProject)
            if (res) {
                if (projectImage) {
                    const uploadImageRes = await uploadProjectImage(res._id, projectImage)
                }
                loadProjects()

            }
        }
    }

    const validateProject = () => {
        const errors = {
            name: '',
            description: '',
            type: '',
            skill_level: '',
            subject: '',
            start_date: '',
            end_date: '',
            priority: '',
            cost: ''
        }
        if (newProject.name === '') {
            errors.name = 'Name is required'
        }
        if (newProject.description === '') {
            errors.description = 'Description is required'
        }
        if (newProject.type === '') {
            errors.type = 'Type is required'
        }
        if (newProject.subject === '') {
            errors.subject = 'Subject is required'
        }
        if (newProject.start_date === '') {
            errors.start_date = 'Start Date is required'
        }
        if (newProject.end_date === '') {
            errors.end_date = 'End Date is required'
        }
        setNewProjectError(errors)
        return !Object.values(errors).some(err => err !== '')
    }

    const searchSkills = (e) => {
        const search = e.target.value
        const filteredSkills = allSkills.filter(skill => skill.name.toLowerCase().includes(search.toLowerCase()))
        setSkills(filteredSkills)
    }


    const viewTasks = (project) => {
        navigate('/tasks', {state: {project}})
    }

    const triggerImageUpload = () => {
        console.log('trigger image upload')
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
            const file = e.target.files[0]
            setProjectImage(file)
            setProjectImagePreview(URL.createObjectURL(file))
        }
        input.click()
    }

    const deleteAProject = async (id) => {
        const res = await deleteProject(id)
        if (res) {
            loadProjects()
            toaster.success({
                title: 'Success',
                description: 'Project deleted successfully',
            })
        }
    }

    const acceptCollaborationRequest = async (requestId) => {
        const res = await assignToProject(requestId)
        if (res) {
            loadProjectCollaborationRequest()
            toaster.success({
                title: 'Success',
                description: 'Collaboration request accepted successfully',
            })
        }
    }

    const rejectCollaborationRequest = async (requestId) => {
        const res = await declineToProject(requestId)
        if (res) {
            loadProjectCollaborationRequest()
            toaster.success({
                title: 'Success',
                description: 'Collaboration request rejected successfully',
            })
        }
    }


    return (
        <>
            <Flex w="full" h="full" gap={4} p={2}>
                <Flex
                    flexDir="column"
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
                            Projects
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
                                        Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Project</DialogTitle>
                                        <DialogCloseTrigger/>
                                    </DialogHeader>
                                    <DialogBody>
                                        <Stack spacing={4}>
                                            {/*Image Uploader*/}
                                            <HStack>
                                                {projectImagePreview && (
                                                    <Flex flexDir="column" w="full" gap={3} borderRadius="md"
                                                          overflow="hidden">
                                                        <Image src={projectImagePreview} alt="Project Image"
                                                               borderRadius="md"
                                                               maxH={'300px'}/>
                                                        <Button
                                                            variant="surface"
                                                            colorPalette="red"
                                                            onClick={() => {
                                                                setProjectImage(null)
                                                                setProjectImagePreview(null)
                                                            }}
                                                        >
                                                            <MdOutlineDelete/>
                                                            Remove Image
                                                        </Button>
                                                    </Flex>
                                                )}


                                                {!projectImagePreview && (
                                                    <Box
                                                        w={'full'}
                                                        h="300px"
                                                        borderRadius="md"
                                                        border="1px dashed"
                                                        borderColor="gray.200"
                                                        cursor="pointer"
                                                        onClick={() => triggerImageUpload()}
                                                    >
                                                        <Flex w="full" h="full" gap={4} align="center" justify="center">
                                                            <FaUpload size={24}/>
                                                            <Text>Upload Image</Text>
                                                        </Flex>
                                                    </Box>
                                                )}
                                            </HStack>
                                            <Field orientation="horizontal" label=" Name"
                                                   invalid={!!newProjectError.name}
                                                   errorText={newProjectError.name}>
                                                <Input placeholder="Project Name"
                                                       onChange={(e) => setNewProject({
                                                           ...newProject,
                                                           name: e.target.value
                                                       })}
                                                       value={newProject.name}/>
                                            </Field>
                                            <Field orientation="horizontal" label="Description"
                                                   invalid={!!newProjectError.description}
                                                   errorText={newProjectError.description}>
                                                <Input placeholder="Description"
                                                       onChange={(e) => setNewProject({
                                                           ...newProject,
                                                           description: e.target.value
                                                       })}
                                                       value={newProject.description}/>
                                            </Field>
                                            <Field orientation="horizontal" label="Type"
                                                   invalid={!!newProjectError.type}
                                                   errorText={newProjectError.type}>
                                                <NativeSelectRoot variant={'subtle'}>
                                                    <NativeSelectField items={projectTypes}
                                                                       onChange={(e) => setNewProject({
                                                                           ...newProject,
                                                                           type: e.target.value.toLowerCase()
                                                                       })}/>
                                                </NativeSelectRoot>
                                            </Field>
                                            <Field orientation="horizontal" label="Subject"
                                                   invalid={!!newProjectError.subject}
                                                   errorText={newProjectError.subject}>
                                                <Input placeholder="Subject"
                                                       onChange={(e) => setNewProject({
                                                           ...newProject,
                                                           subject: e.target.value
                                                       })}
                                                       value={newProject.subject}/>
                                            </Field>
                                            <Field
                                                orientation="horizontal"
                                                label="Start Date"
                                                invalid={!!newProjectError.start_date}
                                                errorText={newProjectError.start_date}
                                            >
                                                <Input type={'date'} placeholder="Start Date"
                                                       onChange={(e) => setNewProject({
                                                           ...newProject,
                                                           start_date: e.target.value
                                                       })} value={newProject.start_date}/>
                                            </Field>
                                            <Field
                                                orientation="horizontal"
                                                label="End Date"
                                                invalid={!!newProjectError.end_date}
                                                errorText={newProjectError.end_date}
                                            >
                                                <Input type={'date'} placeholder="End Date"
                                                       onChange={(e) => setNewProject({
                                                           ...newProject,
                                                           end_date: e.target.value
                                                       })} value={newProject.end_date}/>
                                            </Field>
                                            <Box mt={4}>
                                                <Heading as="h2" size="md" mb={2}>Skills</Heading>
                                                <Stack spacing={2}>
                                                    {/* Render skills here */}
                                                    <CheckboxGroup defaultValue={[]}>
                                                        <Input placeholder="Search skills"
                                                               onChange={(e) => searchSkills(e)}/>
                                                        <Grid templateColumns="repeat(3, 1fr)" gap={2} maxH="120px"
                                                              overflowY="auto">
                                                            {skills.map((skill) => (
                                                                <CheckboxCard
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setNewSkill([...newSkill, skill._id])
                                                                        } else {
                                                                            setNewSkill(newSkill.filter(id => id !== skill._id))
                                                                        }
                                                                    }}
                                                                    colorPalette={newSkill.includes(skill._id) ? 'green' : 'gray'}
                                                                    variant={newSkill.includes(skill._id) ? 'subtle' : 'outline'}
                                                                    label={skill.name}
                                                                    key={skill._id}
                                                                    value={skill._id}>
                                                                </CheckboxCard>
                                                            ))}
                                                        </Grid>
                                                    </CheckboxGroup>

                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </DialogBody>
                                    <DialogFooter>
                                        <DialogActionTrigger>
                                            <Button variant="surface" colorPalette="blue" onClick={handleAddProject}>Add
                                                Project</Button>
                                        </DialogActionTrigger>
                                    </DialogFooter>
                                </DialogContent>
                            </DialogRoot>
                            <DialogRoot size={'lg'}>
                                <DialogTrigger>
                                    <Button
                                        position="relative"
                                        variant="surface"
                                        gap={2}
                                        p={5}
                                        borderRadius="full"
                                        cursor="pointer"
                                        boxShadow="md"
                                    >
                                        <FaCodePullRequest size={24}/>
                                        {/*Add Small circle on blue if there are collaboration requests*/}
                                        {projectCollaborationRequest && projectCollaborationRequest.length > 0 && (
                                            <Circle
                                                position="absolute"
                                                top={-1}
                                                right={-1}
                                                size="20px"
                                                bg="blue.500"
                                                color="white"
                                                fontSize="xs"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                />
                                        )}
                                        Requests
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Collaboration Requests</DialogTitle>
                                        <DialogCloseTrigger/>
                                    </DialogHeader>
                                    <DialogBody>
                                        {/*    projectCollaborationRequests with user and project*/}
                                        <Stack spacing={4}>
                                            {projectCollaborationRequest && projectCollaborationRequest.map((request, index) => (
                                                <Flex key={index} flexDir="column" gap={2} borderRadius="md" p={4}
                                                      boxShadow="md" border="1px solid" borderColor="gray.200">
                                                    <Flex flexDir={'column'} justifyContent="space-between" gap={2}
                                                          alignItems="start">
                                                        <Flex alignItems="center" gap={2}>
                                                            <Circle size="40px" bg="gray.200" _dark={{bg: "gray.600"}}>
                                                                <Text fontSize="xl">{request.user.name.charAt(0)}</Text>
                                                            </Circle>
                                                            <Text
                                                                fontSize="lg">{request.user.name} | {request.user.email}</Text>
                                                        </Flex>
                                                        <Text fontSize="lg">{request.project.name}</Text>
                                                        <Text fontSize="lg">{request.project.subject}</Text>
                                                    </Flex>
                                                    <Flex justifyContent="end" gap={4} alignItems="center">
                                                        <Button
                                                            colorPalette="green"
                                                            variant="subtle"
                                                            cursor="pointer"
                                                            boxShadow="md"
                                                            onClick={() => acceptCollaborationRequest(request._id)}
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            colorPalette="red"
                                                            variant="subtle"
                                                            cursor="pointer"
                                                            boxShadow="md"
                                                            onClick={() => rejectCollaborationRequest(request._id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Flex>
                                                </Flex>
                                            ))}
                                            {projectCollaborationRequest && projectCollaborationRequest.length == 0 && (
                                                <Flex justifyContent="space-between" alignItems="center">
                                                    No Collaboration Requests
                                                </Flex>
                                            )}
                                        </Stack>

                                    </DialogBody>
                                </DialogContent>
                            </DialogRoot>
                        </Flex>

                    </Flex>
                    <Grid
                        templateColumns="repeat(auto-fill, minmax(320px, 1fr))"
                        w="full"
                        p={6}
                        gap={4}
                    >

                        {projects && projects.map((project, index) => (
                            <Box
                                position="relative"
                                cursor={"pointer"}
                                key={index} mb={6} p={4} borderRadius="md" boxShadow="md" border="1px solid"
                                borderColor="gray.200">
                                <Image
                                    src={project.image !== undefined ? API_BASE + "/" + project.image : API_BASE + "/" + "uploads/projects/sample.jpg"}
                                    h={200} w="full" objectFit="cover"
                                    alt={project.image} borderRadius="md"/>
                                <Heading as="h2" size="xl" mb={2}>{project.name}</Heading>
                                <Text as="h4" size="md" mb={2}>{project.description}</Text>
                                <Badge colorPalette="purple" mb={2}>{project.type}</Badge>
                                {/*Delete Project */}
                                <DialogRoot key={"dp" + index}>
                                    <DialogTrigger asChild>
                                        <IconButton
                                            position="absolute"
                                            top={1}
                                            size="xs"
                                            rounded="full"
                                            right={1} colorPalette="red" variant="subtle">
                                            <FaTrash/>
                                        </IconButton>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Delete Project</DialogTitle>
                                            <DialogCloseTrigger/>
                                        </DialogHeader>
                                        <DialogBody>
                                            <Text>Are you sure you want to delete this project?</Text>
                                        </DialogBody>
                                        <DialogFooter>
                                            <DialogActionTrigger>
                                                <Button variant="surface" onClick={() => deleteAProject(project._id)}
                                                        colorPalette="red">Delete</Button>
                                            </DialogActionTrigger>
                                        </DialogFooter>
                                    </DialogContent>
                                </DialogRoot>

                                {/*    Assign Users button and View Tasks button*/}
                                <Flex justifyContent="space-between" alignItems="center" mt={1}>
                                    {/*View Already assigned Users as a Dialog*/}
                                    <DialogRoot key={"au" + index}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                cursor="pointer"
                                                boxShadow="md"
                                            >
                                                <FaUsers/>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Assigned Users</DialogTitle>
                                                <DialogCloseTrigger/>
                                            </DialogHeader>
                                            <DialogBody>
                                                <Flex flexDir="column" gap={2}>
                                                    {project.collaborators && project.collaborators.map((user, index) => (
                                                        <Flex key={index} alignItems="center" gap={2}>
                                                            <Circle size="40px" bg="gray.200" _dark={{bg: "gray.600"}}>
                                                                <Text fontSize="xl">{user.name.charAt(0)}</Text>
                                                            </Circle>
                                                            <Text fontSize="lg">{user.name} | {user.email}</Text>
                                                        </Flex>
                                                    ))}
                                                    {project.collaborators.length === 0 && (
                                                        <Text fontSize="lg">No users assigned</Text>
                                                    )}
                                                </Flex>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger>
                                                    <Button variant="surface" colorPalette="blue">Close</Button>
                                                </DialogActionTrigger>
                                            </DialogFooter>
                                        </DialogContent>
                                    </DialogRoot>

                                    <Flex justifyContent="flex-end" gap={2}>
                                        <DialogRoot key={"au" + index}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    colorPalette="green"
                                                    variant="subtle"
                                                    cursor="pointer"
                                                    boxShadow="md"
                                                >
                                                    Assign Users
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Assign Users</DialogTitle>
                                                    <DialogCloseTrigger/>
                                                </DialogHeader>
                                                <DialogBody>
                                                    <AssignUserComponent project={project}/>
                                                </DialogBody>
                                            </DialogContent>
                                        </DialogRoot>
                                        <Button
                                            colorPalette="blue"
                                            variant="subtle"
                                            cursor="pointer"
                                            boxShadow="md"
                                            onClick={() => viewTasks(project)}
                                        >
                                            View Tasks
                                        </Button>
                                    </Flex>
                                </Flex>

                            </Box>
                        ))}
                    </Grid>
                </Flex>

            </Flex>
        </>
    )
}

export default AdminDashboard;