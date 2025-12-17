import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

// Debug endpoint to test file uploads
router.post("/test-upload", 
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      console.log("Files received:", req.files);
      console.log("Body data:", req.body);
      
      if (!req.files || !req.files.avatar) {
        return res.status(400).json({
          success: false,
          message: "No avatar file uploaded"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "File upload successful",
        files: req.files,
        body: req.body
      });
    } catch (error) {
      console.error("Test upload error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "File upload failed"
      });
    }
  }
);

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// Get user profile and their videos
router.route("/:id").get(getUserProfile);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
