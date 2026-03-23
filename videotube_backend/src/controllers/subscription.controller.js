import {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//toggle to subscribe and unsubscribe
const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId=req.user._id

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id.")
    }

    if(channelId.toString()===userId.toString()){
        throw new ApiError(400,"You cannot subscribe to yourself")
    }

    const isSubscribed=await Subscription.findOne({subscriber:userId,channel:channelId})

    if(!isSubscribed){
        const newSubscription=await Subscription.create({
            subscriber:userId,
            channel:channelId
        })

        if(!newSubscription){
            throw new ApiError(404,"Something Went wrong while Subscribing")
        }

        return res.status(201)
        .json(new ApiResponse(201,newSubscription,"Successfully Subscribed to channel"))
    }else{
        const unsubscribe=await Subscription.findOneAndDelete({
            subscriber:userId,
            channel:channelId
        })
        return res.status(200)
        .json(new ApiResponse(200,unsubscribe,"successfully UnSubscribed to channel"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id.")
    }

    const channelSubscribers=await Subscription.find({channel:channelId}).populate("subscriber","username avatar")

    if(!channelSubscribers?.length){
        throw new ApiError(400,"No Subscribers")
    }

    return res.status(200)
    .json(new ApiResponse(200,channelSubscribers,"subscriber list fetched Successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid subscriber Id.")
    }

    const channelSubscribedTo=await Subscription.find({subscriber:subscriberId})
    .populate("channel","username avatar")

    return res.status(200)
    .json(new ApiResponse(200,channelSubscribedTo,"Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}