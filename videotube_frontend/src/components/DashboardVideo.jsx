import React, { useState } from 'react'
import './DashboardVideo.css'
import { togglePublish, deleteVideo, updateVideo } from '../api/Dashboard'

const DahsboardVideo = ({video,onDelete}) => {
  const [title,setTitle]=useState(video.title)
  const [description,setDescription]=useState(video.description)
  const [thumbnailFilePath,setThumbnailFilePath]=useState(null)
  const [canEdit,setCanEdit]=useState(false);
  const [pub,setPub]=useState(video.isPublished);
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now - created) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const toggleVideoPublish=async()=>{
    try{
      const response=await togglePublish(video._id)
      setPub(!pub)
    }catch(e){
      console.log(e)
    }
  }

  const deleteUserVideo=async()=>{
    try{
      await deleteVideo(video._id);
      onDelete(video._id)
    }catch(e){
      console.log(e)
    }
  }

  const updateCurrentVideo=async()=>{
    try{
      await updateVideo(video._id,title,description,thumbnailFilePath);
      setCanEdit(false);
    }catch(e){
      console.log(e);
    }
  };

  return (
    <div className="dashboardVideo">
      {canEdit ? (
        <div className="dashboardVideo-updateUserVideo">
          <form onSubmit={(e)=>{ e.preventDefault(); updateCurrentVideo();}} className="editForm">
            <h3>Edit Video</h3>
            <div className="dashboardVideo-formGroup">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
            </div>

            <div className="dashboardVideo-formGroup">
              <label>Description</label>
              <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows="3" required/>
            </div>

            <div className="dashboardVideo-formGroup">
              <label>Thumbnail</label>
              <input type="file" onChange={(e)=>setThumbnailFilePath(e.target.files[0])}/>
            </div>

            <div className="dashboardVideo-editButtons">
              <button type="submit" className="updateBtn">
                Update
              </button>
              <button
                type="button"
                className="cancelBtn"
                onClick={()=>setCanEdit(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : 
      <>
        <div className='dashboardVideo-info'>
          <div className='dashboardVideo-thumbnail'>
            <img src={video.thumbnail} alt={video.title}/>
          </div>
          <div className='dashboardVideo-info'>
            <div>{video.title}</div>
            <div className='dashboardVideo-addition-info'><p>{video.views} views</p><p>{formatTimeAgo(video.createdAt)}</p></div>
          </div>
        </div>
        <div className='dashboardVideo-options'>
          <div className='dashboardVideo-public'>
            <p></p>
            <button onClick={()=>{toggleVideoPublish()}}>{pub?"Make Private":"Make Public"}</button>
          </div>
          <div className='dashboardVideo-editVideo'><button onClick={()=>{setCanEdit(true)}}><i className="fa-solid fa-pen"></i></button></div>
          <div className='dashboardVideo-deleteVideo' onClick={()=>{deleteUserVideo()}}><button>DELETE</button></div>
        </div>
      </>}
    </div>
  )
}

export default DahsboardVideo
