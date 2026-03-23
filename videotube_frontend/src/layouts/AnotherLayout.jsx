import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

const AnotherLayout = () => {
  return (
    <div style={{display:"flex"}}>
        <div style={{flex: 1}}>
            <Navbar/>
            <Outlet/>
        </div>
    </div>
  )
}

export default AnotherLayout
