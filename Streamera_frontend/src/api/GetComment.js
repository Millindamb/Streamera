import api from "./axios";

export const getComments=async(videoId,page=1,limit=10)=>{
    const response=await api.get(`/comments/${videoId}`,{params:{page,limit}});
    return response.data;
};