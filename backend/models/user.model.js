import mongoose, { connections } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePic: {type: String, default: ""},
    coverPhoto: {type: String, default: ""},
    isPhotographer: {type: Boolean, default: false},

    // For photographers
    bio: {type: String, maxlength: 500},
    location: {type: String},
    website: {type: String},
    socialLinks: {
        facebook: {type: String},
        twitter: {type: String},
        instagram: {type: String},
        linkedin: {type: String},
        youtube: {type: String},
        portfolio: {type: String},
    },
    experience: [{title: String, location: String, startDate: Date, endDate: Date, bestPhoto: String, contactInfo : {phone: String, email: String}}],
    qualifications: [{title: String, institution: String, fieldOfStudy: String, certificate: String}],
    
    // For general users
    connections: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

},{timestamp: true});

const User = mongoose.model("User", userSchema);

export default User;