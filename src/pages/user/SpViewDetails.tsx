import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceProviderDetails } from '../../api/user_api';
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiClock, FiBook } from "react-icons/fi";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";
import { FaArrowLeft } from 'react-icons/fa';

interface ServiceProviderDetails {
    name: string;
    email: string;
    phone_number: string;
    service: string;
    gender: string;
    specialization: string;
    is_approved: boolean;
    is_blocked: boolean;
    qualification: string;
    profile_picture: string;
    experience_crt: string;
    rate: string;
    exp_year: string;
    hasCompletedDetails: boolean;
}

const ProviderDetails: React.FC = () => {
    const [serviceProviderDetails, setServiceProviderDetails] = useState<ServiceProviderDetails | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            fetchServiceProviderDetails(id);
        }
    }, [id]);

    const fetchServiceProviderDetails = async (id: string) => {
        try {
            const response = await getServiceProviderDetails(id);
            if (response.success) {
                setServiceProviderDetails(response.data);
            }
        } catch (error) {
            console.error("Error fetching ServiceProvider details:", error);
            toast.error("Failed to fetch ServiceProvider details");
        }
    };

    if (!serviceProviderDetails) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            <UserHeader />
            <div className=" min-h-screen flex justify-center items-center p-6 bg-gradient-to-br from-teal-100 via-white to-teal-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row "
                >
                    <ProfileSidebar serviceProvider={serviceProviderDetails} />
                    <MainContent serviceProvider={serviceProviderDetails} />
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

const ProfileSidebar: React.FC<{ serviceProvider: ServiceProviderDetails }> = ({ serviceProvider }) => (
    <div className="md:w-1/3 bg-teal-700 text-white flex flex-col items-center p-8">
        <button
            className="inline-flex items-center text-gray-300 hover:text-white mb-20"
            onClick={() => window.history.back()}
        >
            <FaArrowLeft className="mr-2" />
            Back to Home
        </button>
        <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={serviceProvider.profile_picture || "https://via.placeholder.com/150"}
            alt={serviceProvider.name}
            className="w-40 h-40 rounded-full mb-6 border-4 border-white shadow-lg"
        />
    </div>
);

const MainContent: React.FC<{ serviceProvider: ServiceProviderDetails }> = ({ serviceProvider }) => (
    <div className="md:w-2/3 p-8 flex flex-col justify-center items-center bg-white">
        {serviceProvider.hasCompletedDetails ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full">
                <h2 className="text-3xl font-bold mb-6 text-indigo-900 text-center">Professional Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailItem icon={<FiUser />} label="Name" value={serviceProvider.name} />
                    <DetailItem icon={<FiMail />} label="Email" value={serviceProvider.email} />
                    <DetailItem icon={<FiPhone />} label="Mobile" value={serviceProvider.phone_number.toString()} />
                    <DetailItem icon={<FiBriefcase />} label="Gender" value={serviceProvider.gender} />
                    <DetailItem icon={<FiClock />} label="Years of Experience" value={serviceProvider.exp_year} />
                    <DetailItem icon={<FiBook />} label="Service" value={serviceProvider.service} />
                    <DetailItem icon={<FiBook />} label="Specialization" value={serviceProvider.specialization} />
                    <DetailItem icon={<FiBook />} label="Qualification" value={serviceProvider.qualification} />
                    <DetailItem icon={<FiBook />} label="Rate" value={serviceProvider.rate} />
                </div>
            </motion.div>
        ) : (
            <div className="text-center text-gray-600">
                <h2 className="text-3xl font-bold mb-4 text-indigo-900">Incomplete Profile</h2>
                <p className="text-xl">The service provider's profile registration is incomplete.</p>
            </div>
        )}
    </div>
);


const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center w-full">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
            <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
            <p className="text-lg text-gray-800">{value}</p>
        </div>
    </div>
);

export default ProviderDetails;
