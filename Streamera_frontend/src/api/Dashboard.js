import api from "./axios";

export const getDashboardStats=async()=>{
    const response=await api.get('/dashboard/stats');
    return response
}

export const uploadVideo = async (title, description, videoFile, thumbnail) => {
    const formData=new FormData();

    formData.append("title",title);
    formData.append("description",description);
    formData.append("videoFile",videoFile);
    formData.append("thumbnail",thumbnail);

    const response=await api.post("/videos",formData,{headers:{
            "Content-Type": "multipart/form-data"}});

    return response;
};

export const getUserVideos=async(username)=>{
    const response=await api.get(`/dashboard/videos/${username}`);
    return response
}

export const togglePublish=async(videoId)=>{
    const response=await api.patch(`/videos/toggle/publish/${videoId}`);
    return response;
}

export const deleteVideo=async(videoId)=>{
    const response=await api.delete(`/videos/${videoId}`)
    return response
}

export const updateVideo=async(videoId,title,description,thumbnailFilePath)=>{
    const formData=new FormData();

    formData.append("title",title);
    formData.append("description",description);
    formData.append("thumbnailFilePath",thumbnailFilePath);
    const response=await api.patch(`/videos/${videoId}`,formData,{headers:{"Content-Type": "multipart/form-data"}});
    return response
}