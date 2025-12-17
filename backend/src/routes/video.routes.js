import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken";
import {
  getAllVideos,
  uploadVideo,
  getVideoById,
  deleteVideo,
  searchVideos,
  getUserVideos
} from "../controllers/video.controller.js";

const router = Router();

// Remove global verifyJWT, only protect upload and delete routes

router
  .route("/")
  .get(getAllVideos) // feed / homepage (public)
  .post(
    verifyJWT,
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    uploadVideo
  );

router.route("/search").get(searchVideos); // search endpoint (public)
router.route("/user-videos").get(verifyJWT, getUserVideos); // get current user's videos (auth)

// Create optional auth middleware
const optionalAuth = (req, res, next) => {
  // Try to verify token, but continue if no token or invalid token
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
    } catch (error) {
      // Continue without user authentication
    }
  }
  next();
};

router
  .route("/:videoId")
  .get(optionalAuth, getVideoById) // watch page (public, but tracks history if logged in)
  .delete(verifyJWT, deleteVideo); // remove video (auth)

export default router;
