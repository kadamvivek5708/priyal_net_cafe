import mongoose,{Schema} from "mongoose";

const servicesSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        trim:true
    },
    documentsRequired:{
        type:[String],
        required:true,
        default:[]
    },
    fees:{
        type:String,
        default: 'N/A'
    },
    processingTime:{
        type: String, 
    },
    author:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const Services = mongoose.model("Services" , servicesSchema)