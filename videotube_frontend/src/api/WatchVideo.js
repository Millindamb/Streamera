import api from "./axios";

export const getCurrentVideo=async(videoId)=>{
    const response=await api.get(`/videos/${videoId}`)
    return response
}

export const addView = async (videoId) => {
    return await api.post(`/videos/${videoId}/view`)
};

export const getVideoLikes = async (videoId) => {
    return await api.get(`/likes/video/${videoId}`);
}

export const updateComment=async(commentId,content)=>{
    return await api.patch(`/comments/c/${commentId}`,{
        content
    })
}

export const deleteComment=async(commentId)=>{
    return await api.delete(`/comments/c/${commentId}`)
}

export const addComment=async(videoId,content)=>{
    return await api.post(`/comments/${videoId}`,{
        content
    })
}