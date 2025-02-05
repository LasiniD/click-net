import Post from '../models/post.model.js';
import cloudinary from '../lib/cloudinary.js';
import Notification from '../models/notification.model.js';
import { sendCommentNotificationEmail } from '../emails/emailHandlers.js';

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({author: {$in: [...req.user.connections, req.user._id]}})
        .populate("author", "name username profilePic isPhotographer")
        .populate("comments.user", "name profilePic")
        .sort({createdAt: -1});

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getFeedPosts: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        let newPost;

        if (image) {
            const imageResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author: req.user._id,
                content,
                image: imageResult.secure_url,
            });
        } else {
            newPost = new Post({
                author: req.user._id,
                content,
            });
        }

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.log("Error in createPost: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({message: "You are not authorized to delete this post"});
        }

        if (post.image) {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        console.log("Error in deletePost: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate("author", "name username profilePic isPhotographer")
        .populate("comments.user", "name username profilePic isPhotographer");

        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }

        res.status(200).json(post);
    } catch (error) {
        console.log("Error in getPostById: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(
            postId, 
            {
                $push: {comments: {user: req.user._id, content} },
            },
            {new: true}
            ).populate("author", "name email username profilePic isPhotographer");
        
        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }

        // Send notification to post author
        if (post.author.toString() !== req.user._id.toString()) {
            const newNotificatoion = new Notification({
                recipient: post.author,
                relatedUser: req.user._id,
                type: "comment",
                relatedPost: postId,
            });

            await newNotificatoion.save();
            
            //send email
            try {
                const postUrl = process.env.CLIENT_URL + "/posts/" + postId;
                await sendCommentNotificationEmail(post.author.email, post.author.name, req.user.name, postUrl, content);
            } catch (error) {
                console.log("Error sending comment notification email: ", error);
            }
        };

        res.status(201).json(post);
    } catch (error) {
        console.log("Error in createComment: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({message: "Post not found"});
        }

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else{
            post.likes.push(userId);

            // Send notification to post author
            if (post.author.toString() !== userId.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    relatedUser: userId,
                    type: "like",
                    relatedPost: postId,
                });

                await newNotification.save();
            }
        }

        await post.save();
        
        res.status(200).json(post);
    } catch (error) {
        console.log("Error in likePost: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};