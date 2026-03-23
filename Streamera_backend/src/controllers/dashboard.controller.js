import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId=new mongoose.Types.ObjectId(req.user._id)

    const ChannelStats=await User.aggregate([
        {$match:{_id:channelId}},
        {$lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }},
        {$lookup:{
            from:"videos",
            localField:"_id",
            foreignField:"owner",
            as:"videos",
        }},
        {
            $lookup:{
                from:"likes",
                localField:"videos._id",
                foreignField:"video",
                as:"videoLikes"
        }},
        {
            $addFields:{
                totalVideos:{$size:"$videos"},
                totalLikes:{$size:"$videoLikes"},
                totalSubscribers:{$size:"$subscribers"},
                totalViews: {
                    $sum: {
                        $map: {
                            input: "$videos",
                            as: "video",
                            in: "$$video.views"
                        }
                    }
                }
            }
        },
        {
            $project:{
                videos:0,
                videoLikes:0,
                subscribers:0
            }
        }
    ])

    if(!ChannelStats?.length){
        throw new ApiError(404,"No stats avaliable")
    }

    res.status(200)
    .json(new ApiResponse (200,ChannelStats[0],"Channel Stats fetched Successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {username}=req.params
    if(!username?.trim()){
        throw new ApiError(404,"Username Not Found.")
    }

    const ChannelVideos=await User.aggregate([
        {$match:{username:username?.toLowerCase()}},
        {$lookup:{
            from:"videos",
            localField:"_id",
            foreignField:"owner",
            as:"ChannelVideos"
        }},{
            $project:{
                username:1,
                ChannelVideos:1
            }
        }
    ])

    if(!ChannelVideos?.length){
        throw new ApiError(404,"No vedios Uploaded")
    }

    return res.status(200)
    .json(new ApiResponse(200,ChannelVideos[0],"Channel Videos fetched successfully."))
})

export {
    getChannelStats, 
    getChannelVideos
}