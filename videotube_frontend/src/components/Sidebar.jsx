import React,{useContext} from "react";
import { NavLink } from "react-router-dom";
import { isAuthContext } from "../context/context";
import "./Sidebar.css";

const Sidebar = ({setShowSidebar}) => {
  const values=useContext(isAuthContext);
  const user=JSON.parse(localStorage.getItem("user"));


  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <NavLink onClick={()=>{setShowSidebar(false)}} to="/" end className={({isActive})=>isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-icon"><i className="fa-solid fa-house"></i></span><span className="sidebar-text">Home</span>
        </NavLink>

        {values.isLoggedIn && <NavLink onClick={()=>{setShowSidebar(false)}} to="/subscriptions" className={({ isActive })=>isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-icon"><i className="fa-solid fa-play"></i></span><span className="sidebar-text">Subscriptions</span>
        </NavLink>}

        {values.isLoggedIn && <NavLink onClick={()=>{setShowSidebar(false)}} to="/liked" className={({ isActive })=>isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-icon"><i className="fa-solid fa-thumbs-up"></i></span><span className="sidebar-text">Liked Videos</span>
        </NavLink>}

        {values.isLoggedIn && <NavLink onClick={()=>{setShowSidebar(false)}} to={`/playlist/user/${user._id}`} className={({isActive})=>isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-icon"><i className="fa-solid fa-folder"></i></span><span className="sidebar-text">Playlists</span>
        </NavLink>}

        {values.isLoggedIn && <NavLink onClick={()=>{setShowSidebar(false)}} to="/tweets" className={({ isActive })=>isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-icon"><i className="fa-solid fa-comment"></i></span><span className="sidebar-text">Tweets</span>
        </NavLink>}

        {values.isLoggedIn && <NavLink onClick={()=>{setShowSidebar(false)}} to="/dashboard" className={({ isActive })=>isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-icon"><i className="fa-solid fa-chart-line"></i></span><span className="sidebar-text">Dashboard</span>
        </NavLink>}
      </div>
    </aside>
  );
};

export default Sidebar;
