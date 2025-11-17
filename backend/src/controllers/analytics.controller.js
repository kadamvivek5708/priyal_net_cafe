import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Analytics } from "../models/analytics.model.js";
import mongoose from "mongoose";    

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const trackPostView = asyncHandler (async (req, res) => {
    const { postId } = req.params;

    // 1. Validate the Post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError(400,"Invalid Post ID")
    }

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
        new:true
      }
    );

    // 3. Step 2: If updatedDoc is null, the post wasn't in the array yet
    if (!updatedDoc) {
      await Analytics.findOneAndUpdate(
        { date:today },
        {
          $push: { postInteractions: {postId, views: 1 } },
        },
        { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert:true
        }
      );
    }
    res.status(204).send();
})

const getAnalyticsSummary = asyncHandler (async (req, res) => {

    const { startDate, endDate } = req.query;

    // 1. Create the base $match stage for the date range
    const matchStage = {}; 
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        // Use new Date() to ensure correct date object
        matchStage.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        // Set to the end of the day to include all records on that day
        end.setHours(23, 59, 59, 999);
        matchStage.date.$lte = end;
      }
    }

    // --- Aggregation 1: Get Total Site Visits ---
    const [totalStats] = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null, // Group all matched documents into one
          totalVisits: { $sum: "$totalVisits" },
        },
      },
    ]);

    // --- Aggregation 2: Get Top 10 Viewed Posts ---
    const topPosts = await Analytics.aggregate([
      { $match: matchStage },

      { $unwind: "$postInteractions" }, 

      {
        $group: {
          _id: "$postInteractions.postId",
          totalViews: { $sum: "$postInteractions.views" },
        },
      },

      { $sort: { totalViews: -1 } },
      { $limit: 10 },

      {
        // 6. Join with the 'posts' collection to get post details
        $lookup: {
          from: "posts", 
          localField: "_id",
          foreignField: "_id",
          as: "postDetails",
        },
      },

      {
        // 7. $lookup returns an array, so we unwind it
        $unwind: {
          path: "$postDetails",
          preserveNullAndEmptyArrays: true 
        }
      },

      {
        // 8. Project to a clean output format
        $project: {
          _id: 0,
          postId: "$_id",
          views: "$totalViews",
          title: "$postDetails.title", 
        },
      },
    ]);

    // 4. Send the final response
    res.status(200).json({
      totalVisits: totalStats?.totalVisits || 0,
      topPosts,
      dateRange: {
        startDate: startDate || 'all',
        endDate: endDate || 'all'
      }
    });
})

export {
    trackPostView,
    getAnalyticsSummary
}