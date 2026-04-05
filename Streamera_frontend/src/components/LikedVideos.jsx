import React, { useEffect, useState } from 'react'
import { getLikedVideos } from '../api/GetLikedVideos'
import VideoCard from './VideoCard'
import './LikedVideos.css'

const LikedVideos = () => {
  const [videos,setVideos]=useState([])
  const [loading,setLoading]=useState(true)
  const user=JSON.parse(localStorage.getItem("user"));

  useEffect(()=>{
    const fetchVideos=async ()=>{
      try{
        const response=await getLikedVideos()
        setVideos(response.data.data || [])
      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }
    fetchVideos()
  },[user])

  return (
    <div className="liked-videos-container">
      {loading ? (<p className="liked-videos-status-text">Loading...</p>)
      : videos.length===0?(<p className="liked-videos-status-text">No Videos Liked Yet.</p>) : 
      <div className="liked-videos">
        {videos?.filter((v)=>v?.video?._id).map((v)=>(
            <VideoCard key={v.video._id} video={v.video}/>
          ))}
      </div>}
    </div>
  )
}

export default LikedVideos