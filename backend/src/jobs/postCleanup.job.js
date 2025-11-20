import cron from "node-cron";
import { Post } from "../models/post.model.js";

export const startPostCleanupJob = () => {
    // Schedule task to run at 00:00 (Midnight) every day
    // Format: Second Minute Hour Day Month DayOfWeek
    cron.schedule('0 0 0 * * *', async () => {
        console.log('⏰ Running daily post cleanup job...');
        
        try {
            const now = new Date();
            
            // Find posts where lastDate is less than (<) now AND are currently active
            const result = await Post.updateMany(
                { 
                    lastDate: { $lt: now }, 
                    isActive: true 
                },
                { 
                    $set: { isActive: false } 
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Deactivated ${result.modifiedCount} expired posts.`);
            } else {
                console.log('👍 No expired posts found today.');
            }
            
        } catch (error) {
            console.error('❌ Error in post cleanup job:', error);
        }
    });
};