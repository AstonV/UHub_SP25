import express from 'express';
import Project from '../model/Project.js';
import ProjectCollaborationRequest from '../model/Requests.js';
import {authenticate} from '../middleware/authenticate.js';
import multer from "multer";
import path from 'path';
import Task from "../model/Task.js";
import jwt from "jsonwebtoken";
import Skills from "../model/Skills.js";
import Notification from "../model/Notification.js";
import User from "../model/User.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/projects'); // Directory for storing images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage});




// Route to upload project image
router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
    const {id} = req.params;
    const imagePath = req.file.path;

    try {
        const project = await Project.findByIdAndUpdate(id, {image: imagePath}, {new: true});
        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }
        res.status(200).json({message: 'Image uploaded successfully', project});
    } catch (error) {
        res.status(500).json({message: 'Error uploading image', error});
    }
});

// Get All Project that user not colloborate
router.get('/get-all', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const projects = await Project.find({collaborators: {$nin: [userID]}});
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

//Get All User Colloborate Project
router.get('/get-all-collaborate', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const projects = await Project.find({collaborators: {$in: [userID]}});
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
})

//Get Image by project ID
router.get('/:id/image', async (req, res) => {
    const {id} = req.params;

    try {
        const project = await Project.findById(id);
        if (!project || !project.image) {
            return res.status(404).json({message: 'Image not found'});
        }

        // Send the image file
        const imagePath = path.resolve(project.image);
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving image', error});
    }
});
// Create a new project
router.post('/', authenticate, async (req, res) => {
    const {name, description, priority, start_date, end_date} = req.body;
    try {
        const project = new Project({
            name,
            description,
            creator: req.user.id,
            priority,
            start_date,
            end_date
        });

        //get all users based on skills
        const skills = await Skills.find({skills: {$in: project.skills}});
        const users = skills.map(skill => skill.user);

        // Add notification to all users
        for (const user of users) {
            const notification = new Notification({
                user,
                message: `New project created: ${project.name}`,

            });
            await notification.save();
        }


        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

// Get all projects
router.get('/', authenticate, async (req, res) => {
    try {
        const projects = await Project.find({creator: req.user.id});
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

// Get a single project by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({message: 'Project not found'});

        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

// Update a project
router.put('/:id', authenticate, async (req, res) => {
    const {name, description, status, collaborators} = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({message: 'Project not found'});

        if (project.creator.toString() !== req.user.id) {
            return res.status(403).json({message: 'Only the creator can update the project'});
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.status = status || project.status;
        project.collaborators = collaborators || project.collaborators;

        await project.save();
        res.status(200).json({message: 'Project updated successfully'});
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

// Add a task to a project
router.post('/:projectId/tasks', async (req, res) => {
    try {
        const {projectId} = req.params;
        const {name, description, status, dueDate, priority, fromDate} = req.body;


        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }

        console.log("From Date", fromDate);

        // Create a new task
        const task = new Task({
            name,
            description,
            status,
            assignedTo: null,
            priority,
            dueDate,
            fromDate,
            project: projectId
        });

        // Save the task
        const savedTask = await task.save();


        // Add task to the project's task list
        project.tasks.push(savedTask._id);
        await project.save();

        res.status(201).json({message: 'Task added successfully', task: savedTask});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

//Complete a task
router.patch('/:projectId/tasks/:taskId/complete', async (req, res) => {
    try {
        const {projectId, taskId} = req.params;

        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        // Update the task status
        task.status = 'completed';
        await task.save();

        res.status(200).json({message: 'Task completed successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// Get tasks for a project
router.get('/:projectId/tasks', async (req, res) => {
    try {
        const {projectId} = req.params;

        // Find the project and populate its tasks
        const tasks = await Task.find({project: projectId}, {project: 0}).populate('assignedTo');
        if (!tasks) {
            return res.status(404).json({error: 'Project not found'});
        }



        res.status(200).json({tasks: tasks});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

//Assign Users to a project
router.post('/:projectId/assign', async (req, res) => {
    try {
        const {projectId} = req.params;
        const {users} = req.body;

        // Find the project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        // Assign users to the project
        project.collaborators = users;
        await project.save();

        const assignedUsers = await User.find({_id: {$in: users}});
        for (const user of assignedUsers) {
            const notification = new Notification({
                user,
                message: `Assigned to project: ${project.name}`,
            });
            await notification.save();
        }
        res.status(200).json({message: 'Users assigned successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// Delete a project
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({message: 'Project not found'});

        await project.deleteOne();
        res.status(200).json({message: 'Project deleted successfully'});
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

// Delete a task
router.delete('/:projectId/tasks/:taskId', async (req, res) => {
    try {
        const {projectId, taskId} = req.params;

        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        // Delete the task
        await task.deleteOne();

        // Remove the task from the project's task list
        const project = await Project.findById(projectId);
        project.tasks = project.tasks.filter(taskId => taskId.toString() !== task._id.toString());
        await project.save();

        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

//Colloborate to a project
router.post('/:id/collaborate', authenticate, async (req, res) => {
    try {
        const {id} = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({message: 'Project not found'});

        const isCollaborator = project.collaborators.includes(userID);
        if (isCollaborator) return res.status(400).json({message: 'User is already a collaborator'});
        const user = await User.findById(userID);

        const request = new ProjectCollaborationRequest({
            user: user._id,
            type: 'user',
            project: project._id,
            status: 'pending'
        });

        const adminUserID = await User.findOne({role: 'admin'});
        await request.save()
        const notification = new Notification({
            user : adminUserID,
            message: `Request to add as a collaborator to project: ${project.name}`,
        });
        await notification.save();
        res.status(200).json({message: 'User added as a collaborator'});

    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});
router.post('/:id/accept-collaborate', authenticate, async (req, res) => {
    try {
        const {id} = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({message: 'Project not found'});

        const isCollaborator = project.collaborators.includes(userID);
        if (isCollaborator) return res.status(400).json({message: 'User is already a collaborator'});

        project.collaborators.push(userID);
        project.start_date = project.start_date || new Date();
        project.end_date = project.end_date || new Date();
        await project.save();
        const user = await User.findById(userID);
        const notification = new Notification({
            user,
            message: `Added as a collaborator to project: ${project.name}`,
        });
        await notification.save();
        res.status(200).json({message: 'User added as a collaborator'});

    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

// Colooborate request
router.get('/collaborate-request', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const projects = await Project.find({collaborators: {$nin: [userID]}});
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

//self assign task
router.post('/self-assign/:taskId', authenticate, async (req, res) => {
    try {
        const {taskId} = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({message: 'Task not found'});

        task.assignedTo = userID;

        await task.save();

        res.status(200).json({message: 'Task assigned successfully', task});

    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

//assigned Projects
router.get('/assigned-projects', authenticate, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message: 'Access token is missing'});

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userID = decoded.id;
        const projects = await Project.find({collaborators: {$in: [userID]}});
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});

//create request for project
router.post('/request/:projectId', authenticate, async (req, res) => {
    try {
        const {projectId} = req.params;
        const {userIds} = req.body;
        const project = await Project.findById(projectId);
        const users = await User.find({_id: {$in: userIds}});

        //set ProjectCollaborationRequest
        for (const user of users) {
            const request = new ProjectCollaborationRequest({
                user: user._id,
                project: project._id,
                status: 'pending'
            });
            await request.save();
            const notification = new Notification({
                user: user._id,
                message: `Request to join project: ${project.name}`,
            });
            await notification.save();
        }

        res.status(200).json({message: 'Request sent successfully'});



    } catch (err) {
        res.status(500).json({message: 'Internal server error', error: err.message});
    }
});





export default router;
