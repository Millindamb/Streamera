import React, { useEffect, useState, useContext } from 'react'
import { isAuthContext } from '../context/context'
import {useParams} from 'react-router-dom'
import { getUserVideos } from '../api/Dashboard'
import { getChannelInfo } from '../api/GetChannelsVideo'
import VideoCard from './VideoCard'
import './ChannelProfile.css'
import { getUserPlaylists } from '../api/GetUsersPlalists'
import { getTweets } from '../api/Tweet'
import { toggelSubscribe } from '../api/Togglesub'
import { isChannelSubscribed } from '../api/watchChannel'

const ChannelProfile=()=>{
    const values=useContext(isAuthContext)
    const {channelName}=useParams()
    const [channelInfo,setChannelInfo]=useState({})
    const [isSubscribed,setIsSubscribed]=useState(null)
    const [videos,setVideos]=useState([])
    const user=JSON.parse(localStorage.getItem('user'))
    const [currentPart,setCurrentPart]=useState(1)
    const [playlists,setPlaylists]=useState([])
    const [tweets,setTweets]=useState([])

    useEffect(()=>{
        const fetchChannelInfo=async()=>{
            try{
                const response=await getChannelInfo(channelName)
                setChannelInfo(response.data.data)
            }catch(e){
                console.log(e)
            }
        }
        fetchChannelInfo()
    },[channelName])

    useEffect(()=>{
        const fetchChannelVideos=async()=>{
            try {
                const response=await getUserVideos(channelName);
                setVideos(response?.data?.data?.ChannelVideos || []);
            } catch (e) {
                console.log(e);
            }
        };
        fetchChannelVideos();
    }, [channelName]);

    useEffect(()=>{
        if(!channelInfo._id) return;

        const fetchPlaylists=async()=>{
            try {
                const response=await getUserPlaylists(channelInfo._id);
                setPlaylists(response.data.data || []);
            } catch (e) {
                console.log(e);
            }
        };

        fetchPlaylists();
    }, [channelInfo._id]);

    useEffect(()=>{
        if(!channelInfo._id) return;

        const fetchTweets=async()=>{
            try {
                const response=await getTweets(channelInfo._id);
                setTweets(response.data.data || []);
            } catch (e) {
                console.log(e);
            }
        };

        fetchTweets();
    }, [channelName,channelInfo._id]);

    useEffect(()=>{
        if(!channelInfo._id || !values.isLoggedIn) return;
        
        const checkSubscribed=async()=>{
            try{
                const res=await isChannelSubscribed(channelInfo._id)
                setIsSubscribed(res.data.data.isSubscribed)
            }catch(e){
                console.log(e)
            }
        }

        checkSubscribed()
    },[channelInfo._id])

    const formatTimeAgo=(dateString)=>{
    const now=new Date();
    const created=new Date(dateString);
    const seconds=Math.floor((now-created)/1000);

    const intervals={
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    };

    for(let key in intervals){
        const interval=Math.floor(seconds/intervals[key]);
        if(interval>=1){
        return `${interval} ${key}${interval>1 ? "s":""} ago`;
        }
    }
    return "Just now";
    };

    const toggleSub=async()=>{
        try {
          await toggelSubscribe(channelInfo._id);
          setChannelInfo((prev)=>({...prev,
            subscribersCount:isSubscribed
              ? prev.subscribersCount-1
              : prev.subscribersCount+1,}));
    
          setIsSubscribed((prev)=>!prev);
        } catch(e){
          console.log(e);
        }
      };

    return (
    <div className='channel-profile'>
        <div className='about-channel'>
            <div className="channel-pro-info">
                <div className="channel-pro-coverImage">
                    <img src={channelInfo.coverImage} alt="" />
                </div>

                <div className="channel-pro-header">

                    <img className="channel-pro-avatar" src={channelInfo.avatar} alt="User Avatar"/>

                    <div className="channel-pro-text">
                    <div className="channel-pro-name">{channelInfo.username}</div>
                    <div className="channel-pro-subscribers">
                        {channelInfo.subscribersCount} subscribers
                    </div>
                    </div>

                    {values.isLoggedIn && channelInfo._id !== user._id && (
                    <div className="channel-pro-subscribe-button">
                        <button onClick={toggleSub}>
                        {isSubscribed ? "Unsubscribe" : "Subscribe"}
                        </button>
                    </div>
                    )}
                </div>
            </div>
            <div className='channel-pro-option'>
                <button onClick={()=>setCurrentPart(1)}>Video</button>
                <button onClick={()=>setCurrentPart(2)}>Tweets</button>
                <button onClick={()=>setCurrentPart(3)}>Playlist</button>
            </div>
            {currentPart==1 && <div className='channel-pro-video'>
                {videos.length ? videos.map((v)=>{return<VideoCard key={v._id} video={v}/>}):<div>Channel Have No Videos</div>}
            </div>}

            {currentPart==2 && <div className='channel-pro-tweets'>
                {!tweets.length?<div>no Tweets avaliable</div>:
                    tweets.map((t)=>{return(<div key={t._id}>
                        <div className='channel-pro-user-info'>
                        <img src={user.avatar} alt="" />
                        <div className='channel-pro-name'>{user.username}</div>
                        <div>{formatTimeAgo(t.createdAt)}</div>
                        </div>
                        <div>{t.content}</div>
                    </div>)})
                }
            </div>}

            {currentPart==3 && <div className='channel-pro--playlists'>
                {playlists.length===0 ? (<p>No playlists found</p>) : (
                    playlists.map((pl)=>(
                    <div key={pl._id} className='channel-pro-playlist-info'>
                        <div className='channel-pro-playlist-controls'>
                            <div className='channel-pro-pl-name'>{pl.name}</div>
                            <p className='channel-pro-pl-description'>{pl.description}</p>          
                        </div>
                        {pl.videos.length===0?(<p>No videos in the playlist yet</p>):(
                        <div>
                            <div className='channel-pro-total'>Total videos: {pl.videos.length}</div>
                            <div className='channel-pro-videos'>{pl.videos.map((v)=>{return<VideoCard key={v._id} video={v}/>})}</div>
                        </div>)}
                    </div>
                    ))
                )}
            </div>}
        </div>
    </div>
    )
}

export default ChannelProfile;