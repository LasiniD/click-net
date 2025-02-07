import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-4 text-center">
				<div
					className="h-16 bg-cover bg-center rounded-t-lg"
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				<Link to={`/profile/${user.username}`} className="block">
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className="w-20 h-20 rounded-full mx-auto mt-[-40px] border-4 border-white shadow-md"
					/>
					<h2 className="text-xl font-semibold mt-2 text-gray-900">{user.name}</h2>
				</Link>
				<p className="text-gray-600 text-sm">{user.headline}</p>
				<p className="text-gray-500 text-xs">{user.connections.length} connections</p>
			</div>
			<div className="border-t border-gray-300 p-4">
				<nav>
					<ul className="space-y-2">
						<li>
							<Link
								to="/"
								className="flex items-center py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
							>
								<Home className="mr-2" size={20} /> Home
							</Link>
						</li>
						<li>
							<Link
								to="/network"
								className="flex items-center py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
							>
								<UserPlus className="mr-2" size={20} /> My Network
							</Link>
						</li>
						<li>
							<Link
								to="/notifications"
								className="flex items-center py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white transition-colors"
							>
								<Bell className="mr-2" size={20} /> Notifications
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div className="border-t border-gray-300 p-4">
				<Link to={`/profile/${user.username}`} className="text-sm font-semibold text-orange-600 hover:underline">
					Visit your profile
				</Link>
			</div>
		</div>
	);
}
