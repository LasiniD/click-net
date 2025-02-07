import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();

        const post = await Post.find({},"comments");
        const commentCount = post.reduce((total, post) => total + post.comments.length, 0);

        console.log("Stats: ", userCount, postCount, commentCount);

        res.status(200).json({userCount, postCount, commentCount});
    } catch (error) {
        res.status(500).json({message: "Error fetching stats", error});
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message:"Error finding users",error});
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: "User deleted successfully", user});
    } catch (error) {
        res.status(500).json({message:"Error deleting user",error});
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author","username email profilePicture")
            .populate("comments.user","username email profilePicture");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message:"Error finding posts",error});
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }

        res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Error deleting post",error});
    }
};

export const getComments = async (req, res) => {
    try {
        const posts = await Post.find({},"comments")
            .populate("comments.user","username email profilePicture");
        const comments = posts.flatMap((post) => post.comments);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({message:"Error finding comments",error});
    }
};

export const deleteComment = async (req, res) => {
    try {
        const {postId, commentId} = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({message: "Comment not found"});
        }

        post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
        await post.save();
        res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Error deleting comment",error});
    }
};

