import api from "./axios";

export const getChannelInfo=async(owner)=>{
    const response=await api.get(`/users/channel/${owner}`)
    return response
}

export const isChannelSubscribed=async(channelId)=>{
    const response=await api.get(`/users/isSubscribed/${channelId}`)
    return response
}