import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    getSpecificChannelVideo,
    updateVideo,
    addView
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
//router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos);

router
    .route("/c")
    .get(getSpecificChannelVideo)

router
    .route("/:videoId")
    .get(getVideoById);

router
    .route("/")
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .delete(verifyJWT,deleteVideo)
    .patch(verifyJWT,upload.single("thumbnailFilePath"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT,togglePublishStatus);

router.post("/:videoId/view", addView);
export default router