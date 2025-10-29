import mongoose,{Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password Is required"]
    },
    role:{
        type: String,
        default: 'admin'
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessTokens = function(){
    return jwt.sign({
        _id: this._id,
        username:this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )   
}

UserSchema.methods.generateRefreshTokens = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )   
}

export const User = mongoose.model("User", UserSchema)
