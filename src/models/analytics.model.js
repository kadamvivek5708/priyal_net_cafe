import mongoose,{Schema} from "mongoose";

const analyticsSchema =  new Schema({
    totalVisits:{
        type:Number,
        default:0
    },
    date: {
    type: Date,
    default: Date.now,
    },
    postInteractions:[{
        postId:{
            type:mongoose.Types.ObjectId,
            ref:"Add"
        },
        views:{
            type:Number,
            default:0
        }
    }]
},{timestamps:true})

export const Analytics = mongoose.model("Analytics",analyticsSchema)
