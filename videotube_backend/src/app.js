import express from "express";
import cros from "cors"
import cookieParser from "cookie-parser";

const app = express();

//using cors and cokie-parse 
//cors allow us to setting of all the cross origin resourse sharing(app.use(cors())//as we want to use a middle ware application)

app.use(cros({
    origin:"http://localhost:5173",
    credentials:true
}))

//settings
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())//to place some cookies securely to the user browser

//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

//routes declaration
app.use("/api/v1/users",userRouter)//when the user will enter the http://.../users then it will pass the control to user.routes.js
//eg: http://localhost:8000/api/v1/users/register(the after users/ is added by the user.routes.js)

export {app}