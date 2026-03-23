import { useEffect, useState } from 'react';
import './comment.css'
import { deleteComment, updateComment } from '../api/WatchVideo';
import { checkIsCommentLiked, toggleCommentLike } from '../api/Likes';

const Comment = ({commentId,avatar,username,date,content,owner,commentToEdit,setCommentToEdit}) => {
    const user = JSON.parse(localStorage.getItem("user"))

    const [commentContent, setCommentContent] = useState(content);
    const [displayContent, setDisplayContent] = useState(content);
    const [isDeleted, setIsDeleted] = useState(false)
    const [like,setLike]=useState(false)

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

    const updateCommentContent = async () => {
        try {
            await updateComment(commentId, commentContent);
            setDisplayContent(commentContent);
            setCommentToEdit("");
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(commentToEdit===commentId) {
            setCommentContent(displayContent);
        }
    }, [commentToEdit]);

    useEffect(()=>{
        const fetchLikeStatus=async()=>{
            try{
                const response=await checkIsCommentLiked(commentId);
                setLike(response.data.data);
            }catch(e){
                console.log(e);
            }
        };
        fetchLikeStatus();
    },[commentId]);

    const handleLike=async()=>{
        try{
            await toggleCommentLike(commentId);
            setLike(prev=>!prev)
        }catch(e){
            console.log(e)
        }
    }

    if (isDeleted) {
        return <p>Comment Deleted</p>
    }

    return (
        <div className='comment'>
            <div className='comment-part1'>
                <img src={avatar} />
            </div>

            <div className='comment-part2'>
                <div className='comment-userInfo'>
                    <p className='comment-name'>{username}</p>
                    <p className='comment-date'>{formatTimeAgo(date)}</p>
                </div>

                {commentToEdit !== commentId 
                    ? <div className='comment-content'>{displayContent}</div> 
                    : <input 
                        type='text' 
                        value={commentContent} 
                        onChange={(e)=>setCommentContent(e.target.value)} 
                        required 
                      />
                }
            </div>

            <div className="comment-like">
                <button onClick={handleLike}>{like?<i className="fa-solid fa-thumbs-up"></i>:<i className="fa-regular fa-thumbs-up"></i>}</button>
            </div>

            {user._id == owner && 
                <div className='comment-options'>
                    {commentToEdit !== commentId 
                        ? <button onClick={() => setCommentToEdit(commentId)}><i className="fa-solid fa-pen"></i> Edit</button> 
                        : <div>
                            <button onClick={updateCommentContent}><i className="fa-solid fa-upload"></i> Save</button>
                            <button onClick={()=>{setCommentToEdit("")}}><i className="fa-solid fa-xmark"></i> Cancle</button>
                        </div>
                    } 
                    {commentToEdit !== commentId && <button onClick={() => { deleteComment(commentId); setIsDeleted(true) }}>
                        Delete
                    </button>}
                </div>
            }
        </div>
    )
}

export default Comment