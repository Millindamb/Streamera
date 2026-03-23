import React, { useState } from 'react'
import './Register.css'
import { registerUser } from '../api/Register'
import { Link,useNavigate } from 'react-router-dom'

const Register = () => {
  const [isLoading,setIsLoading]=useState(false);
  const navigate=useNavigate()
  const [error,setError]=useState("");
  const [profilePicture,setProfilePicture]=useState()
  const [coverPicture,setCoverPicture]=useState()
  const [name,setName]=useState('')
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const handleRegister=async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      const response=await registerUser(name,email,username,password,profilePicture,coverPicture);
      if (response.data.success){
        navigate("/users/login")
        alert(`You are successfully sign-in with (${username}). Please log-in.`)
      }else{
        setError(response.data.Error)
      }
    }catch(err){
      const status=err.response?.status;
      if(status===409){
        setError("User with this username already exists.");
      }else if(status===400){
        setError("Invalid input data.");
      }else{
        setError("Registration failed. Try again.");
      }
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <div className="register-center">
      <div className="register-box">
        <div className="register-text">
          <h2>Create an Account</h2>
          <p>Join Streamera and start Streaming</p>
        </div>
        <div className="register-input">
          <div className="register-image-upload">
            <label>Upload Profile Picture</label>
            <input type="file" accept="image/*" required onChange={(e)=>setProfilePicture(e.target.files[0])}/>
            <label>Upload Cover Image</label>
            <input type="file" accept="image/*" required onChange={(e)=>{setCoverPicture(e.target.files[0])}}/>
          </div>
          <form className="register-details" onSubmit={handleRegister}>
            <label>Name</label>
            <input type="text" placeholder="Enter your name" autoComplete='Name' required onChange={(e)=>{setName(e.target.value)}}/>

            <label>Username</label>
            <input type="text" placeholder="Choose a username" required onChange={(e)=>{setUsername(e.target.value)}}/>

            <label>Email</label>
            <input type="email" placeholder="Enter your email" autoComplete='email' required onChange={(e)=>{setEmail(e.target.value)}}/>

            <label>Password</label>
            <input type="password" placeholder="Create a password" autoComplete="new-password" required onChange={(e)=>{setPassword(e.target.value)}}/>

            {error && <div className='error' style={{color:'red'}}>{error}</div>}

            <div className="register-btn">
              <button type="submit" disabled={isLoading} style={{cursor:isLoading ? "not-allowed":"pointer",opacity: isLoading ? 0.5:1,}}> {isLoading ? "Signing Up...":"Sign Up"}</button>
            </div>
          </form>
          <div className='register-desc'>
            <p>Already have an account? <Link to="/users/login" className='login'>Sign-in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
