import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try{
        //holding the responseafter connecting the database
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)//to check the server on which we are connecting
        console.log(`${connectionInstance}`)
    }catch(error){
        console.error("MONGODB connection error",error);
        process.exit(1);//here the process is the reference of the our running application
    }
}

export default connectDB