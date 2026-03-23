import React, { useEffect,useState,useContext } from 'react'
import './watch.css'
import { isAuthContext } from '../context/context';
import ChannelInfo from './ChannelInfo';
import { getVideos } from '../api/VideoApi';
import { getCurrentVideo, addView, getVideoLikes,addComment } from '../api/WatchVideo'
import { getComments } from '../api/GetComment';
import VideoCard from '../components/VideoCard';
import { useParams } from 'react-router-dom';
import Comment from './Comment';
import { checkIsVideoLiked,toggleVideoLike } from '../api/Likes';
import { getUserPlaylists, addVideToPlaylist } from '../api/GetUsersPlalists';

const Watch =()=>{
  const values=useContext(isAuthContext)
  const {videoId}=useParams()
  const [videos, setVideos]=useState([]);
  const [video,setVideo]=useState(null);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState(1);
  const [limit,setLimit]=useState(10);
  const [comments,setComments]=useState([]);
  const [hasNextPage,setHasNextPage]=useState(true);
  const [playlists,setPlaylists]=useState([])
  const [showplay,setShowplay]=useState(false)
  let [isLiked,setIsLiked]=useState(false);
  const [msg,setMsg]=useState(null);
  const user=JSON.parse(localStorage.getItem('user'))
  const [likes,setLikes]=useState(0)
  const [newComment,setNewComment]=useState("");
  const [commentToEdit,setCommentToEdit]=useState("")

  useEffect(()=>{
  if(!videoId)return;
  let isMounted=true;

  const fetchVideo=async()=>{
    try{
      setLoading(true);
      const res=await getCurrentVideo(videoId);
      if(isMounted){
        setVideo(res.data.data);
      }
    }catch(e){
      console.log(e);
    }finally{
      if(isMounted){
        setLoading(false);
      }
    }
  };

  fetchVideo();
    return()=>{
      isMounted=false;
    };
  },[videoId]);

  useEffect(() => {
    if (!videoId) return;

    const viewedKey = `viewed_${videoId}`;
    if (sessionStorage.getItem(viewedKey)) return;

    const timer = setTimeout(async() => {
      const response=await addView(videoId);
      sessionStorage.setItem(viewedKey, "true");
    }, 5000);
    return () => clearTimeout(timer);
  }, [videoId]);


  useEffect(()=>{
    const fetchVideos=async()=>{
      try{
        const response=await getVideos();
        setVideos(response.docs);
      }catch(e){
        console.error(e);
      }
    }
    fetchVideos()
  },[]);

  useEffect(()=>{
    if(!videoId) return;

    const fetchLikeStatus=async()=>{
      if(!values.isLoggedIn){return;}
      try{
        const res=await checkIsVideoLiked(videoId);
        setIsLiked(res.data.data);
      }catch(e){
        console.log(e);
      }
    };

    fetchLikeStatus();
  },[videoId]);

  useEffect(()=>{
    if(!videoId)return;
    const fetchComments=async()=>{
      if(!values.isLoggedIn){return;}
      try{
        const res=await getComments(videoId,page,limit);
        const newComments=res.data.docs;
        setComments(prev=>page===1?newComments:[...prev,...newComments]);
        setHasNextPage(res.data.hasNextPage);
      }catch(e){
        console.log(e);
      }
    };
    fetchComments();
  },[videoId,page]);

  useEffect(()=>{
    getLikes()
    setPage(1);
  }, [videoId]);
  
  const loadMore=()=>{if(hasNextPage){setPage(prev=>prev+1);}};

  const handleLike=async()=>{
    try{
      const res=await toggleVideoLike(videoId);
      if(isLiked){
        setLikes(prev=>prev-1);
      }else{
        setLikes(prev=>prev+1);
      }
      setIsLiked(prev=>!prev);
    }catch(e){
      console.log(e);
    }
  };

  const getPlaylists=async()=>{
    try{
      const response=await getUserPlaylists(user._id)
      setShowplay(true)
      setPlaylists(response.data.data)
    }catch(e){
      console.log(e)
    }
  }

  const addVideoToPl=async(playlistId)=>{
    try{
      const response=await addVideToPlaylist(playlistId,videoId)
      setMsg(response.data.message)
      setShowplay(false)
      setTimeout(()=>setMsg(null),5000);
    }catch(e){
      console.log(e);
    }   
  }

  const getLikes=async()=>{
    try{
      const response=await getVideoLikes(videoId)
      setLikes(response.data.likeCount)
    }catch(e){
      console.log(e)
    }
  }

  const addNewComment = async () => {
    try {
      const res = await addComment(videoId, newComment);
      const createdComment = res.data.data;

      const formattedComment={...createdComment,userInfo:{avatar: user.avatar,username: user.username}};

      setComments(prev=>[formattedComment,...prev]);
      setNewComment("");

    } catch(e){
      console.log(e);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (!video) return <div>Video not found</div>;
  return (
    <div className='watch-section'>
      <div className='about-current-watch'>
        <div className='watch-playing'>
          <video key={videoId} width="80%" height="500" controls>
            <source src={video.videoFile} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <div>
            <h2>{video.title}</h2>
            {values.isLoggedIn && <div className='watch-buttons'>
              <button onClick={handleLike}>
                {likes+" "}
                {isLiked ? <i className="fa-solid fa-thumbs-up"></i> : <i className="fa-regular fa-thumbs-up"></i>}
              </button>
              <button onClick={()=>getPlaylists()}>Add to Playlist</button>
              {msg!==null && <div>{msg}</div>}
              {showplay && (
                <div className="watch-addToPlaylist">

                  <div className="watch-playlist-header">
                    <span>Add to Playlist</span>
                    <i className="fa-solid fa-xmark" onClick={()=>setShowplay(false)}></i>
                  </div>

                  {playlists.length===0?(
                    <p className="watch-empty">No playlists found</p>) 
                    : (playlists.map((pl)=>(
                      <div key={pl._id}onClick={() => addVideoToPl(pl._id)} className="playlist-info">
                        <div className="watch-name">{pl.name}</div>
                        <p className="watch-description">{pl.description || "No description"}</p>
                        <p className="watch-total">{pl.videos.length} video{pl.videos.length!==1 && "s"}</p>
                      </div>
                    ))
                  )}

                </div>
              )}
            </div>}
          </div>
        </div>

        <div className='watch-channel-info'>
          <ChannelInfo owner={video.owner}/>
        </div>

        <div className='watch-info'>
          <p>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
          <hr />
          <p>{video.description}</p>
        </div>
        {values.isLoggedIn && <div className='watch-video-comments'>
          <h3>Comments</h3>
          <form 
            className='watch-add-comment'
            onSubmit={(e) => {
              e.preventDefault();
              addNewComment();
            }}
          >
            
            <h5>Add Comment</h5>
            <div className='watch-add-comment-fl'>
              <input
                onChange={(e)=>setNewComment(e.target.value)}
                required
                placeholder='Type Comment Here...'
                value={newComment}
                type="text"
                className='watch-add-comment-ip'
              />
              <button className='watch-add-comment-btn' type="submit">Add +</button>
            </div>
          </form>
          {comments.length===0?(<p>No comments yet</p>):(
            comments.map((c)=>(
              <Comment 
                key={c._id} 
                commentId={c._id} 
                avatar={c.userInfo.avatar} 
                username={c.userInfo.username} 
                date={c.createdAt} 
                content={c.content} 
                owner={c.userInfo._id}
                commentToEdit={commentToEdit}
                setCommentToEdit={setCommentToEdit}
              />
            ))
          )}

          {hasNextPage && (
            <button onClick={loadMore}>Load More</button>
          )}
        </div>}

      </div>
      <div className='watch-more-videos'>
        {videos.length===0 ? (<p>No videos found</p>):(
            videos.map((v)=>(v._id!==videoId && <VideoCard key={v._id} video={v}/>))
          )}
        </div>
    </div>
  )
};

export default Watch;