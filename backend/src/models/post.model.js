import mongoose,{Schema} from "mongoose";

const PostSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    postName:{
        type:String,
        required:true
    },
    ageLimit:{
        type:String,
        required:true
    },
    qualifications:{
        type:String,
        required:true
    },
    fees:{
        type:String,
        required:true
    },
    lastDate:{
        type:Date,
        required:true
    },
    author:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type: String,
        enum: ['भरती', 'ऑनलाईन अर्ज', 'स्पर्धा परीक्षा', 'निकाल', 'इतर']
    },
    startDate:{
        type:Date
    },
    documentsRequired:{
        type:String
    },
    source:{
        type:String
    },
    isActive:{
        type: Boolean,
        default: true,
    },

    // Analytics for specific add
    postViews:{
        type:Number,
        default:0
    }
    
},{timestamps:true})

export const Post = mongoose.model("Post", PostSchema)
