import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPackage, FiPlus, FiChevronLeft } from 'react-icons/fi';
import AdminNavbar from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { addBlog } from '../../api/admin_api';
import Footer from '../../components/common/Footer';

interface BlogData {
    title: string;
    image: File[];
    content: string;
    date: string; // Change date to string to match input type
}

const AddBlog = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<BlogData>();

    const title = watch('title');
    const image = watch('image');
    const content = watch('content');
    // const date = watch('date');

    const isValidated = title && image?.length > 0 && content 

    const onSubmit: SubmitHandler<BlogData> = async (data) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('image', data.image[0]);
            formData.append('content', data.content);
            // formData.append('date', data.date); // Append date

            const response = await addBlog(formData);

            if (response.success) {
                toast.success('Blog added successfully!');
                navigate('/admin/blogs');
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <>
            <AdminNavbar
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setIsSidebarOpen}
            />
            <AdminSidebar isOpen={isSidebarOpen} />
            <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 flex items-center justify-center py-12 px-6 lg:px-8">
                <div className="max-w-3xl w-full bg-white p-10 rounded-lg shadow-lg transform transition-all duration-500 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <FiPackage className="mr-2" />
                            Add New Blog
                        </h1>
                        <button
                            onClick={() => navigate('/admin/blogs')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                        >
                            <FiChevronLeft className="mr-1" />
                            Back to Blogs
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* Title Input */}
                        <div className="relative">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter blog title"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 px-4 py-3"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Image Input */}
                        <div className="relative">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 px-4 py-3"
                                {...register('image', { required: 'Image is required' })}
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.image.message}
                                </p>
                            )}
                        </div>

                        {/* Content Input */}
                        <div className="relative">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                id="content"
                                placeholder="Enter blog content"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 px-4 py-3"
                                rows={6}
                                {...register('content', { required: 'Content is required' })}
                            />
                            {errors.content && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.content.message}
                                </p>
                            )}
                        </div>

                        {/* Date Input */}
                        {/* <div className="relative">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 px-4 py-3"
                                {...register('date', { required: 'Date is required' })}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.date.message}
                                </p>
                            )}
                        </div> */}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValidated}
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-md shadow-lg text-white font-semibold transition-all duration-300 ${isValidated
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <FiPlus className="mr-2" />
                            Add Blog
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddBlog;
