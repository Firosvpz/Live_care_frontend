import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Footer from "../../components/common/Footer";
import {
  editPassword,
  editProfile,
  getProfileDetails,
} from "../../api/user_api";
import { useForm, SubmitHandler } from "react-hook-form";
import "../../css/user/profile.css";

interface ProfileData {
  name: string;
  email: string;
  phone_number: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const UserProfile: React.FC = () => {
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setValueProfile,
    formState: { errors: profileError },
  } = useForm<ProfileData>();
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordError },
  } = useForm<PasswordData>();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getProfileDetails();
        setValueProfile("name", data.name);
        setValueProfile("email", data.email);
        setValueProfile("phone_number", data.phone_number);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile details.");
      }
    };
    fetchUserData();
  }, []);

  const saveProfileChanges: SubmitHandler<ProfileData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone_number", data.phone_number);
      const response = await editProfile(formData);

      if (response.success) {
        toast.success("Profile Updated Successfully");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Unexpected error while updating profile.");
    }
  };

  const handleChangePassword: SubmitHandler<PasswordData> = async (data) => {
    if (data.currentPassword && data.newPassword) {
      try {
        const response = await editPassword(
          data.currentPassword,
          data.newPassword,
        );
        if (response.success) {
          toast.success("Password updated successfully");
          resetPassword();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Unexpected error while updating password.");
      }
    } else {
      toast.error("Please fill in both current and new passwords.");
    }
  };

  return (
    <>
      {/* <UserHeader /> */}
      <div className="bg-gray-100 min-h-screen p-8 md:p-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-blue-500 p-6 text-white">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <button
              className="mt-4 inline-flex items-center text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </button>
          </div>
          <div className="p-6 space-y-8">
            <form
              onSubmit={handleSubmitProfile(saveProfileChanges)}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-blue-900" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      {...registerProfile("name", {
                        required: "Name is required",
                        validate: {
                          notWhitespace: (value) =>
                            value.trim() !== "" || "Name cannot be empty",
                        },
                      })}
                      className="input-field ms-4 border-light w-75"
                      required
                    />
                  </div>
                  {profileError.name && (
                    <p className="text-sm text-red-500">
                      {profileError.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-blue-900" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      {...registerProfile("email", { required: true })}
                      readOnly
                      className="input-field  ms-4 border-light w-75"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-blue-900" />
                    </div>
                    <input
                      type="text"
                      id="mobile"
                      {...registerProfile("phone_number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0]?[789]\d{9}$/,
                          message: "Enter a valid number",
                        },
                      })}
                      className="input-field  ms-4 border-light w-75"
                      required
                    />
                  </div>
                  {profileError.phone_number && (
                    <p className="text-sm text-red-500">
                      {profileError.phone_number.message}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-button">
                <FaSave className="mr-2" /> Save Changes
              </button>
            </form>
            <form
              onSubmit={handleSubmitPassword(handleChangePassword)}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold border-b pb-2">
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaLock className="text-black-900" />
                    </div>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      {...registerPassword("currentPassword", {
                        required: "Current password cannot be empty",
                      })}
                      className="input-field ms-4 border-light w-75"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  {passwordError.currentPassword && (
                    <p className="text-sm text-red-500">
                      {passwordError.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaLock className="text-black-900" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      {...registerPassword("newPassword", {
                        required: "New password cannot be empty",
                        pattern: {
                          value:
                            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                          message:
                            "Password must be 6-16 characters long and contain at least one number and one special character.",
                        },
                      })}
                      className="input-field ms-4 border-light w-75"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <FaEyeSlash className="text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  {passwordError.newPassword && (
                    <p className="text-sm text-red-500">
                      {passwordError.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-button">
                <FaSave className="mr-2" /> Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
