import './app.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register.jsx'
import { Watch,Subscriptions,LikedVideos,Tweets,Settings,Playlist,SpecificPlaylist,Dashboard,ChannelProfile } from './components/index.js'
import MainLayout from './layouts/MainLayout'
import AnotherLayout from './layouts/AnotherLayout'
import {createBrowserRouter,RouterProvider} from "react-router-dom"

const App = () => {
  const router=createBrowserRouter([{
    path:'/',
    element:<MainLayout/>,
    children:[
      {path:"/",element:<Home/>},
      {path:"/watch/:videoId",element:<Watch/>},
      {path:"/subscriptions",element:<Subscriptions/>},
      {path:"/liked",element:<LikedVideos/>},
      {path:"/tweets",element:<Tweets/>},
      {path:"/settings",element:<Settings/>},
      {path:"/playlist/user/:userid",element:<Playlist/>},
      {path:"/playlist/:playlistid",element:<SpecificPlaylist/>},
      {path:"/dashboard",element:<Dashboard/>},
      {path:'/channel/:channelName',element:<ChannelProfile/>}
      ]
    },
    {
      path:'/',
      element:<AnotherLayout/>,
      children:[
        {path:'/users/login',element:<Login/>},
        {path:'users/register',element:<Register/>}
      ]
    },
  ])
  return <RouterProvider router={router}/>
}

export default App
