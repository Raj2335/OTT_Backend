import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // Add pagination to handle large number of videos
  const { page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Add timestamp for cache control/refresh
  const timestamp = new Date().getTime();
  
  // Query with pagination and sorting by most recent first
  const videos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("owner", "username fullName avatar")
    .lean(); // Use lean for better performance with large results
  
  // Check if videos are available
  if (!videos || videos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { videos: [], timestamp }, "No videos available"));
  }

  return res
    .status(200)
    .json(new ApiResponse(
      200, 
      { 
        videos,
        timestamp,
        currentPage: parseInt(page),
        hasMore: videos.length === parseInt(limit)
      }, 
      "Videos fetched successfully"
    ));
});

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { title } = req.body;

    if (!title) {
      throw new ApiError(400, "Title is required");
    }

    // Check title character count (excluding spaces)
    const charCount = title.replace(/\s+/g, '').length;
    if (charCount > 35) {
      throw new ApiError(400, "Title cannot exceed 35 characters");
    }

    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
      throw new ApiError(400, "Both video and thumbnail files are required");
    }

    const videoLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    console.log("Local paths:", { videoLocalPath, thumbnailLocalPath });

    // Check if the temporary files exist
    const fs = await import('fs');
    const videoFileExists = fs.existsSync(videoLocalPath);
    const thumbnailFileExists = fs.existsSync(thumbnailLocalPath);
    
    console.log("File existence check:", { videoFileExists, thumbnailFileExists });
    
    if (!videoFileExists || !thumbnailFileExists) {
      throw new ApiError(400, `File access error: Video exists: ${videoFileExists}, Thumbnail exists: ${thumbnailFileExists}`);
    }

    // Upload video file to Cloudinary
    const video = await uploadOnCloudinary(videoLocalPath);
    console.log("Video upload response:", video);
    
    if (!video) {
      throw new ApiError(400, "Video upload to Cloudinary failed");
    }

    // Upload thumbnail to Cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log("Thumbnail upload response:", thumbnail);
    
    if (!thumbnail) {
      throw new ApiError(400, "Thumbnail upload to Cloudinary failed");
    }

    // Create video record in database
    const newVideo = await Video.create({
      title,
      videoFile: video.url,
      thumbnail: thumbnail.url,
      owner: req.user._id,
      duration: video.duration || 0, // Provide default duration if not available
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newVideo, "Video uploaded successfully"));
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    // Return a more descriptive error response
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(
        error.statusCode || 500, 
        null, 
        `Video upload failed: ${error.message}`
      ));
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId).populate(
    "owner",
    "username fullName avatar"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to delete this video");
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const searchVideos = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.trim() === "") {
    return res
      .status(200)
      .json(new ApiResponse(200, { videos: [] }, "No search query provided"));
  }

  // Get all published videos
  const videos = await Video.find({ isPublished: true })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 })
    .lean();
  
  // Normalize query for case-insensitive search
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  // Filter videos using JavaScript methods
  const filteredVideos = videos.filter(video => {
    // Check if title contains any search term
    const titleMatch = video.title && searchTerms.some(term => 
      video.title.toLowerCase().includes(term)
    );
    
    // Check if owner's fullName contains any search term
    const ownerMatch = video.owner && video.owner.fullName && searchTerms.some(term => 
      video.owner.fullName.toLowerCase().includes(term)
    );
    
    return titleMatch || ownerMatch;
  });
  
  // Limit results to 12 videos
  const limitedResults = filteredVideos.slice(0, 12);

  return res
    .status(200)
    .json(new ApiResponse(
      200, 
      { videos: limitedResults }, 
      limitedResults.length > 0 ? "Videos found" : "No videos found"
    ));
});

const getUserVideos = asyncHandler(async (req, res) => {
  // Get videos uploaded by the current user
  const videos = await Video.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate("owner", "username fullName avatar")
    .lean();
  
  return res
    .status(200)
    .json(new ApiResponse(
      200, 
      videos, 
      "User videos fetched successfully"
    ));
});

export { getAllVideos, uploadVideo, getVideoById, deleteVideo, searchVideos, getUserVideos };
