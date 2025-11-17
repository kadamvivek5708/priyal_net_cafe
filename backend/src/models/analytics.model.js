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
            ref:"Post"
        },
        views:{
            type:Number,
            default:0
        }
    }]
},{timestamps:true})

analyticsSchema.index({ date: 1 });
analyticsSchema.index({ "postInteractions.postId": 1 });


export const Analytics = mongoose.model("Analytics",analyticsSchema)
