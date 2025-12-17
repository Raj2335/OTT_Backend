import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, // Cloudinary URL
        required: true
    },
    thumbnail: {
        type: String, // Cloudinary URL
        required: true
    },
    title: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Count only characters (excluding spaces)
                const charCount = v.replace(/\s+/g, '').length;
                return charCount <= 35;
            },
            message: props => "Title cannot exceed 35 characters "
        }
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: String,
        default: "108k"
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

// Add indexes for faster querying
videoSchema.index({ owner: 1, createdAt: -1 })
videoSchema.index({ title: "text" })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)
