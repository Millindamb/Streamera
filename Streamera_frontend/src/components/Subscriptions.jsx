import React, { useEffect, useState } from 'react'
import { SubscribedToChannel } from '../api/GetSubscribedTo'
import SubscriptionsChannelVideos from './SubscriptionsChannelVideos';

const Subscriptions = () => {
  const user=JSON.parse(localStorage.getItem("user"));
  const [channels,setChannels]=useState([]);

  useEffect(()=>{
    const fetchData=async()=>{
    try{
        const data=await SubscribedToChannel(user._id);
        setChannels(data.data.data)
      }catch(e){console.log(e)}
    }
    fetchData();
  },[user._id])

  return (
    <div className='channel-detail'>
      {channels.length===0?
        <div>No Channel Subscribed yet</div>:
        channels.map((c)=>{return <SubscriptionsChannelVideos key={c.channel._id} channelId={c.channel._id} channelAvatar={c.channel.avatar} channelUserName={c.channel.username}/>})
      }
    </div>
  )
}

export default Subscriptions
