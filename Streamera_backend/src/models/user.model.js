import mongoose, { Mongoose, Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            index:true,//using index allows to optimizely search a field
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String,//cloudNary URL
            required:true
        },
        coverImage: {
            type: String, //cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video",
            }
        ],
        password:{
            type:String,//in the form of encrypted text using library like bcrypt
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String
        }
    },
    {timestamps:true}
)

//to save encrypted password
userSchema.pre("save",async function (){//here the same is the event on just before which the function will get execute
    //there is a problem in this code as this will excrypt password everytime unnessecary(to solve this using a if condition)
    if(!this.isModified("password")){
        return //next()
    }

    this.password=await bcrypt.hash(this.password,10)//here the bcrypt will encrypt the password by performing 10 rounds
    //next()
})

//designing a custom method to check wheather the password enter by user is correct or not
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)//either the result will be true or false
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(//this will the generate the token and will return it
        {//giving the payload for the signing 
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(//this will the generate the token and will return it
        {//it is just like the access token but have less data as it refresh more times
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema);