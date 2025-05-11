import api from "@/services/api.js";


const getAllProjects = async () => {
    try {
        const  res =await  api.get('/admin/projects')
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const getAllNonCollaborateProjects = async () => {
    try {
        const  res =await  api.get('/projects/get-all')
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const getAllProjectCollaborateRequest = async () => {
    try {
        const  res =await  api.get('/admin/collaboration-request')
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const getCollaborateProjects = async () => {
    try {
        const  res =await  api.get('/projects/get-all-collaborate')
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const getSuggestedUsers = async (projectID) => {
    try {
        const  res =await  api.get('/admin/suggestUsers/'+projectID)
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const assignUsersToProject = async (projectID, users) => {
    try {
        const  res =await  api.post('/projects/request/'+projectID+'', {
            userIds: users
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const getUserCollaborateRequest = async () => {
    try {
        const  res =await  api.get('/profile/collaboration-request')
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const acceptCollaborateRequest = async (projectID) => {
    try {
        const  res =await  api.post('/profile/project/'+projectID,{
            action: 'accept'
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const rejectCollaborateRequest = async (projectID) => {
    try {
        const  res =await  api.post('/profile/project/'+projectID,{
            action: 'reject'
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const assignToProject = async (requestID) => {
    try {
        const  res =await  api.post('/admin/collaboration-request/'+requestID,{
            action: 'accept'
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}
const declineToProject = async (requestID) => {
    try {
        const  res =await  api.post('/admin/collaboration-request/'+requestID,{
            action: 'reject'
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const CalloborateRequestAccept = async (projectID, users) => {
    try {
        const  res =await  api.post('/projects/'+projectID+'/assign', {
            users: users
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}


const deleteProject = async (projectId) => {
    try {
        const  res =await  api.delete('/projects/'+projectId)
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const createProject = async (project) => {
    try {
        const  res =await  api.post('/admin/project',{
            name: project.name,
            description: project.description,
            type: project.type,
            skills: project.skills,
            start_date: project.start_date,
            end_date: project.end_date,
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const uploadProjectImage = async (projectID, image) => {
    try {
        const formData = new FormData()
        formData.append('image', image)
        const  res =await  api.post('/projects/'+projectID +'/upload-image'
            ,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    }catch (e) {
        console.log(e)
    }
}

const addTaskToProject = async (projectId, taskData) => {
    try {
        const response = await api.post(`/projects/${projectId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

const completeTask = async (projectId, taskId) => {
    try {
        const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Error completing task:', error);
    }
}

const deleteTask = async (projectId, taskId) => {
    try {
        const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

const fetchTasksForProject = async (projectId) => {
    try {
        const response = await api.get(`/projects/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

const collaborateProject = async (projectId) => {
    try {
        const response = await api.post(`/projects/${projectId}/collaborate`, {
            id:projectId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding collaborator:', error);
    }
}

const getAllTasks = async () => {
    try {
        const response = await api.get(`/profile/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

const assignTaskToUser = async (taskId) => {
    try {
        const response = await api.post(`/projects/self-assign/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error assigning task:', error);
    }
}



export {getAllProjects,deleteTask,
    CalloborateRequestAccept,
    acceptCollaborateRequest,
    declineToProject,
    assignToProject,
    rejectCollaborateRequest,
    getAllProjectCollaborateRequest,
    getSuggestedUsers,assignTaskToUser,getUserCollaborateRequest,getAllTasks,assignUsersToProject,createProject,uploadProjectImage,addTaskToProject,completeTask,fetchTasksForProject,collaborateProject,getAllNonCollaborateProjects,getCollaborateProjects,deleteProject}