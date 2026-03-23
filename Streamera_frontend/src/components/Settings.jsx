import React,{ useState } from 'react'
import { updateAvatar,updateCoverImage,updateNameAndEmail,updatePassword } from '../api/Update'
import './Settings.css'

const Settings=() => {
  const [currentPart,setCurrentPart]=useState(true)
  const user=JSON.parse(localStorage.getItem('user'))
  const [fullname,setFullname]=useState(user.fullName)
  const [email,setEmail]=useState(user.email)
  const [avatar,setAvatar]=useState(null)
  const [coverImage,setCoverImage]=useState(null)
  const [updatedCoverImage,setUpdatedCoverImage]=useState(user.coverImage)
  const [updatedAvatar,setUpdatedAvatar]=useState(user.avatar)
  const [toEdit,setToEdit]=useState(0);
  const [updating,setUpdating]=useState(false);
  const [error,setError]=useState(null)
  let password="";
  let newPassword="";
  let newPassword2="";

  const updateUserNameAndEmail=async()=>{
    setUpdating(true);
    try {
      const response=await updateNameAndEmail(fullname,email);

      const updatedUser=response.data.data;

      localStorage.setItem("user",JSON.stringify(updatedUser));

      setToEdit(0);
    } catch (e) {
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };

  const updateUserCoverImage=async()=>{
    setUpdating(true);
    try {
      const response=await updateCoverImage(coverImage);

      const updatedUser=response.data.data;

      setUpdatedCoverImage(updatedUser.coverImage);
      localStorage.setItem("user",JSON.stringify(updatedUser));

      setToEdit(0);
    } catch (e) {
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };

  const updateUserAvatar=async()=>{
    setUpdating(true);
    try {
      const response=await updateAvatar(avatar);

      const updatedUser=response.data.data;

      setUpdatedAvatar(updatedUser.avatar);
      localStorage.setItem("user",JSON.stringify(updatedUser));
      setToEdit(0);
    } catch (e) {
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };

  const updateUserPassword=async()=>{
    setError("");
    if(newPassword!==newPassword2){
      setError("Passwords do not match");
      return;
    }
    if(password===newPassword){
      setError("New Password Must Be Different")
      return;
    }
    try{
      const response=await updatePassword(password, newPassword);
      setError("Password Updated Successfully")
    }catch(e){
      const status=e.response?.status;
      switch(status){
        case 400:
          setError(e.response?.data?.message || "Invalid Input");
          break;
        case 401:
          setError("Unauthorized. Please login again.");
          break;
        case 404:
          setError("User not found.");
          break;
        case 500:
          setError("Server error. Please try again later.");
          break;
        default:
          setError("Something went wrong.");
      }
    }finally{
      password=""
      newPassword=""
      newPassword2=""
    }
  };

  return (
    <div className='settings'>
      <div className='settings-option'>
        <button onClick={()=>{setCurrentPart(true)}}>Profile</button>
        <button onClick={()=>{setCurrentPart(false)}}>Password</button>
      </div>
      {currentPart?<div className='settings-updateDetails'>
        
        {toEdit===1?<form className='settings-form1' onSubmit={(e)=>{e.preventDefault();updateUserNameAndEmail()}}>
          <p>Full Name</p>
          <input type="text" className='settings-form1-input' required value={fullname} onChange={(e)=>{setFullname(e.target.value)}}/>
          <p>Email</p>
          <input type="text" className='settings-form1-input' required value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
          <button type='submit'>Update</button><button type='button' onClick={()=>setToEdit(0)}>Cancel</button>
        </form>:
        <div>
          {updating && (toEdit===1)?<div>Updating...</div>
          :<div className='settings-form1-view'>
            <p>Full Name</p>
            <div className='settings-form1-fullname'>{fullname}</div>
            <p>Email</p>
            <div className='settings-form1-email'>{email}</div>
            <button onClick={()=>setToEdit(1)}>Edit</button>
          </div>}
        </div>}
        
        {toEdit===2?<form className='settings-form2' onSubmit={(e)=>{e.preventDefault();updateUserCoverImage()}}>
          {updating && (toEdit===2)?<div>Updating...</div>
          :<div className='settings-form2-edit'>
            <p>Cover Image</p>
            <input className='settings-form2-coverImage' type="file" required accept="image/*" onChange={(e)=>{setCoverImage(e.target.files[0])}}/>
            <button type='submit'>Update</button><button type='button' onClick={()=>setToEdit(0)}>Cancel</button>
          </div>}
        </form>:<div className='settings-form2-view'>
          <img src={updatedCoverImage} alt="user cover image" />
          <button onClick={()=>setToEdit(2)}>Edit</button>
        </div>}
        
        {toEdit===3?<form className='settings-form3' onSubmit={(e)=>{e.preventDefault();updateUserAvatar()}}>
          {updating && (toEdit===3)?<div>Updating...</div>
          :<div className='form3-edit'>
            <p>Avatar Image</p>
            <input className='settings-form3-avatar' type="file" required accept="image/*" onChange={(e)=>{setAvatar(e.target.files[0])}}/>
            <button type='submit'>Update</button><button type='button' onClick={()=>setToEdit(0)}>Cancel</button>
          </div>}
        </form>:<div className='settings-form3-view'>
          <img src={updatedAvatar} alt="user avatar image" />
          <button onClick={()=>setToEdit(3)}>Edit</button>
        </div>}
      </div>:
      <div className='settings-updatePassword'>
        <form className='settings-password-form' onSubmit={(e)=>{e.preventDefault();updateUserPassword();}}>
          <h2>Change Password</h2>
          <p>Current Password</p>
          <input className='settings-password-input' type="password" required onChange={(e)=>{password=e.target.value}}/>

          <p>New Password</p>
          <input className='settings-password-input' type="password" required onChange={(e)=>{newPassword=e.target.value}}/>

          <p>Confirm Password</p>
          <input className='settings-password-input' type="password" required onChange={(e)=>{newPassword2=e.target.value}}/>
          
          {error && <div className='error-section'>{error}</div>}
          <button type='submit'>Change Password</button>
        </form>
      </div>}
    </div>
  )
}

export default Settings
