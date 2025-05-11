import cron from "node-cron";
import mongoose from "mongoose";
import moment from "moment";
import Task from "./model/Task.js"; // Ensure your model paths are correct
import Notification from "./model/Notification.js";

console.log("Starting cron job...");

// Cron job runs every day at midnight
cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Checking for tasks due in 2 days...");

        // Get date 2 days from now
        const twoDaysAhead = moment().add(2, "days").startOf("day").toDate();

        // Find tasks due in exactly 2 days
        const tasks = await Task.find({ dueDate: twoDaysAhead });

        for (let task of tasks) {
            // Create a notification for each task
            await Notification.create({
                taskId: task._id,
                message: `Task "${task.name}" is due in 2 days!`,
                userId: task.assignedTo, // Assuming tasks are assigned to users
                createdAt: new Date()
            });

            console.log(`Notification added for task: ${task.title}`);
        }

    } catch (error) {
        console.error("Error in cron job:", error);
    }
});

export default cron;
