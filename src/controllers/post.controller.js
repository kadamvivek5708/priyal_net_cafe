import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async(req, res)=> {
    const {title, postName, ageLimit, qualifications, fees, lastDate, category, startDate, documentsRequired, source, isActive} = req.body
    const authorId = req.user?._id
    const optionalFields = {};

    if([title, postName, ageLimit, qualifications, fees, lastDate].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All fields are required")
    }

    if (category !== undefined) optionalFields.category = category;
    if (startDate !== undefined) optionalFields.startDate = startDate;
    if (documentsRequired !== undefined) optionalFields.documentsRequired = documentsRequired;
    if (source !== undefined) optionalFields.source = source;
    if (isActive !== undefined) optionalFields.isActive = isActive;
    

    try {
        const newPost = await Post.create({
            title,
            postName,
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
})

const deletePost = asyncHandler(async(req, res)=> {
})

const getAllPosts = asyncHandler(async(req, res)=> {
})

const getPostById = asyncHandler(async(req, res)=> {
})

export{ getAllPosts, 
        getPostById, 
        createPost, 
        updatePost, 
        deletePost}