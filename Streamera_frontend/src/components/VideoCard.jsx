import React from "react";
import "./VideoCard.css";
import {NavLink} from 'react-router-dom'

const formatCount = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count;
};

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

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <NavLink to={`/watch/${video._id}`} className="video-card-thumbnail">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="thumbnail"
        />
        <span className="duration">
          {video.duration}s
        </span>
      </NavLink>

      <div className="video-card-info">
        <NavLink to={`/watch/${video._id}`} className="video-card-title">
          {video.title}
        </NavLink>

        <p className="video-card-meta">
          {formatCount(video.views)} views •{" "}
          {formatTimeAgo(video.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
