import { Services } from "../models/services.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js" 

const createService = asyncHandler(async(req,res)=>{
    const {name, documentsRequired, fees, processingTime} = req.body
    if([name, documentsRequired, fees, processingTime].some((field) => field?.trim === "")) {
        throw new ApiError(400,"All fields are required")
    }
    
    const newService = await Services.create({
        name,
        documentsRequired,
        fees,
        processingTime,
        author:req.user?._id
    })
    if(!newService) throw new ApiError(500,"Something went wrong while creating db object")
    return res.status(201)
                    .json(new ApiResponse(201,newService, "Post created Successfully"))
})

const updateService = asyncHandler(async(req,res) => { 
    const {serviceId} = req.params
    const {name, documentsRequired, fees, processingTime} = req.body

    const service =await Services.findOne({
        _id:serviceId,
        author:req.user?._id
    })
    if(!service){throw new ApiError(404,"Video not found or you don't have permissions")}

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (documentsRequired !== undefined) fieldsToUpdate.documentsRequired = documentsRequired;
    if (fees !== undefined) fieldsToUpdate.fees = fees;
    if (processingTime !== undefined) fieldsToUpdate.processingTime = processingTime;

    const updatedFields = await Services.findByIdAndUpdate(
        serviceId,
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

const deleteService = asyncHandler(async(req,res) => {
    const {serviceId} = req.params
    const deletedService = await Services.findByIdAndDelete(serviceId)
    if(!deletedService) {new ApiError(404,"Post not found")}
    return res  
        .status(200)
        .json(new ApiResponse(200,deletedService,"Video deleted Succesfully"))
})

const getService = asyncHandler(async(req,res) => {
    const {serviceId} = req.params
    const service = await Services.findById(serviceId)
    if(!service){throw new ApiError(404,"Service not Found")}
    
    return res.
        status(201).
        json(new ApiResponse(201,service,"Service fetched Successfully"))
})

const getAllServices = asyncHandler(async(req,res) => {
    const service = await Services.find({isActive:true})
    return res  
        .status(200)
        .json(new ApiResponse(200,service,"Services Fetched Successfully"))
    
})

export {createService,
        updateService,
        deleteService,
        getAllServices,
        getService
}