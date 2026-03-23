import api from "./axios"

export const getUserPlaylists=async(userId)=>{
    const playlists=await api.get(`/playlist/user/${userId}`)
    return playlists;
}

export const createPlaylist=async(name,description)=>{
    const res=await api.post('/playlist',{
        name:name,
        description:description
    })
    return res;
}

export const deletePlaylist=async(PlaylistId)=>{
    const res=await api.delete(`/playlist/${PlaylistId}`)
    return res
}

export const getPlaylistById=async(PlaylistId)=>{
    const res=await api.get(`/playlist/${PlaylistId}`)
    return res
}

export const updatePlaylist=async(PlaylistId,name,description)=>{
    const res=await api.patch(`/playlist/${PlaylistId}`,
        {
            name:name,
            description:description
        }
    )
    return res
}

export const removeVideoFromPlaylist=async(playlistId,videoId)=>{
    const res=await api.patch(`/playlist/${playlistId}/remove/${videoId}`)
    return res
}

export const addVideToPlaylist=async(playlistId,videoId)=>{
    const res=await api.patch(`/playlist/${playlistId}/add/${videoId}`)
    return res
}