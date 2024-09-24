import { TagsInput } from "react-tag-input-component";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { addCategory } from "../../api/admin_api"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiPlus, FiChevronLeft } from 'react-icons/fi';
import AdminNavbar from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useState } from "react";

interface CategoryData {
    categoryName: string;
    subCategories: string[];
}

const AddCategory = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CategoryData>({
    defaultValues: {
      categoryName: '',
      subCategories: [], 
    },
  });

  const categoryName = watch("categoryName");
  const subCategories = getValues("subCategories");

  const isValidated = categoryName && subCategories.length > 0;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await addCategory(data as CategoryData);
      if (response?.success) {
        toast.success("Category added successfully!");
        navigate("/admin/categorys-list");
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <AdminNavbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setIsSidebarOpen} />
      <AdminSidebar isOpen={isSidebarOpen} />
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200 mt-5">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <FiPackage className="mr-3 w-8 h-8 text-blue-600" />
            Add New Category
          </h1>
          <button
            onClick={() => navigate("/admin/categorys-list")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
          >
            <FiChevronLeft className="mr-2" /> Back to Categories
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-lg font-medium text-gray-700 mb-2">
              Name of Category
            </label>
            <input
              id="categoryName"
              type="text"
              placeholder="Enter category name"
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
              {...register("categoryName", { required: "Category name is required" })}
            />
            {errors.categoryName && (
              <p className="text-red-600 text-sm mt-1">{errors.categoryName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="subCategories" className="block text-lg font-medium text-gray-700 mb-2">
              Sub-Categories
            </label>
            <TagsInput
              value={getValues("subCategories") || []}
              onChange={(tags) => setValue("subCategories", tags)}
              name="subCategories"
              placeHolder="Enter sub-categories and press enter"
              classNames={{
                input: "w-full p-4 border border-gray-300 rounded-md shadow-sm transition duration-300 ease-in-out",
                tag: "bg-blue-100 text-blue-800 rounded-full px-3 py-1 m-1 text-sm font-semibold",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!isValidated}
            className={`w-full flex items-center justify-center ${
              isValidated
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
