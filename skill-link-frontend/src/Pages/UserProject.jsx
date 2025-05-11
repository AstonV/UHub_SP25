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
import {
    acceptCollaborateRequest,
    collaborateProject,
    createProject,
    getAllNonCollaborateProjects,
    getAllProjects, getUserCollaborateRequest, rejectCollaborateRequest,
    uploadProjectImage
} from "@/services/projectService.js";
import AssignUserComponent from "@/Pages/AssignUserComponent.jsx";
import {API_BASE, API_URL} from "@/config.js";
import {FaFilter, FaUpload} from "react-icons/fa6";
import {MdOutlineDelete} from "react-icons/md";
import {Field} from "@/components/ui/field.jsx";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {getAllSkills} from "@/services/profileService.js";
import {NativeSelectField, NativeSelectRoot} from "@/components/ui/native-select.jsx";
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent, PopoverFooter,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Fieldset} from "@chakra-ui/react"
import {Checkbox} from "@/components/ui/checkbox"
import {toaster} from "@/components/ui/toaster.jsx";

const UserProject = () => {

    const [projects, setProjects] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [skillFilter, setSkillFilter] = useState(['all'])

    const [skills, setSkills] = useState([])
    const [allSkills, setAllSkills] = useState([])

    const [collaborateRequests, setCollaborateRequests] = useState([])



    const getCollaborateRequests = async () => {
        const res = await getUserCollaborateRequest()
        setCollaborateRequests(res)
    }

    const navigate =
        useNavigate()


    const [open, setOpen] = useState(false)

    const loadProjects = async () => {
        const res = await getAllNonCollaborateProjects()
        setProjects(res)
        setAllProjects(res)
    }

    const obtainAllSkills = async () => {
        const res = await getAllSkills()
        setSkills(res)
        setSkillFilter((prev) => [...prev, ...res.map((skill) => skill._id)])
        setAllSkills(res)
    }

    useEffect(() => {
        loadProjects()
        obtainAllSkills()
        getCollaborateRequests()
    }, [])

    const applyFilter = () => {
        const filteredProjects = allProjects.filter((project) => {
            if (skillFilter.includes('all')) {
                return true
            } else {
                const projectSkillIds = project.skills.map((skill) => skill._id)
                return skillFilter.some((skill) => projectSkillIds.includes(skill))
            }
        })
        setProjects(filteredProjects)
    }

    const searchProjects = (e) => {
        const search = e.target.value
        if (search === '') {
            setProjects(allProjects)
        } else {
            const filteredProjects = allProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
            setProjects(filteredProjects)
        }
    }

    const collaborateToThisProject = async (projectId) => {
        try {
            await collaborateProject(projectId)
            loadProjects()
            toaster.success({
                title: "Success",
                description: "Collaborated to the project successfully"
            })
        }catch (e) {
            toaster.error({
                title: "Error",
                description: e.message
            })
        }

    }

    const acceptCollaborateUserRequest = async (projectId) => {
        try {
            await acceptCollaborateRequest(projectId)
            getCollaborateRequests()
            loadProjects()
            toaster.success({
                title: "Success",
                description: "Collaborated to the project successfully"
            })
        }catch (e) {
            toaster.error({
                title: "Error",
                description: e.message
            })
        }
    }

    const rejectCollaborateUserRequest = async (projectId) => {
        try {
            await rejectCollaborateRequest(projectId)
            loadProjects()
            getCollaborateRequests()
            toaster.success({
                title: "Success",
                description: "Rejected the collaboration request successfully"
            })
        }catch (e) {
            toaster.error({
                title: "Error",
                description: e.message
            })
        }
    }


    const navigateToTasks = (project) => {
        console.log(project)
        navigate('/tasks', {state: {project: project}})
    }


    return (
        <>
            <Flex w="full" display="flex" alignItems="center" justifyContent="start" position="relative">
                <Flex
                    p={2}
                    flexDir="column"
                    w="full"
                    h={'calc(100vh - 70px)'}
                    display="flex"
                    alignItems="start"
                    justifyContent="start"
                    position="relative"
                >
                    {/*Floating Button to Add New Project*/}
                    <Flex w="full" p={2} justifyContent="space-between">
                        <Heading as="h1"
                                 size="4xl" mb={6} textAlign="center">
                            Projects
                        </Heading>

                    </Flex>
                    <Flex w="full" gap={3} justifyContent="start">
                        <Field label="Search" orientation="horizontal">
                            <Input placeholder="Search Projects" onChange={(e) => searchProjects(e)}/>
                        </Field>
                        {skillFilter && (
                            <PopoverRoot>
                                <PopoverTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <FaFilter/>
                                        Filter
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow/>
                                    <PopoverBody>
                                        {skills && skills.length > 0 && (

                                            <Fieldset.Root>
                                                <CheckboxGroup defaultValue={skillFilter}
                                                               value={skillFilter}
                                                               name="framework">
                                                    <Fieldset.Legend fontSize="sm" mb="2">
                                                        Filter by Skills
                                                    </Fieldset.Legend>
                                                    <Fieldset.Content maxH="400px" overflowY="auto">
                                                        <Checkbox value="all"
                                                                  onChange={(e) => {
                                                                      if (e.target.checked) {
                                                                          setSkillFilter(allSkills.map((skill) => skill._id).concat(['all']))
                                                                      } else {
                                                                          setSkillFilter([])
                                                                      }
                                                                  }}
                                                        >ALL</Checkbox>
                                                        {skills && skills.map((skill, index) => (
                                                            <Checkbox value={skill._id} key={index}
                                                                      checked={skillFilter.includes(skill._id)}
                                                                      onCheckedChange={(e) => {
                                                                          console.log(e)
                                                                          if (e.checked) {
                                                                              console.log("checked")
                                                                              setSkillFilter([...skillFilter, skill._id])
                                                                          } else {
                                                                              if (skillFilter.length === 1) {
                                                                                  setSkillFilter(['all'])
                                                                              }
                                                                              setSkillFilter(skillFilter.filter((item) => item !== skill._id))
                                                                          }
                                                                          console.log(skillFilter)
                                                                      }}
                                                            >
                                                                {skill.name}
                                                            </Checkbox>
                                                        ))}
                                                    </Fieldset.Content>
                                                </CheckboxGroup>
                                            </Fieldset.Root>
                                        )}
                                    </PopoverBody>
                                    <PopoverFooter>
                                        <Button size="sm"
                                                colorPalette={'blue'}
                                                variant="subtle"
                                                onClick={() => applyFilter()}
                                        >
                                            Apply
                                        </Button>
                                    </PopoverFooter>
                                </PopoverContent>
                            </PopoverRoot>
                        )}
                    </Flex>
                    <Grid
                        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                        w="full"
                        p={6}
                        gap={6}
                    >

                        {projects && projects.map((project, index) => (
                            <Flex
                                flexDir="column"
                                justifyContent="space-between"
                                position="relative"
                                cursor={"pointer"}
                                boxShadowColor="gray.200"
                                key={index} mb={6} p={4} borderRadius="md" boxShadow="md" border="1px solid"
                                borderColor="gray.200">
                                <Flex flexDir="column" justifyContent="center" alignItems="start">
                                    <Image
                                        src={project.image !== undefined ? API_BASE + "/" + project.image : API_BASE + "/" + "uploads/projects/sample.jpg"}
                                        h={200} objectFit="cover"
                                        alt={project.image} borderRadius="md"/>
                                    <Heading as="h2" size="xl" mb={2}>{project.name}</Heading>
                                    <Text as="h4" size="md" mb={2}>{project.description}</Text>
                                    <Badge colorPalette="purple" mb={2}>{project.type}</Badge>
                                </Flex>
                                <Circle size={3} position="absolute" top={2} right={2}
                                        bg={project.status === 'active' ? 'green.700' : 'yellow.700'}>
                                </Circle>

                                {/*    Assign Users button and View Tasks button*/}
                                <Flex justifyContent="flex-end" gap={2}>
                                    <DialogRoot key={"au" + index} placement={'center'}>
                                        <DialogTrigger asChild>
                                            <Button
                                                colorPalette="green"
                                                variant="subtle"
                                                cursor="pointer"
                                                boxShadow="md"
                                            >
                                                Collaborate
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Collaborate Confirmation</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                <Text>
                                                    Collaborate with this project?
                                                </Text>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger>
                                                    <Button colorPalette="green" variant="subtle"
                                                            onClick={() => collaborateToThisProject(project._id)}>
                                                        Yes
                                                    </Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger>
                                                    <Button colorPalette="red" variant="subtle">
                                                        No
                                                    </Button>
                                                </DialogActionTrigger>
                                            </DialogFooter>
                                        </DialogContent>
                                    </DialogRoot>
                                    <Button
                                        colorPalette="blue"
                                        variant="subtle"
                                        cursor="pointer"
                                        boxShadow="md"
                                        onClick={() => navigateToTasks(project)}
                                    >
                                        View Tasks
                                    </Button>
                                </Flex>
                            </Flex>
                        ))}
                    </Grid>
                </Flex>
                <Flex
                    flexDir="column"
                    w={'500px'}
                    h={'calc(100vh - 70px)'}
                    display="flex"
                    alignItems="start"
                    justifyContent="start"
                    p={2}
                    borderLeft="1px solid"
                    position="relative"
                >
                    <Heading as="h1" size="xl" my={3} w="full" textAlign="center">
                        Collaboration Requests
                    </Heading>
                    <Flex w="full" p={2} justifyContent="space-between" flexDir="column" gap={2}>
                        {collaborateRequests && collaborateRequests.map((request, index) => (
                            <Box
                                key={index}
                                mb={6}
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                <Heading as="h2" size="xl" mb={2}>
                                    {request.project.name} : Collaboration Request From Admin
                                </Heading>
                                <Text as="h4" size="md" mb={2}>
                                    {request.project.description}
                                </Text>
                                <Badge colorPalette="purple" mb={2}>
                                    {request.project.type}
                                </Badge>
                                <Flex justifyContent="flex-end" gap={2}>
                                    <Button
                                        colorPalette="green"
                                        variant="subtle"
                                        cursor="pointer"
                                        boxShadow="md"
                                        onClick={() => acceptCollaborateUserRequest(request.project._id)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        colorPalette="red"
                                        variant="subtle"
                                        cursor="pointer"
                                        boxShadow="md"
                                        onClick={() => rejectCollaborateUserRequest(request.project._id)}
                                    >
                                        Reject
                                    </Button>
                                </Flex>
                            </Box>
                        ))}
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default UserProject