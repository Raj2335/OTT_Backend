# OTT_Backend
BCA 2023-27 Internship Project - OTT PLATFORM


Backend for an OTT streaming platform built with Node.js, Express, and MongoDB.


## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (file uploads)
- Cloudinary (media storage)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure `.env` file**

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```

## API Endpoints

### Users

- `POST /api/v1/users/register` - Register user (with avatar & coverImage)
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user (protected)
- `GET /api/v1/users/:id` - Get user profile

### Videos

- `POST /api/v1/videos` - Upload video (protected)
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/search` - Search videos
- `GET /api/v1/videos/user-videos` - Get current user's videos (protected)
- `GET /api/v1/videos/:videoId` - Get video by ID
- `DELETE /api/v1/videos/:videoId` - Delete video (protected)

## Authentication

Protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

