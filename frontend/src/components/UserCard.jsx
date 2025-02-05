import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
	return (
		<div className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center transition-all hover:shadow-lg">
			<Link to={`/profile/${user.username}`} className="flex flex-col items-center">
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300"
				/>
				<h3 className="font-semibold text-lg text-center text-gray-800">{user.name}</h3>
			</Link>
			<p className="text-gray-600 text-center text-sm">{user.isPhotographer ? "Photographer" : "Client"}</p>
			<p className="text-sm text-gray-500 mt-2">{user.connections?.length} connections</p>

			<button
				className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
			>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;
