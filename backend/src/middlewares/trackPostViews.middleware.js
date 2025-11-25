import { ApiError } from "../utils/apiError.js";
import { Analytics } from "../models/analytics.model.js";
import { Post } from "../models/post.model.js"; // Import Post model
import mongoose from "mongoose";

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const trackPostVisit = async (req, res, next) => {
    try {
        const { postId } = req.params;
    
        // 1. Validate the Post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
          throw new ApiError(400,"Invalid Post ID")
        }

        // --- FIX START: Increment the global counter on the Post model ---
        await Post.findByIdAndUpdate(postId, { 
            $inc: { postViews: 1 } 
        });
        // --- FIX END ---
    
        const today = getStartOfToday();
        const updatedDoc = await Analytics.findOneAndUpdate(
          {
            date: today,
            "postInteractions.postId": postId,
          },
          {
            $inc: { "postInteractions.$.views": 1 },
          },
          {
            new:true,
            upsert:false
          }
        ).exec();
    
        if (!updatedDoc) {
          await Analytics.findOneAndUpdate(
            { date:today },
            {
              $push: { postInteractions: {postId, views: 1 } },
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert:true,
                $setOnInsert: { date: today }
            }
          ).exec();
        }
        
        next(); 
    } catch (error) {
        console.error("Analytics tracking failed:", error);
        next(); 
    }
}