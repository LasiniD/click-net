import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const PostPage = () => {
	const { postId } = useParams();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: post, isLoading } = useQuery({
		queryKey: ["post", postId],
		queryFn: async () => {
			const response = await axiosInstance.get(`/posts/${postId}`);
			return response.data;
		},
	});

	if (isLoading) return <div className="text-center text-gray-700 text-lg">Loading post...</div>;
	if (!post) return <div className="text-center text-red-500 text-lg">Post not found</div>;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
			{/* Sidebar (hidden on small screens) */}
			<div className="hidden lg:block lg:col-span-1">
				<Sidebar user={authUser} />
			</div>

			{/* Main Post Content */}
			<div className="col-span-1 lg:col-span-3">
				<Post post={post} />
			</div>
		</div>
	);
};

export default PostPage;
