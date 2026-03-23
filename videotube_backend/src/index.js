// require('dotenv').config({path:'./env'})//this line effect code consistency
//to solve this we use 
import dotenv from "dotenv"//then configure it
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({path:"./.env"})//but to still use by importing 
//we have to the modify the dev inside the scripts inside the package.json 
// to: "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"

app.get('/',(req,res)=>{
    res.send("Backend is Running")
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error :",error);
        throw error;
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port :${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGO db connection failed !!!",error);
})
