import { School, X } from "lucide-react";
import { useState } from "react";

const QualificationsSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [qualifications, setQualifications] = useState(userData.qualifications || []);
	const [newQualification, setNewQualification] = useState({
		title: "",
		institution: "",
		fieldOfStudy: "",
	});

	// Add Qualification
	const handleAddQualification = () => {
		if (newQualification.title && newQualification.institution && newQualification.fieldOfStudy) {
			setQualifications([...qualifications, newQualification]);

			setNewQualification({
				title: "",
				institution: "",
				fieldOfStudy: "",
			});
		}
	};

	// Delete Qualification
	const handleDeleteQualification = (index) => {
		setQualifications(qualifications.filter((_, i) => i !== index));
	};

	// Save Qualifications
	const handleSave = () => {
		onSave({ qualifications });
		setIsEditing(false);
	};

	return (
		<div className="bg-gray-100 shadow-md rounded-lg p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-800">Qualifications</h2>

			{/* Display Qualifications */}
			{qualifications.length > 0 ? (
				qualifications.map((qual, index) => (
					<div key={index} className="mb-4 flex justify-between items-start border-b pb-4">
						<div className="flex items-start">
							<School size={20} className="mr-2 mt-1 text-orange-600" />
							<div>
								<h3 className="font-semibold text-gray-900">{qual.title}</h3>
								<p className="text-gray-600">{qual.institution}</p>
								<p className="text-gray-500 text-sm">{qual.fieldOfStudy}</p>
							</div>
						</div>
						{isEditing && (
							<button onClick={() => handleDeleteQualification(index)} className="text-red-500 hover:text-red-600">
								<X size={20} />
							</button>
						)}
					</div>
				))
			) : (
				<p className="text-gray-500">No qualifications added yet.</p>
			)}

			{/* Edit Mode */}
			{isEditing && (
				<div className="mt-4 bg-white p-4 rounded-lg shadow">
					<input
						type="text"
						placeholder="Qualification Title"
						value={newQualification.title}
						onChange={(e) => setNewQualification({ ...newQualification, title: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>
					<input
						type="text"
						placeholder="Institution"
						value={newQualification.institution}
						onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>
					<input
						type="text"
						placeholder="Field of Study"
						value={newQualification.fieldOfStudy}
						onChange={(e) => setNewQualification({ ...newQualification, fieldOfStudy: e.target.value })}
						className="w-full p-2 border rounded-md mb-2"
					/>

					<button
						onClick={handleAddQualification}
						className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-300"
					>
						Add Qualification
					</button>
				</div>
			)}

			{/* Edit Button */}
			{isOwnProfile && (
				<>
					{isEditing ? (
						<button
							onClick={handleSave}
							className="mt-4 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-300"
						>
							Save Changes
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="mt-4 text-orange-600 hover:underline transition duration-300"
						>
							Edit Qualifications
						</button>
					)}
				</>
			)}
		</div>
	);
};

export default QualificationsSection;
