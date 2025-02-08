import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Eye, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";

const Post = ({ post }) => {
	const { postId } = useParams();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(post.comments || []);

	const isOwner = authUser?._id === post.author._id;
	const isAdmin = authUser?.isAdmin;
	const isLiked = post.likes.includes(authUser?._id);

	const queryClient = useQueryClient();
	

	// Delete Post Mutation (Admin & Owner)
	const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/posts/delete/${post._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post and related comments deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete post");
		},
	});

	

	// Delete Comment Mutation (Admin & Owner)
	const { mutate: deleteComment } = useMutation({
		mutationFn: async (commentId) => {
			await axiosInstance.delete(`/posts/${post._id}/comment/${commentId}`);
		},
		onSuccess: (_, commentId) => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
			setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
			toast.success("Comment deleted successfully");
			window.location.reload();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete comment");
		},
	});

	const { mutate: createComment, isPending: isAddingComment } = useMutation({
		mutationFn: async (commentContent) => {
			await axiosInstance.post(`/posts/${post._id}/comment`, { content: commentContent });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
			toast.success("Comment added successfully");
			window.location.reload();
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},
	});

	const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
	});

	const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post and all related comments?")) return;
		deletePost();
	};

	const handleDeleteComment = (commentId, commentAuthorId) => {
		if (!isAdmin && authUser?._id !== commentAuthorId) return; // Only admins or comment authors can delete
		if (!window.confirm("Are you sure you want to delete this comment?")) return;
		deleteComment(commentId);
	};

	const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
		}
		window.location.reload();
	};

	return (
		<div className="bg-white rounded-lg shadow-md mb-4">
			<div className="p-4">
				{/* Post Header */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center">
						<Link to={`/profile/${post?.author?.username}`}>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className="w-10 h-10 rounded-full mr-3 object-cover"
							/>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className="font-semibold">{post.author.name}</h3>
							</Link>
							<p className="text-xs text-gray-500">{post.author.headline}</p>
							<p className="text-xs text-gray-400">
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
						</div>
					</div>
					{(isAdmin || isOwner) && (
						<button onClick={handleDeletePost} className="text-red-500 hover:text-red-700">
							{isDeletingPost ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
						</button>
					)}
				</div>

				{/* Post Content */}
				<p className="mb-4">{post.content}</p>
				{post.image && <img src={post.image} alt="Post content" className="rounded-lg w-full mb-4 object-cover" />}

				{/* Post Actions */}
				<div className="flex justify-between text-gray-500">
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-orange-500  fill-orange-300" : ""} />}
						text={`Like (${post.likes.length})`}
						onClick={handleLikePost}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text={`Comment (${comments.length})`}
						onClick={() => setShowComments(!showComments)}
					/>

					{/* View Post Button */}
					<Link to={`/post/${post._id}`} className="flex items-center text-gray-500 hover:text-orange-600">
						<Eye size={18} className="mr-1" />
						View
					</Link>
				</div>
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="px-4 pb-4">
					<div className="mb-4 max-h-60 overflow-y-auto">
						{comments.map((comment) => (
							<div key={comment._id} className="mb-2 bg-gray-100 p-2 rounded flex items-start">
								<img
									src={comment.user.profilePicture || "/avatar.png"}
									alt={comment.user.name}
									className="w-8 h-8 rounded-full mr-2 flex-shrink-0 object-cover"
								/>
								<div className="flex-grow">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<span className="font-semibold mr-2">{comment.user.name}</span>
											<span className="text-xs text-gray-500">
												{formatDistanceToNow(new Date(comment.createdAt))}
											</span>
										</div>
										{(isAdmin || authUser?._id === comment.user._id) && (
											<button
												onClick={() => handleDeleteComment(comment._id, comment.user._id)}
												className="text-red-500 hover:text-red-700"
											>
												<Trash2 size={16} />
											</button>
										)}
									</div>
									<p>{comment.content}</p>
								</div>
							</div>
						))}
					</div>
					{/* Add Comment Input */}
					<form onSubmit={handleAddComment} className="flex items-center">
						<input
							type="text"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Add a comment..."
							className="flex-grow p-2 rounded-l-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
						/>
	
						<button
							type="submit"
							className="bg-orange-600 text-white p-2 rounded-r-full hover:bg-orange-700 transition duration-300"
							disabled={isAddingComment}
						>
						{isAddingComment ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Post;
