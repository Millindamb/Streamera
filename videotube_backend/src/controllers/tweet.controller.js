import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const content=req.body.content

    if(!content?.trim()){
        throw new ApiError(400,"Description is required")
    }

    const tweet=await Tweet.create({
        content:content,
        owner:req.user._id
    })

    return res.status(200)
    .json(new ApiResponse(200,tweet,"Tweet Created Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    //const userId=req.user._id
    const { userId } = req.params

    const userTweets=await Tweet.find({owner:userId}).sort({createdAt:-1})

    if(!userTweets?.length){
        throw new ApiError(404,"No Tweets avaliable")
    }

    return res.status(200)
    .json(new ApiResponse(200,userTweets,"User Tweets Fetched Successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId}=req.params
    const {content}=req.body

    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid Tweet Id")
    }

    if(!content?.trim()){
        throw new ApiError(400,"Content is required")
    }

    const updatedTweet=await Tweet.findOneAndUpdate(
        {_id:tweetId,owner:req.user._id},
        {content:content},
        {new:true}
    ).select("-owner")

    if(!updatedTweet){
        throw new ApiError(404,"Tweet Not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedTweet,"Tweet Updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId}=req.params

    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid Tweet ID")
    }

    const afterDeletion=await Tweet.findOneAndDelete({
        _id:tweetId,
        owner:req.user._id
    })

    if(!afterDeletion){
        throw new ApiError(404,"Tweet not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,afterDeletion,"Tweet Deleted Successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
