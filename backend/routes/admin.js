import express from 'express';
import User from '../model/User.js';
import Skills from '../model/Skills.js';
import Project from '../model/Project.js';
import Notification from '../model/Notification.js';
import { authenticate } from '../middleware/authenticate.js';
import ProjectCollaborationRequest from "../model/Requests.js";

const router = express.Router();

// Admin route to get all users
router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find();
        // remove admin user from the list
        users.splice(users.findIndex(user => user.role === 'admin'), 1);
        //populate skills
        for(let i=0; i<users.length; i++){
            let skills = await Skills.find({_id: {$in: users[i].skills}});
            users[i].skills = skills;
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to delete a user
router.delete('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to Create a new project
router.post('/project', authenticate, async (req, res) => {
    const { name, description,type,skills,priority,start_date,end_date} = req.body;
    try {
        const project = new Project({
            name,
            description,
            type,
            skills,
            priority,
            start_date,
            end_date
        });

        await project.save();
        console.log(skills)
        //get all users based on skills
        const s = await Skills.find({_id: {$in: skills}});
        console.log(s)
        const usersWithSkills = await User.find({skills: {$in: s}});
        console.log(usersWithSkills)

        // Add notification to all users
        for (const user of usersWithSkills) {
            const notification = new Notification({
                user,
                message: `New project created: ${project.name}`,

            });
            await notification.save();
        }
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

// Admin route to get all projects
router.get('/projects', authenticate, async (req, res) => {
    try {
        const projects = await Project.find();

        //populate the skills
        for(let i=0; i<projects.length; i++){
            let skills = await Skills.find({_id: {$in: projects[i].skills}});
            projects[i].skills = skills;
        }
        //populate the collaborators
        for(let i=0; i<projects.length; i++){
            let collaborators = await User.find({_id: {$in: projects[i].collaborators}});
            projects[i].collaborators = collaborators;
        }

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//collaboration-request
router.get('/collaboration-request', authenticate, async (req, res) => {
    const { user, project, type } = req.body;
    try {
        const requests = await ProjectCollaborationRequest.find({type: 'user',status: 'pending'}).populate(['project','user']);
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

///admin/collaboration-request/'+requestID
router.post('/collaboration-request/:id', authenticate, async (req, res) => {
    const { action } = req.body; // action can be 'accept' or 'reject'

    try {
        const request = await ProjectCollaborationRequest.findById(req.params.id).populate(['project','user']);
        if (!request) return res.status(404).json({ message: 'Request not found' });



        if (action === 'accept') {
            const project = await Project.findById(request.project);
            //collobarator will be the user who is accepting the request
            project.collaborators.push(request.user);
            await project.save();
            request.status = 'accepted';
            await request.save();
            //Create Notification to User
            const notification = new Notification({
                user:request.user,
                message : "Admin has approved your Collaboration Request for " + request.project.name
            })
            await notification.save();
            res.status(200).json({ message: 'Request accepted' });
        } else if (action === 'reject') {
            request.status = 'rejected';
            await request.save();
            const notification = new Notification({
                user:request.user,
                message : "Admin has declined your Collaboration Request for " + request.project.name
            })
            await notification.save();
            res.status(200).json({ message: 'Request rejected' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

// Suggest Users based on skills
router.get('/suggestUsers/:id', authenticate, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const users = await User.find({skills: {$in: project.skills}});

        //check which users are already assigned to the project

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }

})

// Admin route to approve or delete a project
router.put('/projects/:id', authenticate, async (req, res) => {
    const { action } = req.body; // action can be 'approve' or 'delete'

    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (action === 'approve') {
            project.status = 'approved';
            await project.save();
            res.status(200).json({ message: 'Project approved' });
        } else if (action === 'delete') {
            await project.remove();
            res.status(200).json({ message: 'Project deleted' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to get all notifications
router.get('/notifications', authenticate, async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to send a system-wide notification
router.post('/notifications', authenticate, async (req, res) => {
    const { message } = req.body;

    try {
        const notification = new Notification({
            message,
        });

        await notification.save();
        res.status(201).json({ message: 'System notification sent' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to get analytics data
router.get('/analytics', authenticate, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalNotifications = await Notification.countDocuments();

        res.status(200).json({
            totalUsers,
            totalProjects,
            totalNotifications,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to get all flagged posts
router.get('/posts/flagged', authenticate, async (req, res) => {
    try {
        const flaggedPosts = await Post.find({ status: 'flagged' });
        res.status(200).json(flaggedPosts);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to get all flagged comments
router.get('/comments/flagged', authenticate, async (req, res) => {
    try {
        const flaggedComments = await Comment.find({ status: 'flagged' });
        res.status(200).json(flaggedComments);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to approve a flagged post
router.put('/posts/:id/approve', authenticate, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post approved successfully', post });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to delete a flagged post
router.delete('/posts/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to approve a flagged comment
router.put('/comments/:id/approve', authenticate, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json({ message: 'Comment approved successfully', comment });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Admin route to delete a flagged comment
router.delete('/comments/:id', authenticate, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//Add Skills - request will be an array of skill name and description
router.post('/skills', authenticate, async (req, res) => {
    const { skills } = req.body;
    try {
        const newSkills = await Skills.insertMany(skills);
        res.status(201).json(newSkills);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//Delete a User
router.delete('/users/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;
