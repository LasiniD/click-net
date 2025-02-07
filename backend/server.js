import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import adminRoutes from "./routes/admin.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        credentials:true,
        origin:"http://localhost:5173",
    })
);  //middleware to allow cross-origin requests

app.use(express.json({limit:"5mb"}));  //middleware to parse json data
app.use(cookieParser());  //middleware to parse cookies

app.use("/api/admin",adminRoutes);
app.use("/api/auth",authRoutes); 
app.use("/api/users",userRoutes); 
app.use("/api/posts",postRoutes); 
app.use("/api/notifications",notificationRoutes); 
app.use("/api/connections",connectionRoutes); 

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});