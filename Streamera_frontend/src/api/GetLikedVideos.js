import api from './axios'

export const getLikedVideos=async()=>{
    const videos=await api.get('/likes/videos');
    return videos;
}