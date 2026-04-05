import React, { useEffect, useState } from 'react'
import { getTweets,createTweet,deleteTweets, updateTweet } from '../api/Tweet'
import './Tweet.css'

const Tweets = () => {
  const [tweets,setTweets]=useState({});
  const [create,setCreate]=useState(false);
  const [loading,setLoading]=useState(true);
  const [content,setContent]=useState("");
  const [update,setUpdate]=useState(null);
  const [updateContent,setUpdateContent]=useState("");
  const user=JSON.parse(localStorage.getItem('user'));

  const createNewTweet=async()=>{
    try{
      const response=await createTweet(content)
      setCreate(false)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{
    const fetchTweets=async()=>{
      try{
        const response=await getTweets(user._id);
        setTweets(response.data.data)
        setLoading(false)
      }catch(e){
        console.log(e)
      }
    }
    fetchTweets()
  },[create,update])

  const deleteUserTweet=async(tweetId)=>{
    try{
      const response=await deleteTweets(tweetId);
      setTweets(prev=>prev.filter(t=>t._id!==tweetId));
    }
    catch(e){console.log(e)}
  }

  const updateUserTweet=async()=>{
    try{
      const response=await updateTweet(update,updateContent);
      setUpdate(null);
      setUpdateContent(null)
    }catch(e){
      console.log(e)
    }
  }

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

  return (
    <div className='tweet'>
      <div className='tweet-createTweet'>
        <button onClick={()=>{setCreate(!create)}}>Create Tweet</button>
        {create && <form onSubmit={(e)=>{ e.preventDefault(); createNewTweet(); }} className='tweet-inputs'>
          <p>Content</p>
          <input type="text" placeholder='Content' required onChange={(e)=>{setContent(e.target.value)}}/>
          <button type='submit'>Add</button>
        </form>}
      </div>
      {loading ? <div>Loading...</div>:
      <div className='Tweets'>
        {!tweets.length?<div>no Tweets avaliable</div>:
        tweets.map((t)=>{return(
          (update && update==t._id) ? 
          <div key={t._id}>
            <p>Content</p>
            <input type="text" required value={updateContent} onChange={(e)=>{setUpdateContent(e.target.value)}}/>
            <div className="buttons">
              <button className="delete" onClick={()=>{updateUserTweet()}}>Confirm</button>
              <button className="update" onClick={()=>{setUpdate(null)}}>Cancel</button>
            </div>
          </div>
          :<div key={t._id}>
            <div className='tweet-user-info'>
              <img src={user.avatar} alt="" />
              <div className='name'>{user.username}</div>
              <div>{formatTimeAgo(t.createdAt)}</div>
            </div>
            <div>{t.content}</div>
            <div className='tweet-buttons'>
              <button className="delete" onClick={()=>{deleteUserTweet(t._id)}}>Delete</button>
              <button className="update" onClick={()=>{setUpdate(t._id); setUpdateContent(t.content)}}>Update</button>
            </div>
          </div>
        )})}
      </div>}
    </div>
  )
}

export default Tweets
