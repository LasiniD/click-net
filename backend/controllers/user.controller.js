import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections"); 
        
        //to find users who are not connected to us, and not us
        const suggestedUsers = await User.find({
            _id: { 
                $ne: req.user._id, $nin: currentUser.connections
            }
        }).select("name username profilePicture isPhotographer").limit(5);

        res.json(suggestedUsers);
    } catch (error) {
        console.error("Error in getSuggestedConnections: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select("-password ");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name", 
            "username",
            "profilePicture",
            "coverPhoto",
            "isPhotographer",
            "bio", 
            "location", 
            "website", 
            "socialLinks", 
            "experience", 
            "qualifications"
        ];

        const updatedData = {};

        for(const field of allowedFields) {
            if(req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }

        //check images => upload to cloudinary
        if(req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }

        if(req.body.coverPhoto) {
            const result = await cloudinary.uploader.upload(req.body.coverPhoto);
            updatedData.coverPhoto = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}