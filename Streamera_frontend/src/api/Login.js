import api from "./axios";

export const loginInUser=async(username,password)=>{
    const isloggedIn=await api.post('/users/login',{
        username:username,
        password:password
    })
    return isloggedIn;
}