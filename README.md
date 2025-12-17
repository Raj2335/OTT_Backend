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
   CORS_ORIGIN=*
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run the application**
   ```bash
   npm start
   ```

## API Endpoints

### Users

- `POST /api/v1/users/register` - Register user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/profile` - Get profile
- `PATCH /api/v1/users/update` - Update profile
- `PATCH /api/v1/users/avatar` - Update avatar

### Videos

- `POST /api/v1/videos/upload` - Upload video
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:id` - Get video by ID
- `PATCH /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video

## Authentication

Protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```
