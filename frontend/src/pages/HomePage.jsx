import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

	const { data: posts } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await axiosInstance.get("/posts");
			return res.data;
		},
	});

  	console.log("recommendedUsers", recommendedUsers);
	console.log("posts", posts);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
			{/* Sidebar for large screens */}
			<div className="hidden lg:block lg:col-span-1">
				<Sidebar user={authUser} />
			</div>

			{/* Main content area */}
			<div className="col-span-1 lg:col-span-2 order-first lg:order-none">
				<PostCreation user={authUser} />

				{/* Displaying Posts */}
				{posts?.map((post) => (
					<Post key={post._id} post={post} />
				))}

				{/* If there are no posts, show a message */}
				{posts?.length === 0 && (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<div className="mb-6">
							<Users size={64} className="mx-auto text-orange-500" />
						</div>
						<h2 className="text-2xl font-bold mb-4 text-gray-800">No Posts Yet</h2>
						<p className="text-gray-600 mb-6">
							Connect with others to start seeing posts in your feed!
						</p>
					</div>
				)}

			</div>

			{/* Recommended Users Section */}
			{recommendedUsers?.length > 0 && (
				<div className="col-span-1 lg:col-span-1 hidden lg:block">
					<div className="bg-white rounded-lg shadow-md p-4">
						<h2 className="font-semibold mb-4 text-gray-800">People you may know</h2>
						{recommendedUsers
							?.filter((user) => Boolean(user.isAdmin) !== true)
							.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				</div>
				
			)}
			
		</div>
	);
};



export default HomePage;



