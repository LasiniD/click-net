import { useParams } from "react-router-dom";
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

	if (isLoading || isUserProfileLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-gray-600 text-lg">Loading profile...</p>
			</div>
		);
	}

	const isOwnProfile = authUser?.username === userProfile?.username;
	const userData = isOwnProfile ? authUser : userProfile;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<QualificationsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
		</div>
	);
};

export default ProfilePage;
