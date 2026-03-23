import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/").post(verifyJWT,createPlaylist)

router
    .route("/:playlistId")
    .get(verifyJWT,getPlaylistById)
    .patch(verifyJWT,updatePlaylist)
    .delete(verifyJWT,deletePlaylist);

router.route("/:playlistId/add/:videoId").patch(verifyJWT,addVideoToPlaylist);
router.route("/:playlistId/remove/:videoId").patch(verifyJWT,removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router