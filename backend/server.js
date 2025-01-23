import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  //middleware to parse json data
app.use(cookieParser());  //middleware to parse cookies

app.use("/api/auth",authRoutes); 
app.use("/api/users",userRoutes); 
app.use("/api/posts",postRoutes); 

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});