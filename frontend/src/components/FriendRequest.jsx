import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
	const queryClient = useQueryClient();

	const { mutate: acceptConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response.data.error || "Something went wrong");
		},
	});

	const { mutate: rejectConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response.data.error || "Something went wrong");
		},
	});

	return (
		<div className="bg-gray-100 rounded-lg shadow-md p-4 flex items-center justify-between transition-all hover:shadow-lg">
			<div className="flex items-center gap-4">
				<Link to={`/profile/${request.sender.username}`}>
					<img
						src={request.sender.profilePicture || "/avatar.png"}
						alt={request.sender.name}
						className="w-16 h-16 rounded-full object-cover border border-gray-300"
					/>
				</Link>

				<div>
					<Link to={`/profile/${request.sender.username}`} className="font-semibold text-lg text-gray-800 hover:underline">
						{request.sender.name}
					</Link>
					<p className="text-gray-600 text-sm">
                            {request.sender.isPhotographer ? "Photographer" : "Client"}
                    </p>

				</div>
			</div>

			<div className="flex gap-2">
				<button
					className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
					onClick={() => acceptConnectionRequest(request._id)}
				>
					Accept
				</button>
				<button
					className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
					onClick={() => rejectConnectionRequest(request._id)}
				>
					Reject
				</button>
			</div>
		</div>
	);
};

export default FriendRequest;
