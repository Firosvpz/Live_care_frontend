import React, { useEffect, useState } from 'react';
import { fetchApprovedAndUnblockedProviders } from '../../api/user_api';
import { ServiceProvider } from '../../types/serviceproviders';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import UserHeader from '../../components/user/Header';
import { AiOutlineLoading } from 'react-icons/ai'; // Loading spinner icon

const ApprovedSp: React.FC = () => {
    const [providers, setProviders] = useState<ServiceProvider[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
    const navigate = useNavigate();

    // Fetch service providers on component load
    useEffect(() => {
        const loadServiceProviders = async () => {
            try {
                const providersData = await fetchApprovedAndUnblockedProviders();    
                setProviders(providersData);
                setFilteredProviders(providersData);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        loadServiceProviders();
    }, []);

    // Filter providers based on search term
    useEffect(() => {
        const filterProviders = () => {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = providers.filter(provider => {
                return provider.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    provider.service.toLowerCase().includes(lowercasedSearchTerm);
            });
            setFilteredProviders(filtered);
        };

        filterProviders();
    }, [searchTerm, providers]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleViewDetails = (providerId: string) => {
        navigate(`/user/sp-details/${providerId}`);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><AiOutlineLoading className="animate-spin text-4xl text-blue-500" /></div>;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

    return (
        <>
            <UserHeader />
            <div className="min-h-screen flex flex-col justify-between bg-gray-50">
                <div className="flex-grow p-6">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-semibold mb-6 text-gray-700"> Service Providers</h1>

                        {/* Search Filter */}
                        <div className="w-full max-w-md mb-4">
                            <input
                                type="text"
                                placeholder="Search by name, service"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            />
                        </div>

                        {/* Table for displaying providers */}
                        <div className="w-full max-w-4xl overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-lg">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Profile</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Service</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Specialization</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProviders.length > 0 ? (
                                        filteredProviders.map((provider) => (
                                            <tr key={provider._id} className="hover:bg-gray-100 transition-colors">
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <img
                                                        src={provider.profile_picture || "https://via.placeholder.com/40"}
                                                        alt={provider.name}
                                                        className="h-10 w-10 rounded-full"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{provider.name}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{provider.service}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{provider.specialization}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{provider.gender}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                                                    <button onClick={() => handleViewDetails(provider._id)}>
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-6 text-gray-500">No service providers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ApprovedSp;
