import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async(req, res)=> {
    const {title, postName,seatDetails, ageLimit, qualifications, fees, lastDate, category, startDate, documentsRequired, source, isActive,totalSeats, others} = req.body

    const authorId = req.user?._id

    // ---- VALIDATION FIXED ----
    if (!title?.trim() || !lastDate) {
        throw new ApiError(400, "title,lastDate are required");
    }

    if (!Array.isArray(ageLimit) || ageLimit.length === 0) {
        throw new ApiError(400, "ageLimit must be a non-empty array");
    }

    if (!Array.isArray(qualifications) || qualifications.length === 0) {
        throw new ApiError(400, "qualifications must be a non-empty array");
    }

    if (!Array.isArray(fees) || fees.length === 0) {
        throw new ApiError(400, "fees must be a non-empty array");
    }

    if (!Array.isArray(seatDetails) || seatDetails.length === 0) {
        throw new ApiError(400, "seatDetails is required");
    }

    // optioinal fields
    const optionalFields = {};

    if (postName !== undefined) optionalFields.postName = postName;
    if (category !== undefined) optionalFields.category = category;
    if (startDate !== undefined) optionalFields.startDate = startDate;
    if (documentsRequired !== undefined) optionalFields.documentsRequired = documentsRequired;
    if (source !== undefined) optionalFields.source = source;
    if (isActive !== undefined) optionalFields.isActive = isActive;
    if (totalSeats !== undefined) optionalFields.totalSeats = totalSeats;
    if (others !== undefined) optionalFields.others = others;
    

    try {
        const newPost = await Post.create({
            title,
            seatDetails,
            ageLimit,
            qualifications,
            fees,
            lastDate,
            author : authorId,
            ...optionalFields
        })
        if(!newPost){
            throw new ApiError(500,"something went wrong while creating db object")
        }

        return res.status(201)
                    .json(new ApiResponse(201,newPost, "Post created Successfully"))

    } 
    catch (error) {
        throw new ApiError(500,error || "something went wrong while creating db object")
    }

})

const updatePost = asyncHandler(async(req, res)=> {
    const {postId} = req.params

    // check if admin is owner of post
    const post =await Post.findOne({
        _id:postId,
        author:req.user?._id
    })
    if(!post){throw new ApiError(404,"Video not found or you don't have permissions")}

    // get the fields to update
    const {title, postName,seatDetails, ageLimit, qualifications, fees, lastDate, category, startDate, documentsRequired, source, isActive,totalSeats,others} = req.body

    const fieldsToUpdate = {};
    if (title !== undefined) fieldsToUpdate.title = title;
    if (seatDetails !== undefined) fieldsToUpdate.seatDetails = seatDetails;
    if (postName !== undefined) fieldsToUpdate.postName = postName;
    if (ageLimit !== undefined) fieldsToUpdate.ageLimit = ageLimit;
    if (qualifications !== undefined) fieldsToUpdate.qualifications = qualifications;
    if (fees !== undefined) fieldsToUpdate.fees = fees;
    if (lastDate !== undefined) fieldsToUpdate.lastDate = lastDate;
    if (category !== undefined) fieldsToUpdate.category = category;
    if (startDate !== undefined) fieldsToUpdate.startDate = startDate;
    if (documentsRequired !== undefined) fieldsToUpdate.documentsRequired = documentsRequired;
    if (source !== undefined) fieldsToUpdate.source = source;
    if (isActive !== undefined) fieldsToUpdate.isActive = isActive;
    if (totalSeats !== undefined) fieldsToUpdate.totalSeats = totalSeats;
    if (others !== undefined) fieldsToUpdate.others = others;

    const updatedFields = await Post.findByIdAndUpdate(
        postId,
        {
            $set: fieldsToUpdate
        },
        {new: true}
    )
    if(!updatedFields) throw new ApiError(500,"Something went wrong while updating DB")
    return res
            .status(200)
            .json(new ApiResponse(200, updatedFields, "Fields updated succesfully !!!"))

})

const deletePost = asyncHandler(async(req, res)=> {
    const {postId} = req.params
    const deletedPost =  await Post.findByIdAndDelete(postId)
    if(!deletedPost) {new ApiError(404,"Post not found")}

    return res  
        .status(200)
        .json(new ApiResponse(200,deletedPost,"Video deleted Succesfully"))
})

const getAllPosts = asyncHandler(async(req, res)=> {
    const posts = await Post.find({isActive:true})
    return res  
            .status(200)
            .json(new ApiResponse(200,posts,"Okkkk"))

})

const getPostById = asyncHandler(async(req, res)=> {
    const {postId} = req.params
    const post = await Post.findById(postId)
    if(!post){throw new ApiError(404,"Post not Found")}

    return res.
        status(201).
        json(new ApiResponse(201,post,"Post fetched Successfully"))
})

const getAdminPosts = asyncHandler(async(req, res)=> {
    // Fetch ALL posts (empty filter {}), sorted by newest first
    const posts = await Post.find({}).sort({ createdAt: -1 });
    
    return res
            .status(200)
            .json(new ApiResponse(200,posts,"All admin posts fetched successfully"))
})

const deactivateExpiredPosts = async () => {
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
    if(result.modifiedCount > 0) {
        console.log(`Auto-Deactivator: Deactivated ${result.modifiedCount} expired posts.`);
    }
  } catch (error) {
    console.error("Error running auto-deactivation:", error);
  }
};

const getExpiredPosts = asyncHandler(async(req, res)=> {
    const today = new Date();
    const posts = await Post.find({
        $or: [
            { lastDate: { $lt: today } },
            { isActive: false }
        ]
    }).sort({ lastDate: -1 });
    
    return res.status(200).json(new ApiResponse(200, posts, "Expired posts fetched successfully"));
})

export{ getAllPosts, 
        getPostById, 
        createPost, 
        updatePost, 
        deletePost,
        getAdminPosts,
        deactivateExpiredPosts,
        getExpiredPosts,
    }