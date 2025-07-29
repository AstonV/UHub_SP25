import React, {useEffect, useState} from "react";
import {
    Badge,
    Box,
    CheckboxGroup,
    Fieldset,
    Flex,
    Grid,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    Textarea
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
import {useLocation, useNavigate} from "react-router-dom";
import {
    NativeSelectField,
    NativeSelectRoot,
} from "@/components/ui/native-select"
import {createListCollection} from "@chakra-ui/react"
import {MdCalendarMonth, MdCalendarViewDay, MdCheckCircle} from "react-icons/md";
import {Toaster, toaster} from "../components/ui/toaster"
import {
    addTaskToProject,
    assignTaskToUser,
    completeTask,
    deleteTask,
    fetchTasksForProject
} from "@/services/projectService.js";
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverFooter,
    PopoverRoot,
    PopoverTrigger
} from "@/components/ui/popover.jsx";
import {FaFilter} from "react-icons/fa6";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import AdminTaskCalender from "@/components/AdminTaskCalender.jsx";

const items = [
    {value: "personal", label: "Personal"},
    {value: "group", label: "Group"}
]

const priority = [
    {value: "low", label: "Low"},
    {value: "medium", label: "Medium"},
    {value: "high", label: "High"}
]

const Tasks = () => {
    const [tasks, setTasks] = useState([])
    const location = useLocation()
    const {project} = location.state
    const projectId = project._id
    const [isAdmin, setIsAdmin] = useState(false)
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null



    const navigate =
        useNavigate()

    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        type: '',
        priority: '',
        from_date: '',
        due_date: '',
    })


    const [open, setOpen] = useState(false)

    const loadTasks = async () => {
        const res = await fetchTasksForProject(projectId)
        console.log(res)
        if (res) {
            setTasks(res.tasks)
        }
    }

    const checkAdmin = () => {
        if (localStorage.getItem('user') !== null) {
            const user = JSON.parse(localStorage.getItem('user'))
            if (user.role === 'admin') {
                setIsAdmin(true)
            }
        }
    }

    useEffect(() => {
        loadTasks()
        checkAdmin()
    }, [])

    const handleAddTask = async () => {
        //validate Task
        if (!newTask.name || !newTask.description || !newTask.type || !newTask.due_date || !newTask.from_date || !newTask.priority) {
            toaster.error({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return
        }

        //validate from date and due date
        if (new Date(newTask.from_date) > new Date(newTask.due_date)) {
            toaster.error({
                title: 'Error',
                description: 'From Date cannot be greater than Due Date',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return
        }

        const res = await addTaskToProject(projectId, {
            name: newTask.name,
            description: newTask.description,
            status: 'todo',
            assignedTo: 'user',
            priority: newTask.priority,
            type: newTask.type,
            fromDate: newTask.from_date,
            dueDate: newTask.due_date
        })
        if (res) {
            loadTasks()
            setOpen(false)
        }
    }


    const viewTasks = (project) => {
        navigate('/tasks', {state: {project}})
    }

    const completeTheTask = async (task) => {
        const res = await completeTask(projectId, task._id)
        if (res) {
            loadTasks()
            toaster.success({
                title: 'Success',
                description: 'Task Completed',
            })
        }
    }

    const getDateTime = (date) => {
        let d = new Date(date)
        const formattedDate = d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        return formattedDate
    }

    const makeFirstLetterUpperCase = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getTaskStatusBasedOnStatus(status) {
        if (status === 'todo') {
            return 'Pending'
        } else if (status === 'ongoing') {
            return 'Ongoing'
        } else {
            return 'Completed'
        }
    }

    const getColorByTaskStatus = (status) => {
        if (status === 'todo') {
            return 'yellow'
        } else if (status === 'ongoing') {
            return 'yellow'
        } else {
            return 'green'
        }
    }

    const deleteTaskById = async (taskId) => {
        const res = await deleteTask(projectId, taskId)
        if (res) {
            loadTasks()
            toaster.success({
                title: 'Success',
                description: 'Task Deleted',
            })
        }
    }

    const assignTask = async (task) => {
        const res = await assignTaskToUser(task._id)
        if (res) {
            loadTasks()
            toaster.success({
                title: 'Success',
                description: 'Task Assigned',
            })
        }

    }

    return (
        <>
            <Toaster/>
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
                    <Flex flexDir="column" justifyContent="center" alignItems="start" gap={2}>
                        <Heading as="h1" size="4xl" textAlign="center">
                            {project.name} Project Tasks
                        </Heading>
                        <Text as="h2" size="md">
                            {project.description}
                        </Text>
                        <Badge variant="subtle" colorPalette="purple">
                            {project.type.toString().toUpperCase()} PROJECT
                        </Badge>
                        <Flex>
                            <Badge variant="subtle" colorPalette="green">
                                {project.start_date !== undefined ? getDateTime(project.start_date) : 'Start Date'}
                            </Badge>
                            <Text mx={2}>-</Text>
                            <Badge variant="subtle" colorPalette="red">
                                {project.end_date !== undefined ? getDateTime(project.end_date) : 'End Date'}
                            </Badge>
                        </Flex>
                    </Flex>

                    {isAdmin && (
                        <DialogRoot>
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
                                    Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Task</DialogTitle>
                                    <DialogCloseTrigger/>
                                </DialogHeader>
                                <DialogBody>
                                    <Stack spacing={4}>
                                        <Flex w="full" justifyContent="space-between">
                                            <Flex w="full" gap={2} alignItems="center" justifyContent="center">
                                                <Text w={'200px'} as="h3" size="md">Task Name</Text>
                                                <Input variant="subtle" placeholder="Task Name"
                                                       onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                                                       value={newTask.name}/>
                                            </Flex>
                                        </Flex>
                                        <Flex w="full" justifyContent="space-between">
                                            <Flex w="full" gap={2} alignItems="center" justifyContent="center">
                                                <Text w={'200px'} as="h3" size="md">Description</Text>
                                                <Textarea variant="subtle" placeholder="Description"
                                                          onChange={(e) => setNewTask({
                                                              ...newTask,
                                                              description: e.target.value
                                                          })}
                                                          value={newTask.description}/>
                                            </Flex>
                                        </Flex>
                                        <Flex w="full" justifyContent="space-between">
                                            <Flex w="full" gap={2} alignItems="center" justifyContent="center">
                                                <Text w={'200px'} as="h3" size="md">Type</Text>
                                                <NativeSelectRoot variant="subtle" placeholder="Type"
                                                                  onChange={(e) => setNewTask({
                                                                      ...newTask,
                                                                      type: e.target.value
                                                                  })}
                                                                  value={newTask.type}>
                                                    <NativeSelectField placeholder="Select Type" items={items}/>
                                                </NativeSelectRoot>
                                            </Flex>
                                        </Flex>
                                        <Flex w="full" justifyContent="space-between">
                                            <Flex w="full" gap={2} alignItems="center" justifyContent="center">
                                                <Text w={'200px'} as="h3" size="md">Priority</Text>
                                                <NativeSelectRoot variant="subtle" placeholder="Priority"
                                                                  onChange={(e) => setNewTask({
                                                                      ...newTask,
                                                                      priority: e.target.value
                                                                  })} value={newTask.priority}>
                                                    <NativeSelectField placeholder="Select Priority" items={priority}/>
                                                </NativeSelectRoot>
                                            </Flex>
                                        </Flex>
                                        <Flex w="full" justifyContent="space-between">
                                            <Flex w="full" gap={2} alignItems="center" justifyContent="center">
                                                <Text w={'200px'} as="h3" size="md">From Date</Text>
                                                <Input variant="subtle" placeholder="Date" type="date"
                                                       min={new Date().toISOString().split('T')[0]}
                                                       onChange={(e) => setNewTask({
                                                           ...newTask,
                                                           from_date: e.target.value
                                                       })}
                                                       value={newTask.from_date}/>
                                            </Flex>
                                        </Flex>
                                        <Flex w="full" justifyContent="space-between">
                                            <Flex w={'full'} gap={2} alignItems="center" justifyContent="center">
                                                <Text w={'200px'} as="h3" size="md">Due Date</Text>
                                                <Input variant="subtle" placeholder="Date" type="date"
                                                       min={new Date().toISOString().split('T')[0]}
                                                       onChange={(e) => setNewTask({
                                                           ...newTask,
                                                           due_date: e.target.value
                                                       })}
                                                       value={newTask.due_date}/>
                                            </Flex>
                                        </Flex>

                                    </Stack>
                                </DialogBody>
                                <DialogFooter>
                                    <DialogActionTrigger>
                                        <Button variant="surface" colorPalette="blue" onClick={handleAddTask}>Add
                                            Task</Button>
                                    </DialogActionTrigger>
                                </DialogFooter>
                            </DialogContent>
                        </DialogRoot>
                    )}

                </Flex>
                <Grid
                    templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                    w="full"
                    p={6}
                    gap={6}
                    maxH={isAdmin ? "435px" : "auto"}
                    minH={isAdmin ? "435px" : 'auto'}
                    overflowY="auto"
                >

                    {tasks && tasks.map((task, index) => (
                        <Box
                            position={"relative"}
                            h={"full"}
                            key={index} mb={6} p={4} borderRadius="md" boxShadow="md" border="1px solid"
                            borderColor="gray.200">
                            <Heading as="h2" size="xl" mb={2}>{task.name}</Heading>
                            {task.description.length > 100 ? (
                                <PopoverRoot>
                                    <PopoverTrigger asChild>
                                        <Text as="h3" size="md" mb={2}>{task.description.slice(0, 50)}...</Text>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow/>
                                        <PopoverBody>
                                            <Fieldset.Root>
                                                <Text as="h3" size="md" mb={2}>{task.description}</Text>
                                            </Fieldset.Root>
                                        </PopoverBody>
                                    </PopoverContent>
                                </PopoverRoot>
                            ) : (
                                <Text as="h3" size="md" mb={2}>{task.description}</Text>
                            )}
                            <Flex w="full" justifyContent="start" gap={1}>
                                <Badge variant="outline"
                                       colorPalette={task.priority === 'low' ? 'green' : task.priority === 'medium' ? 'yellow' : 'red'}>
                                    {makeFirstLetterUpperCase(task.priority)} Priority
                                </Badge>
                            </Flex>

                            {/*Button For Approval*/}
                            <Flex w="full" justifyContent="flex-start" mt={4}>
                                <Badge variant="ghost" colorPalette={'purple'}>
                                    <MdCalendarMonth/>
                                    {getDateTime(task.fromDate)}</Badge>
                                -
                                <Badge variant="ghost" colorPalette={'purple'}>
                                    <MdCalendarMonth/>
                                    {getDateTime(task.dueDate)}</Badge>
                            </Flex>

                            <Flex w="full" justifyContent="flex-end" gap={2} position="absolute" top={1} right={1}>
                                {!isAdmin && task.assignedTo && task.assignedTo._id === userId && task.status !== 'completed'  && (
                                    <DialogRoot placement="center">
                                        <DialogTrigger asChild>
                                            <Button variant="subtle"
                                                    colorPalette={getColorByTaskStatus(task.status)}
                                                    size="xs"
                                            >
                                                <MdCheckCircle/>
                                                {getTaskStatusBasedOnStatus(task.status)}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Mark As Completed</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                <p>
                                                    Are you sure you want to mark this task as completed?
                                                </p>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="outline">No</Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger asChild>

                                                    <Button
                                                        colorPalette="green"
                                                        variant="subtle"
                                                        onClick={() => completeTheTask(task)}> <MdCheckCircle/>Yes</Button>
                                                </DialogActionTrigger>
                                            </DialogFooter>
                                            <DialogCloseTrigger/>
                                        </DialogContent>
                                    </DialogRoot>
                                )}
                                {!isAdmin && task.assignedTo && task.assignedTo._id === userId && task.status === 'completed' && (
                                    <Badge variant="subtle" colorPalette="green"  p={2}>
                                        <MdCheckCircle/>
                                        Completed
                                    </Badge>
                                )}
                                {isAdmin && task.assignedTo && task.status === 'completed' && (
                                    <Badge variant="subtle" colorPalette="green"  p={2}>
                                        <MdCheckCircle/>
                                        Completed
                                    </Badge>
                                )}
                                {!isAdmin && task.assignedTo == null && (
                                    <DialogRoot placement="center">
                                        <DialogTrigger asChild>
                                            <Button variant="subtle"

                                                    colorPalette={'blue'}
                                                    size="xs"
                                            >
                                                Assign To Me
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Assign Task</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                <p>
                                                    Are you sure you want to assign this task to yourself?
                                                </p>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="outline">No</Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger asChild>

                                                    <Button
                                                        colorPalette="green"
                                                        variant="subtle"
                                                        onClick={() => assignTask(task)}> <MdCheckCircle/>Yes</Button>
                                                </DialogActionTrigger>
                                            </DialogFooter>
                                            <DialogCloseTrigger/>
                                        </DialogContent>
                                    </DialogRoot>
                                )}

                                {/*    Allow Admin to delete task*/}
                                {isAdmin && task.status == 'todo' && task.assignedTo === null && (
                                    <DialogRoot placement="center">
                                        <DialogTrigger asChild>
                                            <Button variant="subtle" colorPalette="red" size="xs">
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete Task</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                <p>
                                                    Are you sure you want to delete this task?
                                                </p>
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="outline">No</Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="subtle" colorPalette="red"
                                                            onClick={() => deleteTaskById(task._id)}>
                                                        Yes
                                                    </Button>
                                                </DialogActionTrigger>
                                            </DialogFooter>
                                            <DialogCloseTrigger/>
                                        </DialogContent>
                                    </DialogRoot>
                                )}

                            </Flex>


                            {/*<Heading as="h4" size="md" mb={2}>Type: {task.type}</Heading>*/}
                            {/*<Heading as="h4" size="md" mb={2}>Skill Level: {task.skill_level}</Heading>*/}
                            {/*<Heading as="h4" size="md" mb={2}>Subject: {task.subject}</Heading>*/}
                            {/*<Heading as="h4" size="md" mb={2}>Status: {task.status}</Heading>*/}


                        </Box>

                    ))}

                </Grid>
                {isAdmin && tasks.length !== 0 && (
                    <AdminTaskCalender projectTasks={tasks} projectId={projectId}/>
                )}

                {tasks.length === 0 && (
                    <Flex w="full" justifyContent="center" alignItems="center" p={6} borderRadius="md"
                          h={"200px"}
                          boxShadow="md"
                          border="1px solid" borderColor="gray.200">
                        <Text as="h2" size="md">No Tasks Found</Text>
                    </Flex>
                )}
            </Flex>
        </>
    )
}

export default Tasks