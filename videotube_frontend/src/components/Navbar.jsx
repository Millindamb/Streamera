import React,{ useState,useContext,useEffect,useRef } from "react";
import{ isAuthContext } from "../context/context";
import{ Link,useNavigate } from "react-router-dom";
import{ logoutUser } from "../api/logout";
import "./Navbar.css";
import logo from '../assets/Streamera.svg'

const Navbar=({ showSidebar,setShowSidebar })=>{
  const values=useContext(isAuthContext);
  const navigate=useNavigate();
  const user=JSON.parse(localStorage.getItem("user"));

  const [searchQuery,setSearchQuery]=useState("");
  const [darkMode,setDarkMode]=useState(!document.body.classList.contains("light-mode"));
  const [dropdownOpen,setDropdownOpen]=useState(false);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      const token = localStorage.getItem("accessToken");

      if (token) {
        localStorage.removeItem("accessToken");
      }

      localStorage.removeItem("refreshToken");
      values.setLoggedIn(false);
      setDropdownOpen(false);
      navigate("/");
    }
  };

  const handleSearch=(e)=>{
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTheme=()=>{
    document.body.classList.toggle("light-mode");
    setDarkMode(!document.body.classList.contains("light-mode"));
  };

  return(
    <header className="navbar">
      <div className="nav-left">
        <button onClick={()=>setShowSidebar(!showSidebar)} className="nav-menu-btn" >
          <i className="fa-solid fa-bars"></i>
        </button>

        <Link to="/" className="logo">
          <div className="nav-logo-box">
            <img src={logo} alt="" />
          </div>
          <span className="nav-logo-text"><span className="S">S</span>treamera</span>
        </Link>
      </div>

      <form className="nav-search" onSubmit={handleSearch}>
        <input type="text" placeholder="Type anything..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      <div className="nav-right">
       {values.isLoggedIn &&(
          <button id="upload" onClick={()=>navigate("/dashboard#dashboard-upload-section")} className="nav-icon-btn" title="Upload">
            <i className="fa-solid fa-upload"></i>
          </button>
        )}

        <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle Theme">
         {darkMode ?(<i className="fa-solid fa-sun"></i>) 
         :(<i className="fa-solid fa-moon"></i>)}
        </button>

       {values.isLoggedIn &&(
          <div className="notification">
            <p>0</p>
            <button className="nav-icon-btn" title="Notifications">
              <i className="fa-solid fa-bell"></i>
            </button>
          </div>          
        )}

       {values.isLoggedIn &&(
          <div onMouseEnter={()=>setDropdownOpen(true)} onMouseLeave={()=>{setDropdownOpen(false)}}>
            <div className="nav-avatar">
              <img src={user.avatar} alt="" />
            </div>
           {dropdownOpen &&(
              <div className="nav-dropdown">
                <div onClick={()=>{navigate(`/channel/${user.username}`);setDropdownOpen(false);}}>
                  Profile
                </div>
                <div onClick={()=>{navigate("/dashboard");setDropdownOpen(false);}}>
                  Dashboard
                </div>
                <div onClick={()=>{navigate("/settings"); setDropdownOpen(false);}}>
                  Settings
                </div>
                <hr />
                <div onClick={logout}>Logout</div>
              </div>
            )}
          </div>
        )}
        
       {!values.isLoggedIn &&(
          <button className="nav-signin-btn" onClick={()=>navigate("/users/login")}>Sign In </button>)}
      </div>
    </header>
  );
};

export default Navbar;