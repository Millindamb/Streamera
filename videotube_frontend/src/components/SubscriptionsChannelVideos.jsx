import React, { useEffect, useState } from 'react'
import { getChannelsVideo } from '../api/GetChannelsVideo'
import VideoCard from './VideoCard'
import './SubscriptionsChannelVideos.css'
import { useNavigate } from 'react-router-dom'

const SubscriptionsChannelVideos = ({channelId,channelAvatar,channelUserName}) => {
    const [videos,setVideos]=useState([])
    const navigate=useNavigate()
    useEffect(()=>{
        const fetchVideo=async()=>{
            try{
                const video=await getChannelsVideo(channelId,5,1);
                setVideos(video.data.data);
            }catch(e){
                console.log(e)
            }
        }
        fetchVideo()
    },[channelId])
  return (
    <div className='subscribed-channel'>
        <div onClick={()=>{navigate(`/channel/${channelUserName}`)}} className='channelInfo'>
            <div className='subscribed-ch-img'><img src={channelAvatar}/></div>
            <div className='subscribed-ch-username'>{channelUserName}</div>
        </div>
        <div className='subscribed-hd'>
            Latest Videos
        </div>
        <div className='subscribed-channel-videos'>
            {videos.length===0?<div className='fd'>No Video Found</div>:videos.map((v)=>{return <VideoCard key={v._id} video={v}/>})}
        </div>
    </div>
  )
}

export default SubscriptionsChannelVideos
