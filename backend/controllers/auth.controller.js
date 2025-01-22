import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
  try {
    const {fullname, username, email, password} = req.body;

    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password should be atleast 6 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d"});

    res.cookie("jwt-clicknet", token, {
      httpOnly: true, // prevent cookie access from javascript (XSS attack)
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      sameSite: "strict", // prevent csrf
      secure: process.env.NODE_ENV === "production", // prevent man in the middle attacks
    });

    return res.status(201).json({ message: "User registered successfully" });

    //send welcome email
    const profileUrl = CLIENT_URL+"/profile/"+user.username

    try {
      await sendWelcomeEmail(user.email,user.fullname,profileUrl)
    }catch(emailError){
      console.error("Error sending welcome Email",emailError)
    }

  } catch (error) {
    console.error("signup error: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};  

export const login = async (req, res) => {
  res.send("login");
};

export const logout = async (req, res) => {
  res.send("logout");
};