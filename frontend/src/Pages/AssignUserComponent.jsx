import {useEffect, useState} from "react";
import {assignUsersToProject, getSuggestedUsers} from "@/services/projectService.js";
import {Badge, CheckboxGroup, Flex, Grid, Heading, Input, Text} from "@chakra-ui/react";
import {CheckboxCard} from "@/components/ui/checkbox-card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {toaster} from "@/components/ui/toaster.jsx";

const AssignUserComponent = ({project}) => {

    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [allSuggestedUsers, setAllSuggestedUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);

    const loadSuggestedUsers = async (projectID) => {
        try {
            const res = await getSuggestedUsers(projectID);

            setSuggestedUsers(res);
            setAllSuggestedUsers(res);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        loadSuggestedUsers(project._id);
    }, []);

    const searchSuggestions = (search) => {
        if (search === "") {
            setSuggestedUsers(allSuggestedUsers);
        } else {
            const filteredUsers = allSuggestedUsers.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
            setSuggestedUsers(filteredUsers);
        }
    }
    const assignUsers = async (projectID, users) => {
        console.log(users,projectID);
        const res = await assignUsersToProject(projectID, users);
        if (res) {
            toaster.success({
                title: 'Success',
                description: 'Users assigned successfully',
            });
        } else {
            toaster.error({
                title: 'Error',
                description: 'Failed to assign users',
            });
        }
    }

    return (
        <Flex flexDir="column" gap={2}>
            <Flex flexDir="column" borderRadius="md" boxShadow="md" gap={1} border="0.05px solid" p={2}>
                <Text size="md"><strong>Project Name:</strong> {project.name}</Text>
                <Text size="md"><strong>Project Description:</strong> {project.description} </Text>
            </Flex>
            <Flex flexDir="column" borderRadius="md" boxShadow="md" gap={1} border="0.05px solid" p={2}>
                <Heading as="h4" size="sm"> Required Skills</Heading>
                <Flex flexWrap="wrap" maxH="300px" overflowY="auto">
                    {project && project.skills.map(skill => (
                        <Badge key={skill._id} colorPalette="green" size={"md"} m={1}>
                            # {skill.name}
                        </Badge>
                    ))}
                </Flex>
            </Flex>
            <Flex flexDir="column" borderRadius="md" boxShadow="md" gap={4} border="0.2px solid" p={4}>
                <Heading as="h2" size="lg"
                         textAlign="center"
                >Recommnended Users</Heading>
                <Input placeholder="Search Users" onChange={(e) => searchSuggestions(e.target.value)}/>

                <CheckboxGroup defaultValue={project.collaborators}>
                    <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={6} maxH="600px" overflowY="auto">
                        {suggestedUsers && suggestedUsers.map(user => (
                            <CheckboxCard
                                label={user.name}
                                description={user.email}
                                key={user._id}
                                value={user._id}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAssignedUsers([...assignedUsers, user._id]);
                                    } else {
                                        const updatedUsers = assignedUsers.filter(assignedUser => assignedUser !== user._id);
                                        setAssignedUsers(updatedUsers);
                                    }
                                }}
                            />
                        ))}
                    </Grid>
                </CheckboxGroup>
            </Flex>
            <Flex justifyContent="center" mt={3}>
                <Button colorPalette="blue" variant={'subtle'} onClick={() => assignUsers(project._id, assignedUsers)}>Assign Users</Button>
            </Flex>
        </Flex>
    );
}

export default AssignUserComponent;