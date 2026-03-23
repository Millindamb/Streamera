import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId=req.user._id

    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"Invalid Video Id")
    }

    const isVideoLiked=await Like.findOne({likeBy:userId,video:videoId})

    if(!isVideoLiked){
        const newLike=await Like.create({
            video:videoId,
            likeBy:userId
        })

        if(!newLike){
            throw new ApiError(404,"Not able to like video")
        }

        return res.status(201)
        .json(new ApiResponse(201,newLike,"Successfully Liked"))
    }else{
        const deletedLike=await Like.findOneAndDelete({likeBy:userId,video:videoId})

        return res.status(200)
        .json(new ApiResponse(200,deletedLike,"Removed Like"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId=req.user._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(404,"Invalid Video Id")
    }

    const isCommentLiked=await Like.findOne({likeBy:userId,comment:commentId})

    if(!isCommentLiked){
        const newLike=await Like.create({
            comment:commentId,
            likeBy:userId
        })

        if(!newLike){
            throw new ApiError(404,"Not able to like Comment")
        }

        return res.status(201)
        .json(new ApiResponse(201,newLike,"Successfully Liked"))
    }else{
        const deletedLike=await Like.findOneAndDelete({likeBy:userId,comment:commentId})

        return res.status(200)
        .json(new ApiResponse(200,deletedLike,"Removed Like"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId=req.user._id

    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"Invalid Video Id")
    }

    const isTweetLiked=await Like.findOne({likeBy:userId,tweet:tweetId})

    if(!isTweetLiked){
        const newLike=await Like.create({
            tweet:tweetId,
            likeBy:userId
        })

        if(!newLike){
            throw new ApiError(404,"Not able to like Tweet")
        }

        return res.status(201)
        .json(new ApiResponse(201,newLike,"Successfully Liked"))
    }else{
        const deletedLike=await Like.findOneAndDelete({likeBy:userId,tweet:tweetId})

        return res.status(200)
        .json(new ApiResponse(200,deletedLike,"Removed Like"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId=req.user._id

    const likedVideos=await Like.find({
        likeBy:userId,
        video:{$ne:null}
    }).populate("video")
    
    if(!likedVideos?.length){
        throw new ApiError(404,"No Video Liked yet")
    }

    return res.status(200)
    .json(new ApiResponse(200,likedVideos,"Likes Videos fetched Successfully"))
})

const checkIsVideoLiked = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const isVideoLiked = await Like.exists({
        likeBy: userId,
        video: videoId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            !!isVideoLiked,
            isVideoLiked ? "Video is already liked" : "Video is not liked"
        )
    );
});

const checkIsCommentLiked = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment Id");
    }

    const isCommentLiked = await Like.exists({
        likeBy: userId,
        comment: commentId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            !!isCommentLiked,
            isCommentLiked ? "Comment is already liked" : "Comment is not liked"
        )
    );
});

const checkIsTweetLiked = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet Id");
    }

    const isTweetLiked = await Like.exists({
        likeBy: userId,
        tweet: tweetId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            !!isTweetLiked,
            isTweetLiked ? "Tweet is already liked" : "Tweet is not liked"
        )
    );
});

const getVideoLikes=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id");
    }

    const likeCount = await Like.countDocuments({ video: videoId });

    return res.status(200).json({
        success: true,
        likeCount
    });
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    checkIsVideoLiked,
    checkIsCommentLiked,
    checkIsTweetLiked,
    getVideoLikes
}