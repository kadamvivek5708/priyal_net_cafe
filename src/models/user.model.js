import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default: 'admin'
    },
},{timestamps:true})

export const User = mongoose.model("User", userSchema)
