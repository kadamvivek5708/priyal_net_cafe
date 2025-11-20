import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Analytics } from "../models/analytics.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";    
import { Post } from "../models/post.model.js";
import { Services } from "../models/services.model.js";

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// const trackPostView = asyncHandler (async (req, res) => {
//     const { postId } = req.params;

//     // 1. Validate the Post ID
//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       throw new ApiError(400,"Invalid Post ID")
//     }

//     const today = getStartOfToday();
//     const updatedDoc = await Analytics.findOneAndUpdate(
//       {
//         date: today,
//         "postInteractions.postId": postId,
//       },
//       {
//         $inc: { "postInteractions.$.views": 1 },
//       },
//       {
//         new:true
//       }
//     );

//     // 3. Step 2: If updatedDoc is null, the post wasn't in the array yet
//     if (!updatedDoc) {
//       await Analytics.findOneAndUpdate(
//         { date:today },
//         {
//           $push: { postInteractions: {postId, views: 1 } },
//         },
//         { 
//             upsert: true, 
//             new: true,
//             setDefaultsOnInsert:true
//         }
//       );
//     }
//     res.status(204).send();
// })

const getAnalyticsSummary = asyncHandler (async (req, res) => {
// 1. Get sortBy from query (default to 'views')
    const { startDate, endDate, sortBy = 'views' } = req.query;

    const matchStage = {}; 
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        matchStage.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchStage.date.$lte = end;
      }
    }

    // --- Aggregation 1: Total Visits ---
    const visitsAggregation = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: "$totalVisits" },
        },
      },
    ]);
    const totalVisits = visitsAggregation[0]?.totalVisits || 0;

    // --- Aggregation 2: Top Posts (Dynamic Sort) ---
    const topPosts = await Analytics.aggregate([
      { $match: matchStage },
      { $unwind: "$postInteractions" }, 
      {
        $group: {
          _id: "$postInteractions.postId",
          totalViews: { $sum: "$postInteractions.views" },
        },
      },
      // Move Lookup UP so we can sort by date if needed
      {
        $lookup: {
          from: "posts", 
          localField: "_id",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      {
        $unwind: {
          path: "$postDetails",
          preserveNullAndEmptyArrays: false 
        }
      },
      // Dynamic Sort Step
      { 
        $sort: sortBy === 'date' 
          ? { "postDetails.createdAt": -1 } // Sort by Newest Date
          : { totalViews: -1 }              // Sort by Most Views (Default)
      },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          views: "$totalViews",
          title: "$postDetails.title",
          createdAt: "$postDetails.createdAt" // Return date for UI
        },
      },
    ]);

    // --- Aggregation 3: Total Active Counts ---
    const [totalPosts, totalServices] = await Promise.all([
        Post.countDocuments({ isActive: true }),
        Services.countDocuments({ isActive: true })
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalVisits,
          topPosts,
          totalPosts,
          totalServices,
          dateRange: {
            startDate: startDate || 'all',
            endDate: endDate || 'all'
          }
        },
        "Analytics summary fetched successfully"
      )
    );
})

export {
    // trackPostView,
    getAnalyticsSummary
}