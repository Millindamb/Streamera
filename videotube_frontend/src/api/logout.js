import api from "./axios";

export const logoutUser=async()=>{
    const response=await api.post('/users/logout');
    return response
}