import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fileComplaint, getProfileDetails } from "../../api/user_api";
import UserHeader from "../../components/user/Header";
import Footer from "../../components/common/Footer";
import { FaArrowLeft } from "react-icons/fa";

const FileComplaint: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfileDetails();
        if (response?.success && response.data) {
          setUserId(response.data._id);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const validateForm = () => {
    const newErrors: { subject?: string; description?: string } = {};
    if (!subject) newErrors.subject = "Subject is required";
    if (subject.length > 100) newErrors.subject = "Subject cannot exceed 100 characters";
    if (description.length < 15) newErrors.description = "Description must be at least 15 characters long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!userId) {
      toast.error("User not logged in or user ID missing");
      return;
    }
    try {
      await fileComplaint(userId, subject, description);
      setSubject("");
      setDescription("");
      toast.success("Complaint filed successfully");
      navigate("/user/complaints");
    } catch (error) {
      console.error("Error filing complaint:", error);
      toast.error("Failed to file complaint");
    }
  };

  return (
    <>
      <UserHeader />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('../../images/login.jpg')" }}
      >
        <div className="bg-white/60 bg-opacity-90 shadow-lg rounded-lg p-6 max-w-md w-full mx-4 sm:mx-0">
        <button
              className="mt-4 inline-flex items-center text-sm font-medium text-black-800 hover:text-black"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="mr-2" /> Back to Complaints
            </button>
          <div className="text-2xl font-bold text-center text-gray-800 mb-4">File a Complaint</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full p-2 border rounded ${errors.subject ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-blue-500`}
                placeholder="Enter subject"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-2 border rounded ${errors.description ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-blue-500`}
                placeholder="Enter complaint description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            <button type="submit" className="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 ">Submit Complaint</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FileComplaint;
