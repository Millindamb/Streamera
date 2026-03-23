import api from "./axios";

export const toggelSubscribe=async(channelId)=>{
    const res=await api.post(`/subscriptions/c/${channelId}`)
    return res
}