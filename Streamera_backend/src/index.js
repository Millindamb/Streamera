// require('dotenv').config({path:'./env'})//this line effect code consistency
//to solve this we use 
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config({
  path: "./.env",
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is Running");
});

// Connect DB and start server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("App Error:", error);
      throw error;
    });

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // important for Render
  });