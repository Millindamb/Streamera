import { Router } from "express";
import { changeCurrentPassword,
        getCurrentUser,
        getUserChannelProfile, 
        getWatchHistory, 
        loginUser, 
        logoutUser, 
        refreshAccessToken, 
        registerUser, 
        updateAccountDetails, 
        updateUserAvatar, 
        updateUserCoverImage,
        getChannelInformationById,
        checkSubscribed
} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter=Router()

userRouter.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

userRouter.route('/login').post(loginUser)

//secured routes
userRouter.route('/logout').post(verifyJWT,logoutUser)//adding the verify JWT(middleware before the logout)

userRouter.route('/refresh-token').post(refreshAccessToken)

userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)

userRouter.route("/current-user").get(verifyJWT,getCurrentUser)

userRouter.route("/update-account").patch(verifyJWT,updateAccountDetails)

userRouter.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

userRouter.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

userRouter.route("/channel/:id").get(getChannelInformationById)

userRouter.route("/c/:username").get(getUserChannelProfile)

userRouter.route("/history").get(verifyJWT,getWatchHistory)

userRouter.route('/isSubscribed/:id').get(verifyJWT,checkSubscribed)

export default userRouter