import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({ ...userData });
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections.some((connection) => connection === authUser._id);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		return connectionStatus?.data?.status || "not_connected";
	}, [isConnected, connectionStatus]);

	const renderConnectionButton = () => {
		switch (getConnectionStatus) {
			case "connected":
				return (
					<div className="flex gap-2 justify-center">
						<div className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
							<UserCheck size={20} className="mr-2" />
							Connected
						</div>
						<button
							className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
							onClick={() => removeConnection(userData._id)}
						>
							<X size={20} className="mr-2" />
							Remove
						</button>
					</div>
				);
			case "pending":
				return (
					<button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
						<Clock size={20} className="mr-2" />
						Pending
					</button>
				);
			default:
				return (
					<button
						onClick={() => sendConnectionRequest(userData._id)}
						className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
					>
						<UserPlus size={20} className="mr-2" />
						Connect
					</button>
				);
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
		<div className="bg-white shadow-md rounded-lg mb-6">
			{/* Banner Image */}
			<div
				className="relative h-48 rounded-t-lg bg-cover bg-center"
				style={{
					backgroundImage: `url('${editedData.coverPhoto || userData.coverPhoto || "/banner.png"}')`,
				}}
			>
				{isEditing && (
					<label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
						<Camera size={20} />
						<input
							type="file"
							className="hidden"
							name="coverPhoto"
							onChange={handleImageChange}
							accept="image/*"
						/>
					</label>
				)}
			</div>

			<div className="p-4 text-center">
				{/* Profile Image */}
				<div className="relative -mt-20 mb-4">
					<img
						className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"
						src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
						alt={userData.name}
					/>
					{isEditing && (
						<label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
							<Camera size={20} />
							<input
								type="file"
								className="hidden"
								name="profilePicture"
								onChange={handleImageChange}
								accept="image/*"
							/>
						</label>
					)}
				</div>

				{/* Name */}
				{isEditing ? (
					<input
						type="text"
						value={editedData.name}
						onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
						className="text-2xl font-bold text-center w-full border-b-2 border-gray-300 focus:outline-none"
						placeholder="Name"
					/>
				) : (
					<h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
				)}

				{/* Photographer Status */}
				{isEditing ? (
					<select
						value={editedData.isPhotographer ? "Photographer" : "Client"}
						onChange={(e) =>
							setEditedData({ ...editedData, isPhotographer: e.target.value === "Photographer" })
						}
						className="text-gray-600 text-center w-full border rounded-md p-2 mt-2"
					>
						<option value="Photographer">Photographer</option>
						<option value="Client">Client</option>
					</select>
				) : (
					<p className="text-gray-600">{userData.isPhotographer ? "Photographer" : "Client"}</p>
				)}

				{/* Location */}
				<div className="flex justify-center items-center mt-2">
					<MapPin size={16} className="text-gray-500 mr-1" />
					{isEditing ? (
						<input
							type="text"
							value={editedData.location}
							onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
							className="text-gray-600 text-center w-full border-b-2 border-gray-300 focus:outline-none"
							placeholder="Location"
						/>
					) : (
						<span className="text-gray-600">{userData.location}</span>
					)}
				</div>

				{/* Buttons */}
				{isOwnProfile ? (
					<button
						onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
						className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
					>
						{isEditing ? "Save Profile" : "Edit Profile"}
					</button>
				) : (
					<div className="flex justify-center mt-4">{renderConnectionButton()}</div>
				)}
			</div>
		</div>
	);
};

export default ProfileHeader;
