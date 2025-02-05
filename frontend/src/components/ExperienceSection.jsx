import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		title: "",
		location: "",
		startDate: "",
		endDate: "",
		contactInfo: { phone: "", email: "" },
		currentlyWorking: false,
	});

	// Add Experience
	const handleAddExperience = () => {
		if (newExperience.title && newExperience.location && newExperience.startDate) {
			setExperiences([...experiences, newExperience]);

			setNewExperience({
				title: "",
				location: "",
				startDate: "",
				endDate: "",
				contactInfo: { phone: "", email: "" },
				currentlyWorking: false,
			});
		}
	};

	// Delete Experience
	const handleDeleteExperience = (id) => {
		setExperiences(experiences.filter((exp) => exp._id !== id));
	};

	// Save Experience
	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
	};

	// Handle Currently Working Change
	const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

	// Handle Contact Info Change
	const handleContactInfoChange = (e) => {
		const { name, value } = e.target;
		setNewExperience({
			...newExperience,
			contactInfo: { ...newExperience.contactInfo, [name]: value },
		});
	};

	return (
		<div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-800">Experience</h2>

			{/* Display Experience */}
			{experiences.map((exp, index) => (
				<div key={index} className="mb-4 flex justify-between items-start border-b pb-4">
					<div className="flex items-start">
						<Briefcase size={20} className="mr-2 mt-1 text-blue-600" />
						<div>
							<h3 className="font-semibold text-gray-900">{exp.title}</h3>
							<p className="text-gray-600">{exp.location}</p>
							<p className="text-gray-500 text-sm">
								{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
							</p>
							<p className="text-gray-600 text-sm">📞 {exp.contactInfo.phone} | ✉️ {exp.contactInfo.email}</p>
						</div>
					</div>
					{isEditing && (
						<button onClick={() => handleDeleteExperience(exp._id)} className="text-red-500 hover:text-red-600">
							<X size={20} />
						</button>
					)}
				</div>
			))}

			{/* Edit Mode */}
			{isEditing && (
				<div className="mt-4 bg-white p-4 rounded-lg shadow">
					<input
						type="text"
						placeholder="Title"
						value={newExperience.title}
						onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>
					<input
						type="text"
						placeholder="Location"
						value={newExperience.location}
						onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>
					<input
						type="date"
						placeholder="Start Date"
						value={newExperience.startDate}
						onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>
					<div className="flex items-center mb-2">
						<input
							type="checkbox"
							id="currentlyWorking"
							checked={newExperience.currentlyWorking}
							onChange={handleCurrentlyWorkingChange}
							className="mr-2"
						/>
						<label htmlFor="currentlyWorking" className="text-gray-700">I currently work here</label>
					</div>
					{!newExperience.currentlyWorking && (
						<input
							type="date"
							placeholder="End Date"
							value={newExperience.endDate}
							onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
							className="w-full p-2 border rounded-md mb-2"
						/>
					)}

					{/* Contact Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						<input
							type="tel"
							name="phone"
							placeholder="Phone"
							value={newExperience.contactInfo.phone}
							onChange={handleContactInfoChange}
							className="w-full p-2 border rounded-md mb-2"
						/>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={newExperience.contactInfo.email}
							onChange={handleContactInfoChange}
							className="w-full p-2 border rounded-md mb-2"
						/>
					</div>

					<button
						onClick={handleAddExperience}
						className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
					>
						Add Experience
					</button>
				</div>
			)}

			{/* Edit Button */}
			{isOwnProfile && (
				<>
					{isEditing ? (
						<button
							onClick={handleSave}
							className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
						>
							Save Changes
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="mt-4 text-blue-600 hover:underline transition duration-300"
						>
							Edit Experiences
						</button>
					)}
				</>
			)}
		</div>
	);
};

export default ExperienceSection;
