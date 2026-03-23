import api from "./axios";

export const SubscribedToChannel=async(userId)=>{
    const response=await api.get(`/subscriptions/u/${userId}`)
    return response;
}