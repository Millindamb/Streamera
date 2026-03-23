import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId}=req.params
    const {page=1,limit=10}=req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Video Id")
    }

    const aggregate=Comment.aggregate([
        {$match:{
            video:new mongoose.Types.ObjectId(videoId)
        }},{
            $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "userInfo"
            }
        },
        {
            $unwind: "$userInfo"
        },
        {
            $project: {
            content: 1,
            createdAt: 1,
            'userInfo._id':1,
            "userInfo.username": 1,
            "userInfo.avatar": 1
            }
        },
        {
            $sort:{createdAt:-1}
        }
    ])

    const options={
        page:Number(page),
        limit:Number(limit)
    }

    const result=await Comment.aggregatePaginate(aggregate,options)

    return res.status(200)
    .json(new ApiResponse(200,result,"Comments Fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const userId=req.user._id
    const {videoId} = req.params
    const {content}=req.body

    if(!content?.trim()){
        throw new ApiError(400,"comment content is empty")
    }

    if(!isValidObjectId(videoId)){
       throw new ApiError(400,"Invalid video Id") 
    }

    const newComment=await Comment.create({
        content:content,
        video:videoId,
        owner:userId
    })

    return res.status(201)
    .json(new ApiResponse(201,newComment,"Successfully uploaded comment"))
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params
    const {content}=req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment or Video Id")
    }

    if(!content?.trim()){
        throw new ApiError(400,"comment it empty")
    }

    const updatedComment=await Comment.findOneAndUpdate(
        {_id:commentId,owner:req.user._id},
        {content},
        {new:true}
    ).select("-owner -video")

    if(!updatedComment){
        throw new ApiError(404,"Comment not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedComment,"comment updated Successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params

    const deletedComment=await Comment.findOneAndDelete({_id:commentId,owner:req.user._id})

    if(!deletedComment){
        throw new ApiError(404,"comment not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,deletedComment,"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
