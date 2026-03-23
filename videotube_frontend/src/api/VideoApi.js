// api/VideoApi.js
import api from "./axios";

export const getVideos = async (page = 1) => {
    const res = await api.get(`/videos?page=${page}&limit=10`);
    return res.data.data; // ✅ FIXED
};