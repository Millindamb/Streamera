import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query
    
    const matchStage={
        isPublished: true
    };

    if (typeof query==="string" && query.trim()!=="") {
        matchStage.title = {
            $regex: query.trim(),
            $options: "i"
        };
    }


    if(userId && mongoose.isValidObjectId(userId)){
        matchStage.owner=new mongoose.Types.ObjectId(userId)
    }

    const allowedSortFields = ["createdAt","title","duration","views"];

    if(!allowedSortFields.includes(sortBy)){
        sortBy="createdAt"
    }

    const sortStage={
        [sortBy]:sortType==="asc"?1:-1
    }

    const vdo=Video.aggregate([
        {$match:matchStage},
        {$sort:sortStage}
    ])

    const options={
        page:Number(page),
        limit:Number(limit)
    }

    const result=await Video.aggregatePaginate(vdo,options)

    return res.status(200)
    .json(new ApiResponse(200,result,"videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    const videoFilePath=req.files?.videoFile?.[0]?.path
    const thumbnailFilePath=req.files?.thumbnail[0].path
    const userId=req.user._id

    if(!title?.trim() || !description?.trim()){
        throw new ApiError(400,"title and description is required")
    }

    if(!videoFilePath){
        throw new ApiError(400,"Video file is required")
    }

    if(!thumbnailFilePath){
        throw new ApiError(400,"thumbnail file is required")
    }

    const videoFile=await uploadOnCloudinary(videoFilePath,{
        resource_type: "video"
    })

    const thumbnail=await uploadOnCloudinary(thumbnailFilePath)

    if(!videoFile?.secure_url){
        throw new ApiError(404,"Error while uploading on Video file")
    }

    if(!thumbnail?.secure_url){
        throw new ApiError(404,"Error while uploading on thumbnail file")
    }

    const videoDuration=videoFile.duration

    if(!videoDuration || videoDuration<=0){
        throw new ApiError(400,"Invalid vedio duration")
    }

    const newVideo=await Video.create({
        videoFile:videoFile.secure_url,
        thumbnail:thumbnail.secure_url,
        title:title,
        description:description,
        duration:Math.floor(videoDuration),
        owner:userId
    })

    if(!newVideo){
        throw new ApiError(404,"something went wrong while uploading video")
    }

    return res.status(201)
    .json(new ApiResponse(201,newVideo,"video uploaded Successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }

    const video=await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"could'nt find video")
    }

    return res.status(200)
    .json(new ApiResponse(200,video,"Successfully fetched video"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description} = req.body
    const thumbnailFilePath=req.file?.path
    const userId=req.user._id

    if(!title?.trim() || !description?.trim()){
        throw new ApiError(400,"title and description are required")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }

    if(!thumbnailFilePath){
        throw new ApiError(400,"thumbnail file is required")
    }

    const thumbnail=await uploadOnCloudinary(thumbnailFilePath)

    if(!thumbnail.secure_url){
        throw new ApiError(500,"Error while uploading on thumbnail file")
    }

    const updatedVideo=await Video.findOneAndUpdate(
        {_id:videoId,owner:userId},
        {
            $set:{
                thumbnail:thumbnail.secure_url,
                title:title,
                description:description,
            }
        },
        {new:true}
    ).select("-owner")

    if(!updatedVideo){
        throw new ApiError(404,"Something went wrong while updating video details")
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedVideo,"video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId=req.user._id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }

    const deletedVideo=await Video.findOneAndDelete({_id:videoId,owner:userId})

    if(!deletedVideo){
        throw new ApiError(404,"Video not found or unauthorized")
    }

    return res.status(200)
    .json(new ApiResponse(200,deletedVideo,"video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId=req.user._id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }

    const video=await Video.findOne(
        {_id:videoId,owner:userId}
    )

    if(!video){
        throw new ApiError(404,"Video not found")
    }

    video.isPublished=!video.isPublished

    await video.save()

    return res.status(200)
    .json(new ApiResponse(200,video,"video updated successfully"))
})

const getSpecificChannelVideo=asyncHandler(async(req,res)=>{
    const { channelId }=req.query;
    const limit=parseInt(req.query.limit) || 10;
    const page=parseInt(req.query.page) || 1;

    const skip=(page-1)*limit;

    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400,'Invalid Channel Id')
    }

    const channelVideos=await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },{
            $sort:{createdAt:-1}
        },{
            $skip:skip
        },{
            $limit: limit
        }
    ]);

    return res.status(200).json(new ApiResponse(200,channelVideos,'Channels Video Fetched Successfully'));
})

const addView = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    })

    return res.status(200)
        .json(new ApiResponse(200, {}, "View counted"))
})



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getSpecificChannelVideo,
    addView
}
