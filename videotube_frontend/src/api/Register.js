import api from "./axios";

export const registerUser=async(name,email,username,password,profilePicture,coverPicture)=>{
    const formData=new FormData();

    formData.append("fullName", name);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", profilePicture);
    formData.append("coverImage", coverPicture);

    const response=await api.post("/users/register",formData,{
        headers:{"Content-Type":"multipart/form-data"}
    });
    return response;
}