import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

	return (
		<nav className="bg-orange-500 shadow-md sticky top-0 z-10">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center py-3">
					<div className="flex items-center space-x-4">
						<Link to="/">
							<img className="h-8 rounded" src="/small-logo-white-transparent.png" alt="ClickNet" />
						</Link>
					</div>
					<div className="flex items-center gap-4 md:gap-6">
						{authUser ? (
							authUser.isAdmin ? (
								// Show only "Me" and "Logout" for Admins
								<>
									<Link
										to={`/profile/${authUser.username}`}
										className="text-white flex flex-col items-center hover:text-gray-300"
									>
										<User size={20} />
										<span className="text-xs hidden md:block">Me</span>
									</Link>
									<button
										className="flex items-center space-x-1 text-sm text-white hover:text-gray-300"
										onClick={() => logout()}
									>
										<LogOut size={20} />
										<span className="hidden md:inline">Logout</span>
									</button>
								</>
							) : (
								// Show full navigation for normal users
								<>
									<Link to={"/"} className="text-white flex flex-col items-center hover:text-gray-300">
										<Home size={20} />
										<span className="text-xs hidden md:block">Home</span>
									</Link>
									<Link to="/network" className="text-white flex flex-col items-center relative hover:text-gray-300">
										<Users size={20} />
										<span className="text-xs hidden md:block">My Network</span>
										{unreadConnectionRequestsCount > 0 && (
											<span className="absolute -top-1 -right-1 md:right-4 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
												{unreadConnectionRequestsCount}
											</span>
										)}
									</Link>
									<Link to="/notifications" className="text-white flex flex-col items-center relative hover:text-gray-300">
										<Bell size={20} />
										<span className="text-xs hidden md:block">Notifications</span>
										{unreadNotificationCount > 0 && (
											<span className="absolute -top-1 -right-1 md:right-4 bg-red-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
												{unreadNotificationCount}
											</span>
										)}
									</Link>
									<Link to={`/profile/${authUser.username}`} className="text-white flex flex-col items-center hover:text-gray-300">
										<User size={20} />
										<span className="text-xs hidden md:block">Me</span>
									</Link>
									<button
										className="flex items-center space-x-1 text-sm text-white hover:text-gray-300"
										onClick={() => logout()}
									>
										<LogOut size={20} />
										<span className="hidden md:inline">Logout</span>
									</button>
								</>
							)
						) : (
							// Show Sign In and Join buttons if user is not logged in
							<>
								<Link to="/login" className="px-4 py-2 text-white border border-gray-300 rounded-md hover:bg-gray-700">
									Sign In
								</Link>
								<Link to="/signup" className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-900">
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
