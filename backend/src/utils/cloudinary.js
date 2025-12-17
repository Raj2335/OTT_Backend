import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
          
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided for Cloudinary upload");
            return null;
        }
        
        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.error(`File not found at path: ${localFilePath}`);
            return null;
        }
        
        console.log(`Attempting to upload file from: ${localFilePath}`);
        
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // file has been uploaded successfully
        console.log(`Successfully uploaded to Cloudinary. Public URL: ${response.url}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error(`Cloudinary upload failed for ${localFilePath}:`, error.message);
        
        // Only try to delete the file if it exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        }
        
        return null;
    }
}

export { uploadOnCloudinary }
