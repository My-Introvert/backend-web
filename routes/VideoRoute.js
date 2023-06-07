import express from "express";
import { getVideos, getVideoById, createVideo, updateVideo, deleteVideo } from "../controllers/Videos.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/videos", verifyUser, getVideos);
router.get("/videos/:id", verifyUser, getVideoById);
router.post("/videos", verifyUser, createVideo);
router.patch("/videos/:id", verifyUser, updateVideo);
router.delete("/videos/:id", verifyUser, deleteVideo);

export default router;
