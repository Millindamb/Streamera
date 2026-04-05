import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//creating a method to generate a Access and refresh token
const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)//finding user using the user Id
        const refreshToken=user.generateRefreshToken()//generating the refresh token
        const accessToken=user.generateAccessToken()//generating the access token

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})//this will not validate before saving in the data base as we are sure about the changes
        return {accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500,"something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    // 1. Check all fields present
    if ([fullName, email, username, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 2. Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // 3. Check for existing user (with correct $or syntax)
    const existedUser = await User.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // 4. Safe file path extraction
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 5. Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed, please try again");
    }

    // 6. Create user with normalized values
    const user = await User.create({
        fullName: fullName.trim(),
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || "",
        email: normalizedEmail,
        password,
        username: normalizedUsername
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    );
});
//this is just a method(for this method to work we define all the remaning work inside user.routes.js)
//which will handle how this method if called when someone hit the secure_url

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if ((!email || email.trim() === "") && (!username || username.trim() === "")) {
        throw new ApiError(400, "Email or Username is required");
    }

    if (!password || password.trim() === "") {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne(
        email 
            ? { email: email.trim().toLowerCase() } 
            : { username: username.trim().toLowerCase() }
    );

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User Logged In Successfully"
            )
        );
});

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(//using the findbyidandupdate as we need to update the refresh token
        req.user._id,//using the user define by the middleware
        {
            $unset:{//setting the refresh token to undefined
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true,
        sameSite: "none"
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User Logged Out")
    )
})

//this is just a controller that will be used by the end point
const refreshAccessToken=asyncHandler(async(req,res)=>{
    //here req.body.refreshToken is for the mobile users
    //taking the refresh token to validate and generate new access and refresh token
    const incomingRefreshToken=req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        //verifying the refresh token using the jwt which will provide a decoded data
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        //finding the user using the user id avaliable in the decodedToken 
        const user=await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"invalid refresh Token")
        }
    
        //matching the incomingRefereshToken with the refresh token stored
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        //generating new access and refresh token
        const {accessToken,refreshToken:newRefreshToken}=await generateAccessAndRefreshToken(user._id)

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access Token refreshed "
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

//to change password of the user
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword,newPassword}=req.body;

  const user=await User.findById(req.user?._id);

  if(!user){throw new ApiError(404,"User not found");}

  const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect){throw new ApiError(400,"Invalid old password");}

  if(newPassword===oldPassword){throw new ApiError(400,"New password must be different.");}

  user.password=newPassword;
  await user.save();
  return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

//to get the details about the current user
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(
        200,req.user,"current user fetched Successfully"
    ))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body

    if(!email || !fullName){
        throw new ApiError(400,"All fields are required")
    }
    
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName:fullName,
                email:email,
            }
        },
        {new:true}//by this after updating information is returned
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully"))
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path//file as there is only a single path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.secure_url){
        throw new ApiError(400,"Error while uploading on avatar")
    }
    
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.secure_url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200).
    json(new ApiResponse(200,user,"Avatar Image updated successfully"))
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path//file as there is only a single path

    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image file is missing")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.secure_url){
        throw new ApiError(400,"Error while uploading on Cover image")
    }
    
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.secure_url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200).
    json(new ApiResponse(200,user,"Cover Image updated successfully"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params

    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }

    const channel=await User.aggregate([{
        $match: {
            username: username.toLowerCase()
        }
        },
        {$lookup:{//number of subscriber
            from:"subscriptions",//check form the subscription model
            localField:"_id",//try to find this users id
            foreignField:"channel",//form the channel field of the document
            as:"subscribers"//will return all the number of subscriber
        }},
        {$lookup:{//for the number of channels subscribe to
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",//will check in the subscriber field of each document to look for the channel user have subscribed to
            as:"subscribedTo"
        }},
        {$addFields:{//adding the two fields:subscriber and subscribed to
            subscribersCount:{//a new field that have total number of subscriber
                $size:"$subscribers"
            },
            ChannelSubscribedToCount:{//another field with total number of channels subscribed to
                $size:"$subscribedTo"
            },
            isSubscribed:{//to check wheather we subscribe the channel we are visiting 
                $cond:{//checking the condition
                    //it will check in the subscribers>subscriber that will follow the current visiting channel or not
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then:true,//if subscribed then will true the isSubscribed
                    else:false//else false it
                }
            }
        }},
        {$project:{
            fullName:1,
            username:1,
            subscribersCount:1,
            ChannelSubscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1}
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,"channel does not exists")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            channel[0],//returning only the first object from the array
            "User channel fetched successfully"
        )
    )
})

const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }},
            {$lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[//using the pipeline to use nested pipeline
                    {
                        $lookup:{//will look for the user id
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[//using another pipeline to take all the details of the vedio watched
                                {
                                    $project:{//using project to get the vedios details
                                        fullName:1,
                                        avatar:1,
                                        username:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{//to provide a good response for the front end
                            owner:{//this will add a field owner with the data of first index(which is object) form the owner array 
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch History Fetched Successfully"
        )
    )

})

const getChannelInformationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "channel id is missing");
  }

  const information = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id), // ✅ FIX
                "$subscribers.subscriber"
              ]
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        avatar: 1,
        subscribersCount: 1,
        isSubscribed: 1,
        username: 1
      }
    }
  ]);

  if (!information.length) {
    throw new ApiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, information[0], "Channel fetched successfully"));
});

const checkSubscribed = asyncHandler(async (req, res) => {
  const { id } = req.params;      // channel id
  const userId = req.user._id;    // subscriber id

  if (!id) {
    throw new ApiError(400, "channel id is missing");
  }

  if (!userId) {
    throw new ApiError(400, "user id is missing");
  }

  const subscription = await Subscription.findOne({
    subscriber: userId,
    channel: id
  });

  const isSubscribed = !!subscription;

  return res.status(200).json(
    new ApiResponse(
      200,
      { isSubscribed },
      "Subscription status fetched successfully"
    )
  );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getChannelInformationById,
    checkSubscribed
}