import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userObject) =>{
    try {
        const accessToken = userObject.generateAccessTokens()
        const refreshToken = userObject.generateRefreshTokens()
        userObject.refreshToken = refreshToken
        await userObject.save({validateBeforeSave : false})
        return{accessToken,refreshToken}

    } catch (error) {
        console.log(error)
        throw new ApiError(500,"Something Went Wrong while generating refresh and access tokens")
    }
}

const registerAdmin = asyncHandler( async (req,res) => {

    const {username,password} = req.body
    if(!username.trim() || !password.trim()) {
        throw new ApiError(400,"All fields are required")
    } 

    // check if admin already exists
    const existedAdmin = await User.findOne({username})
    if (existedAdmin) {
        throw new ApiError(409,"Admin with username already Exist");
    }

    // create user object - create entry in db
    const user = await User.create({
        username : username.toLowerCase(),
        password,
    })
    console.log(user)

    // optimised as we need one less db call
    const createdUser = user.toObject();
    delete createdUser.password;
    delete createdUser.refreshToken;

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering admin")
    }

    // return response  
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "Admin Registered Succesfully"
        )
    )

})

const loginAdmin = asyncHandler(async (req,res) => {

    // 1.validation
    const {username,password} = req.body
    if(!username){
        throw new ApiError(400,"Please Enter Valid Username");
    }
    if(!password){
        throw new ApiError(400,"Please Enter Password");
    }

    // 2.is user signed up
    const user = await User.findOne({username})
    if (!user) {
        throw new ApiError(404,"Admin not Found !");
    }

    // 3.Password check
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid admin Credentials");
    }

    // 4.generate tokens
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user)

    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    const options ={
        httpOnly:true,
        secure:true
    }

    return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedInUser,accessToken,refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logoutAdmin = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )

    const options ={
        httpOnly:true,
        secure:true
    }

    return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new ApiResponse(200,{}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken.trim()){
        throw new ApiError(401,"Unauthorized access")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh Token is Expired")
        }
    
        const options ={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access Token Refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401,error?.message || "Error while generating Tokens")
    }
})


export {
    loginAdmin,
    registerAdmin,
    logoutAdmin,
    refreshAccessToken
}