import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import QualificationsSection from "../components/QualificationsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: async () => {
			const response = await axiosInstance.get(`/users/${username}`);
			return response.data;
		},
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	// Delete user mutation (only for admin)
	const { mutate: deleteUser } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/admin/users/${userProfile._id}`);
		},
		onSuccess: () => {
			toast.success("User deleted successfully");
			queryClient.invalidateQueries(["users"]); // Refresh user list
			navigate("/"); // Redirect to home
		},
		onError: () => {
			toast.error("Failed to delete user");
		},
	});

	if (isLoading || isUserProfileLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-gray-600 text-lg">Loading profile...</p>
			</div>
		);
	}

	const isOwnProfile = authUser?.username === userProfile?.username;
	const isAdmin = authUser?.isAdmin;

	const userData = isOwnProfile ? authUser : userProfile;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
			{/* Profile Sections */}
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<QualificationsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />

			{/* Delete User Button (only visible to Admin, cannot delete themselves) */}
			{isAdmin && !isOwnProfile && (
				<div className="mt-6">
					<button
						onClick={() => {
							if (window.confirm(`Are you sure you want to delete ${userProfile.name}?`)) {
								deleteUser();
							}
						}}
						className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
					>
						Delete User
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
