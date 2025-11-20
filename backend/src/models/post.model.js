import mongoose,{Schema} from "mongoose";

const SeatSchema = new Schema({
    post: { type: String, required: true },   
    seats: { type: Number, required: true }    
});

const PostSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    postName:{
        type:String
    },
    seatDetails:{
        type: [SeatSchema],  
        default: [],
    },
    ageLimit:{
        type:[String],
        required:true,
        default:[]
    },
    qualifications:{
        type:[String],
        required:true,
        default:[]
    },
    fees:{
        type:[String],
        required:true,
        default:[]
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
        type:[String],
        default:[]
    },
    source:{
        type:String
    },
    totalSeats:{
        type:Number
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    others:{
        type:String
    },

    // Analytics for specific add
    postViews:{
        type:Number,
        default:0
    }
    
},{timestamps:true})

export const Post = mongoose.model("Post", PostSchema)
