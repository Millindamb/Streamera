import api from "./axios";

export const checkIsVideoLiked=async(videoId)=>{
    const response=await api.get(`/likes/check/v/${videoId}`)
    return response
}

export const checkIsCommentLiked=async(commentId)=>{
    const response=await api.get(`/likes/check/c/${commentId}`)
    return response
}

export const checkIsTweetLiked=async(tweetId)=>{
    const response=await api.get(`/likes/check/v/${tweetId}`)
    return response
}

export const toggleVideoLike=async(videoId)=>{
    const response=await api.post(`/likes/toggle/v/${videoId}`)
    return response
}

export const toggleCommentLike=async(commentId)=>{
    const response=await api.post(`/likes/toggle/c/${commentId}`)
    return response
}

export const toggleTweetLike=async(tweetId)=>{
    const response=await api.post(`/likes/toggle/t/${tweetId}`)
    return response
}