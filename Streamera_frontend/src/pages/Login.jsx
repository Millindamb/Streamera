import React,{useContext,useState} from 'react'
import './Login.css'
import { isAuthContext } from '../context/context'
import { Link,useNavigate } from 'react-router-dom'
import { loginInUser } from '../api/Login'

const Login = () => {
  const [isLoading,setIsLoading]=useState(false);
  const values=useContext(isAuthContext);
  const navigate=useNavigate();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault()
    setIsLoading(true);
    try {
      const response=await loginInUser(username, password)

      if (response.data.success){
        localStorage.setItem("accessToken", response.data.data.accessToken)
        localStorage.setItem("user",JSON.stringify(response.data.data.user))
        navigate("/")
        values.setLoggedIn(true)
      }else{
        setError(response.data.Error)
      }
    }catch(err){
      const status=err.response?.status;
      if(status===404){
        setError("User does not exist.");
      }else if(status===401){
        setError("Invalid user password.");
      }else{
        setError("login failed. Try again.");
      }
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <div className='login-center'>
      <form className='login-box' onSubmit={handleSubmit}>
        <div className='login-text'>
          <h2>Welcome back</h2>
          <p>Sign in to your Streamera account</p>
        </div>
        <div className='login-input'>
          <p>username</p>
          <input type="text" placeholder='user_1234' autoComplete='username' required value={username} onChange={(e)=>setUsername(e.target.value)}/>
          <p>Password</p>
          <input type="password" placeholder='************' autoComplete="password" required value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        {error && <div className='error' style={{color:'red'}}>{error}</div>}
        <div className='login-buttons'>
          <button type="submit" disabled={isLoading} style={{cursor:isLoading ? "not-allowed":"pointer",opacity: isLoading ? 0.5:1,}}> {isLoading ? "Signing-In...":"Sign-In"}</button>
        </div>
        <div className='desc'>
          <p>Don't have an account? <Link to="/users/register" className='register'>Sign-up</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Login
