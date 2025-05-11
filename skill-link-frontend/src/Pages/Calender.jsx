import {useEffect, useState} from "react";
import {Box, Text, Button, Flex, Badge} from "@chakra-ui/react";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "react-calendar/dist/Calendar.css";
import {useColorMode} from "@/components/ui/color-mode.jsx";
import {getAllTasks} from "@/services/projectService.js";

const colors = ["red.300", "blue.300", "green.300", "yellow.300", "purple.300", "pink.300", "cyan.300", "teal.300", "orange.300", "gray.300"];
const projectColors = ["red", "blue", "green", "yellow", "purple", "pink", "cyan", "teal", "orange", "gray"];

const ProjectCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [assignedProjectColors, setAssignedProjectColors] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const datesOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const colorMode = useColorMode();


    useEffect(() => {
        getAllTasks().then((data) => {
            const assignedColors = [];
            data.forEach((task, index) => {
                task.color = colors[index % colors.length];
                const projectIndex = assignedProjectColors.findIndex((color) => color.projectId === task.project._id);
                if (projectIndex === -1) {
                    assignedColors.push({projectId: task.project._id, color: projectColors[assignedColors.length % projectColors.length]});
                }
                task.projectColor = assignedColors.find((color) => color.projectId === task.project._id).color;
            })
            setAssignedProjectColors(assignedColors);

            // data * 200
            // const repeatedData = Array(200).fill(data).flat();


            // setTasks(repeatedData);
            setTasks(data);
        })
    },[])



    const handleDateClick = (date) => {
        const selectedDate = date.toISOString().split("T")[0];
        const taskForDate = tasks.filter((task) => task.dueDate === selectedDate);
        if (taskForDate.length > 0) {
            setSelectedTask(taskForDate[0]);
        }
    };

    const calculateDatesOfTheWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(monday));
            monday.setDate(monday.getDate() + 1);
        }
        return dates
    }

    const getColoringBasedOnFromAndDueDate = (task, date) => {
        let fromDate = new Date(task.fromDate);
        fromDate = fromDate.setHours(0, 0, 0, 0);
        //day before the fromDate
        // fromDate = new Date(fromDate - 86400000);
        let dueDate = new Date(task.dueDate);
        dueDate = dueDate.setHours(0, 0, 0, 0);
        //day after the dueDate
        dueDate = new Date(dueDate + 86400000);
        if (date >= fromDate && date <= dueDate) {
            return colorMode.colorMode === "light" ? task.color : `${task.color.split(".")[0]}.700`;
        }
        return "transparent";
    }

    function getLeftPosition(task, date) {
        let fromDate = new Date(task.fromDate);
        fromDate = fromDate.setHours(0, 0, 0, 0);
        //day before the fromDate
        fromDate = new Date(fromDate - 86400000);
        let dueDate = new Date(task.dueDate);
        dueDate = dueDate.setHours(0, 0, 0, 0);
        //day after the dueDate
        dueDate = new Date(dueDate + 86400000);
        const diffInDays = Math.floor((dueDate - fromDate) / 86400000);
        return `${diffInDays * 14.28}%`;
    }

    return (
        <Box p={4} w="100%">
            <Text fontSize="2xl" mb={4}>Project Calendar</Text>
            <Flex w="100%" justify="center" align="center" mb={4} flexDir="column">
                {/*Control the days*/}
                <Flex w="100%" justify="space-between" align="center" mb={2}>
                    <Button
                        colorPalette="blue"
                        variant="subtle"
                        onClick={() => setDate(new Date(date.setDate(date.getDate() - 7)))}>Previous Week</Button>
                    <Text>{date.toDateString()}</Text>
                    <Button
                        colorPalette="blue"
                        variant="subtle" onClick={() => setDate(new Date(date.setDate(date.getDate() + 7)))}>Next Week</Button>
                </Flex>
                {/*Show the date below the day -03/04*/}
                <Flex w="100%"  justify="space-around"  align="center" gap={1}>
                    <Flex w="100%"  pt={2} bg={'gray.200'} _dark={{bg : 'gray.900'}} justify="center" align="center">
                        <Text>&nbsp;</Text>
                    </Flex>
                    {calculateDatesOfTheWeek(date).map((date, index) => (
                        <Flex key={index} bg={'gray.200'} pt={2} _dark={{bg : 'gray.800'}} w="100%" justify="center" align="center">
                            <Text>{date.getDate()}</Text>
                        </Flex>
                    ))}
                </Flex>
        {/*    Date of the week starting from monday*/}
                <Flex w="100%"  justify="space-around" align="center" gap={1}>
                    {/*Task Name*/}
                    <Flex w="100%"  bg={'gray.200'} _dark={{bg : 'gray.900'}} py={3} justify="center" align="center">
                        <Text>Task Name</Text>
                    </Flex>
                    {/*Due Date*/}
                    {datesOfTheWeek.map((day, index) => (
                        <Flex key={index} bg={'gray.200'}  py={3} _dark={{bg : 'gray.700'}} w="100%" justify="center" align="center">
                            <Text>{day}</Text>
                        </Flex>
                    ))}
                </Flex>

                {/*Show the taskS timeline by coloring the task name and due date in the calendar*/}
                {tasks.map((task, index) => (
                    <Flex pos='relative' key={index} w="100%" justify="center" align="center" py={2} bg={task === selectedTask ? 'blue.100' : 'transparent'}
                          borderBottom="1px solid" borderColor="gray.200"
                          _dark={{borderColor : 'gray.700'}}
                    >
                        <Flex w="100%" flexDir={'column'} justify="center" align="start">
                            <Text w="100%" textAlign="left" >
                                {task.name}
                            </Text>
                            <Badge  textAlign="left" fontSize={'0.8rem'} colorPalette={task.projectColor} variant="subtle">
                                {task.project.name}
                            </Badge>
                        </Flex>
                        {calculateDatesOfTheWeek(date).map((date, index) => (
                            <Flex key={index} w="100%" justify="center" align="center" bg={getColoringBasedOnFromAndDueDate(task, date)} >
                                <Flex h={'50px'} p={2}/>
                            </Flex>
                        ))}

                    </Flex>
                ))}



            </Flex>

        </Box>
    );
};

export default ProjectCalendar;
