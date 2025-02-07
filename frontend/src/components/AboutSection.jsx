import { useState } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState({
		bio: userData.bio || "",
		website: userData.website || "",
		socialLinks: {
			facebook: userData.socialLinks?.facebook || "",
			twitter: userData.socialLinks?.twitter || "",
			instagram: userData.socialLinks?.instagram || "",
			linkedin: userData.socialLinks?.linkedin || "",
			youtube: userData.socialLinks?.youtube || "",
			portfolio: userData.socialLinks?.portfolio || "",
		},
	});

	// Validation for Social Media Links
	const socialLinkPatterns = {
		facebook: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
		twitter: /^https?:\/\/(www\.)?twitter\.com\/[\w.-]+\/?$/,
		instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
		linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w.-]+\/?$/,
		youtube: /^https?:\/\/(www\.)?youtube\.com\/channel\/[\w-]+\/?$/,
		portfolio: /^https?:\/\/[\w.-]+(\.[a-z]{2,})+\/?.*$/,
	};

	// Handle Input Change
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name.startsWith("socialLinks.")) {
			const key = name.split(".")[1];

			// Validate URL format for social links
			if (value && socialLinkPatterns[key] && !socialLinkPatterns[key].test(value)) {
				alert(`Invalid URL format for ${key.charAt(0).toUpperCase() + key.slice(1)}`);
				return;
			}

			setAbout((prev) => ({
				...prev,
				socialLinks: { ...prev.socialLinks, [key]: value },
			}));
		} else {
			setAbout((prev) => ({ ...prev, [name]: value }));
		}
	};

	// Save Changes
	const handleSave = () => {
		setIsEditing(false);
		onSave(about);
	};

	return (
		<div className="bg-white shadow-lg rounded-lg p-6 mb-6 border">
			<h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">About</h2>

			{isEditing ? (
				<div className="space-y-5">
					{/* Bio */}
					<div>
						<label className="block text-gray-700 font-medium mb-1">Bio</label>
						<textarea
							name="bio"
							value={about.bio}
							onChange={handleChange}
							className="w-full p-3 border rounded-md"
							rows="3"
							maxLength="500"
							placeholder="Tell us about yourself..."
						/>
					</div>

					{/* Website */}
					<div>
						<label className="block text-gray-700 font-medium mb-1">Website</label>
						<input
							type="url"
							name="website"
							value={about.website}
							onChange={handleChange}
							className="w-full p-2 border rounded-md"
							placeholder="https://yourwebsite.com"
						/>
					</div>

					{/* Social Links */}
					<div>
						<label className="block text-gray-700 font-medium mb-2">Social Links</label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{Object.entries(about.socialLinks).map(([key, value]) => (
								<div key={key}>
									<label className="block text-gray-600 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
									<input
										type="url"
										name={`socialLinks.${key}`}
										value={value}
										onChange={handleChange}
										className="w-full p-2 border rounded-md"
										placeholder={`Enter your ${key} link`}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Save Button */}
					<button
						onClick={handleSave}
						className="mt-4 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
					>
						Save Changes
					</button>
				</div>
			) : (
				<div className="space-y-3">
					{/* Display Bio */}
					{userData.bio && <p className="text-gray-700">{userData.bio}</p>}

					{/* Display Website */}
					{userData.website && (
						<p>
							<strong className="text-gray-700">Website: </strong>
							<a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
								{userData.website}
							</a>
						</p>
					)}

					{/* Display Social Links */}
					{Object.entries(userData.socialLinks || {}).some(([_, value]) => value) && (
						<div className="mt-3">
							<h3 className="text-gray-700 font-semibold mb-1">Social Links:</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{Object.entries(userData.socialLinks || {}).map(([key, value]) =>
									value ? (
										<p key={key} className="text-gray-700">
											<strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </strong>
											<a href={value} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
												{value}
											</a>
										</p>
									) : null
								)}
							</div>
						</div>
					)}

					{/* Edit Button */}
					{isOwnProfile && (
						<button
							onClick={() => setIsEditing(true)}
							className="mt-4 text-orange-600 hover:underline"
						>
							Edit
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default AboutSection;
