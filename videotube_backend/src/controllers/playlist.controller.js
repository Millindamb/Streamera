import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name?.trim()){
        throw new ApiError(400,"Invalid Name.");
    }

    if(!description?.trim()){
        throw new ApiError(404,"Invalid Discription")
    }
    const playlist=await Playlist.create({
        name:name,
        description:description,
        videos:[],
        owner:req.user._id
    });

    return res.status(200)
    .json(new ApiResponse(200,playlist,"Playlist Created Successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
   if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User Id")

    const playlists=await Playlist.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },{
            $project:{
                owner:0
            }
        }
    ])

    res.status(200).json(new ApiResponse(200,playlists,"User playlists fetched"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid Play list Id")
    }

    const userPlaylistById=await Playlist.aggregate([{
            $match: { _id: new mongoose.Types.ObjectId(playlistId) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $project: {owner: 0}
        }
    ])

    if(!userPlaylistById?.length){
        throw new ApiError(404,"No Playlist Found.")
    }
    
    return res.status(200)
    .json(new ApiResponse(200,userPlaylistById,"User Playlist fetched Successfully."))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid Playlist Id and vedio Id")
    }

    const afterAddingVideo=await Playlist.findByIdAndUpdate(
        {_id:playlistId,owner:req.user._id},
        {$addToSet:{videos:videoId}},
        {new:true})
    .select("-owner")

    return res.status(200)
    .json(new ApiResponse(200,afterAddingVideo,"Successfully Added Video to the PlayList."))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(404,"Invalid Playlist Id and vedio Id")
    }

    const afterRemovingVideo=await Playlist.findByIdAndUpdate(
        {_id:playlistId,owner:req.user._id},
        {$pull:{videos:videoId}},
        {new:true})
    .select("-owner")

    if(!afterRemovingVideo){
        throw new ApiError(404,"PlayList not found")
    }

    return res.status(200)
    .json(new ApiResponse(200,afterRemovingVideo,"Successfully Removed Video from the PlayList."))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId }=req.params

    if(!isValidObjectId(playlistId))throw new ApiError(400, "Invalid Playlist Id")

    const deleted=await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    })

    if(!deleted)throw new ApiError(404, "Playlist not found or unauthorized")

    res.status(200).json(new ApiResponse(200, deleted, "Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid Play list Id")
    }

    if(!name?.trim() || !description?.trim()){
        throw new ApiError(400,"All fields are required")
    }

    const updatedPlaylist=await Playlist.findByIdAndUpdate(
        {_id: playlistId,owner:req.user._id},
        {$set:{name:name,description:description}},
        {new:true})
    .select("-owner")

    if(!updatedPlaylist)throw new ApiError(404, "Playlist not found or unauthorized")

    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"playlist details updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
