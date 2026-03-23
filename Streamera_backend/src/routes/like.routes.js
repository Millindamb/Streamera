import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    checkIsVideoLiked,
    checkIsCommentLiked,
    checkIsTweetLiked,
    getVideoLikes
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/video/:videoId').get(getVideoLikes)

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

router.route("/check/v/:videoId").get(checkIsVideoLiked);
router.route("/check/c/:commentId").get(checkIsCommentLiked);
router.route("/check/t/:tweetId").get(checkIsTweetLiked);


export default router