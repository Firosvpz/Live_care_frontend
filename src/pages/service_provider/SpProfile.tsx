import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaArrowLeft,
  FaBook,
} from "react-icons/fa";
import Footer from "../../components/common/Footer";
import {
  editPassword,
  editProfile,
  fetchCategories,
  getSpProfileDetails,
} from "../../api/sp_api";
import { useForm, SubmitHandler } from "react-hook-form";
import "../../css/user/profile.css";

interface ServiceProvider {
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  service: string;
  qualification: string;
  exp_year: number;
  rate: number;
}

interface IPassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface EditSpProps {
  setShowEdit: (show: boolean) => void;
  serviceProviderDetails: ServiceProvider;
  onProfileEdit: (updatedData: ServiceProvider) => void;
}

const ServiceProviderProfile: React.FC<EditSpProps> = ({
  serviceProviderDetails,
  onProfileEdit,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceProvider>({
    defaultValues: serviceProviderDetails,
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
  } = useForm<IPassword>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getSpProfileDetails();
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("phone_number", data.phone_number);
        setValue("service", data.service);
        setValue("gender", data.gender);
        setValue("qualification", data.qualification);
        setValue("exp_year", data.exp_year);
        setValue("rate", data.rate);
      } catch (error) {
        toast.error("Failed to fetch profile details.");
      }
    };
    fetchUserData();
  }, [setValue]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load categories.");
      }
    };
    loadCategories();
  }, []);

  const handleEdit: SubmitHandler<ServiceProvider> = async (data) => {
    try {
      const response = await editProfile(data);
      if (response.success) {
        toast.success("Profile updated successfully");
        onProfileEdit(data);
      } else {
        toast.error(response.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handlePassword: SubmitHandler<IPassword> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await editPassword(data.oldPassword, data.newPassword);
      if (response.success) {
        toast.success("Password updated successfully.");
        resetPassword();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred while changing the password.");
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-6">
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

          <form onSubmit={handleSubmit(handleEdit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaUser className="text-blue-900 mt-3" />
                </div>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                    validate: {
                      notWhitespace: (value) =>
                        value.trim() !== "" || "Name cannot be empty",
                    },
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10 focus:border-indigo-300"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaPhone className="text-blue-900 mt-3" />
                </div>
                <input
                  type="tel"
                  id="phone_number"
                  {...register("phone_number", {
                    required: "Mobile number is required",
                    pattern: {
                        value: /^[0]?[789]\d{9}$/,
                        message: "Enter a valid number",
                      },
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10 focus:border-indigo-300"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-600">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaEnvelope className="text-blue-900 mt-3" />
                </div>
                <input
                  type="email"
                  id="email"
                  readOnly
                  {...register("email", { required: "Email is required" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10 focus:border-indigo-300"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service
                </label>
                <select
                  id="service"
                  {...register("service", { required: "Service is required" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
                >
                  <option value="">Select a service</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-sm text-red-600">
                    {errors.service.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="qualification"
                  className="block text-sm font-medium text-gray-700"
                >
                  Qualification
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaBook className="text-blue-900 mt-3" />
                </div>
                <input
                  type="text"
                  id="qualification"
                  {...register("qualification", {
                    required: "Qualification is required",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10 focus:border-indigo-300"
                />
                {errors.qualification && (
                  <p className="text-sm text-red-600">
                    {errors.qualification.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="exp_year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="exp_year"
                  {...register("exp_year", {
                    required: "Experience is required",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
                />
                {errors.exp_year && (
                  <p className="text-sm text-red-600">
                    {errors.exp_year.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="rate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rate per session
                </label>
                <input
                  type="number"
                  id="rate"
                  {...register("rate", { required: "Rate is required" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
                />
                {errors.rate && (
                  <p className="text-sm text-red-600">{errors.rate.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          </form>

          <div className="border-t mt-6"></div>

          <form
            onSubmit={handleSubmitPassword(handlePassword)}
            className="p-6 space-y-6"
          >
            <h2 className="text-lg font-bold text-gray-700">Change Password</h2>

            <div className="relative">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Old Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="oldPassword"
                {...registerPassword("oldPassword", {
                  required: "Old password is required",
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
              />
              {errorsPassword.oldPassword && (
                <p className="text-sm text-red-600">
                  {errorsPassword.oldPassword.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  pattern: {
                    value:
                      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                    message:
                      "Password must be 6-16 characters long and contain at least one number and one special character.",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
              />
              {errorsPassword.newPassword && (
                <p className="text-sm text-red-600">
                  {errorsPassword.newPassword.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your password",
                  pattern: {
                    value:
                      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                    message:
                      "Password must be 6-16 characters long and contain at least one number and one special character.",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
              />
              {errorsPassword.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errorsPassword.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Show Passwords
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                <FaSave className="mr-2" /> Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceProviderProfile;
