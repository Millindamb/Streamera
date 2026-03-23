import React, { useEffect, useState, useContext } from "react";
import { isAuthContext } from "../context/context";
import { getChannelInfo, isChannelSubscribed } from "../api/watchChannel";
import { toggelSubscribe } from "../api/Togglesub";
import "./ChannelInfo.css";
import { useNavigate } from "react-router-dom";

const ChannelInfo = ({ owner }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(isAuthContext);

  const [isSubscribed, setIsSubscribed] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const isCurrentUser = user?._id === owner;

  const toggleSub = async () => {
    try {
      await toggelSubscribe(owner);

      setChannelInfo((prev) => ({
        ...prev,
        subscribersCount: isSubscribed
          ? prev.subscribersCount - 1
          : prev.subscribersCount + 1,
      }));

      setIsSubscribed((prev) => !prev);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await getChannelInfo(owner);
        const data = res.data.data;

        setChannelInfo(data);

        if (isLoggedIn && !isCurrentUser) {
          const subRes = await isChannelSubscribed(owner);
          const subscribed =
            subRes?.data?.data?.isSubscribed ??
            subRes?.data?.data ??
            false;

          setIsSubscribed(!!subscribed);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [owner, isLoggedIn,isSubscribed]);

  if (loading) return <div>Loading...</div>;
  if (!channelInfo) return <div>Channel not found</div>;

  return (
    <div className="channel-info">
      <div
        className="channel-left"
        onClick={() => navigate(`/channel/${channelInfo.username}`)}
      >
        <img
          className="channel-avatar"
          src={channelInfo.avatar}
          alt="avatar"
        />

        <div className="channel-text">
          <p className="chn-name">{channelInfo.username}</p>
          <p className="chn-sub">
            {channelInfo.subscribersCount} subscribers
          </p>
        </div>
      </div>

      {isLoggedIn && !isCurrentUser && isSubscribed !== null && (
        <button
          onClick={toggleSub}
          className={isSubscribed ? "subscribed-btn" : "subscribe-btn"}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      )}
    </div>
  );
};

export default ChannelInfo;