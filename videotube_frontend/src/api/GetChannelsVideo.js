import api from "./axios";

export const getChannelsVideo=async(channelId,limit,page)=>{
    const videos=await api.get(`/videos/c?channelId=${channelId}&limit=${limit}&page=${page}`)
    return videos;
}

export const getChannelInfo=async(channelName)=>{
    const channelInfo=await api.get(`/users/c/${channelName}`)
    return channelInfo;
}