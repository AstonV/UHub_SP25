import {useEffect, useState} from "react";
import {
    Badge,
    Box,
    CheckboxGroup,
    Circle,
    Flex,
    Grid,
    Heading,
    HStack,
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
import {createProject, getAllProjects, getCollaborateProjects, uploadProjectImage} from "@/services/projectService.js";
import AssignUserComponent from "@/Pages/AssignUserComponent.jsx";
import {API_BASE, API_URL} from "@/config.js";
import {FaUpload} from "react-icons/fa6";
import {MdOutlineDelete} from "react-icons/md";
import {Field} from "@/components/ui/field.jsx";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {getAllSkills} from "@/services/profileService.js";
import {NativeSelectField, NativeSelectRoot} from "@/components/ui/native-select.jsx";
import {BsFillChatFill} from "react-icons/bs";


const Project = () => {

    const [projects, setProjects] = useState([])
    const [projectImage, setProjectImage] = useState(null)
    const [projectImagePreview, setProjectImagePreview] = useState(null)
    const [skills, setSkills] = useState([])
    const [allSkills, setAllSkills] = useState([])




    const navigate =
        useNavigate()

    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        type: '',
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
        const res = await getCollaborateProjects()
        setProjects(res)
    }

    const obtainAllSkills = async () => {
        const res = await getAllSkills()
        setSkills(res)
        setAllSkills(res)
    }

    useEffect(() => {
        loadProjects()
        obtainAllSkills()
    }, [])

    const projectTypes = ["Personal", "Group"]

    const handleAddProject = async () => {
        if (validateProject()) {
            const res = await createProject(newProject)
            if (res) {
                if(projectImage){
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
    const navigateToTasks = (project) => {
        console.log(project)
        navigate('/tasks', {state: {project: project}})
    }

    const navigateToChat = (project) => {
        console.log(project)
        navigate('/project-chat', {state: {project: project}})
    }

    return (
        <>
            <Flex
                flexDir="column"
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="start"
                p={2}
                position="relative"
            >
                {/*Floating Button to Add New Project*/}
                <Flex w="full" p={6} justifyContent="space-between" mb={6}>
                    <Heading as="h1" size="4xl" mb={6} textAlign="center">
                        Collaborate Projects
                    </Heading>

                </Flex>
                <Grid
                    templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    w="full"
                    p={6}
                    gap={6}
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
                            <Circle size={3} position="absolute" top={2} right={2}
                                    bg={project.status === 'active' ? 'green.700' : 'red.700'}>
                            </Circle>

                            {/*    Assign Users button and View Tasks button*/}
                            <Flex justifyContent="flex-end" gap={2}>
                                <Button
                                    colorPalette="blue"
                                    variant="subtle"
                                    cursor="pointer"
                                    boxShadow="md"
                                    onClick={() => navigateToTasks(project)}
                                >
                                    View Tasks
                                </Button>
                                <Button
                                    colorPalette="green"
                                    variant="subtle"
                                    cursor="pointer"
                                    boxShadow="md"
                                    onClick={() => navigateToChat(project)}
                                >
                                    <BsFillChatFill/>
                                    View Chat
                                </Button>
                            </Flex>
                        </Box>
                    ))}
                </Grid>
            </Flex>
        </>
    )
}

export default Project