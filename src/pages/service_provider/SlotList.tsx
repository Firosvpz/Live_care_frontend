import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSlotsList, getSpProfileDetails } from '../../api/sp_api';
import { RootState } from '../../redux/store/store';
import { debounce } from 'lodash';
import { updateServiceProviderInfo } from '../../redux/slices/sp_slice';
import Footer from '../../components/common/Footer';
import SpHeader from '../../components/serviceprovider/SpHeader';
import { Button, Card, CardBody, CardTitle, CardText, Input } from 'reactstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../css/serviceprovider/slotList.css'; // Import the CSS file
interface Schedule {
    from: string;
    to: string;
    title: string;
    price: number;
    description: string;
    status: 'open' | 'booked';
    services: string[];
}

interface Slot {
    _id: string;
    date: Date;
    schedule: Schedule[];
}

const SlotsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [slotsList, setSlotsList] = useState<Slot[]>([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);
    const currentPage = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '4');
    const providerInfo = useSelector((state: RootState) => state.spInfo.spInfo);

    const handleAddSlot = async () => {
        const refreshedProviderInfo = await fetchProviderInfo();
        console.log('isap', refreshedProviderInfo);

        if (!refreshedProviderInfo || refreshedProviderInfo.is_approved !== "Approved") {
            setShowPopUp(true);
            return;
        }
        navigate('/sp/add-slot');
    };

    const handleEditSlot = (slotId: string) => {
        navigate(`/sp/edit-slot/${slotId}`);
    };

    const fetchProviderInfo = async () => {
        const response = await getSpProfileDetails();
        if (response.success) {
            dispatch(updateServiceProviderInfo(response.data));
            return response.data;
        }
        return null;
    };

    const fetchProviderSlotsList = async (page: number, limit: number, query = '') => {
        setLoading(true);
        const response = await getSlotsList(page, limit, query);
        if (response.success) {
            setSlotsList(response.data);
            setTotalPages(response.totalPages);
        } else {
            console.error('Error fetching slots:', response.message);
        }
        setLoading(false);
    };

    const debouncedFetchSlotsList = useCallback(
        debounce((page: number, limit: number, query: string) => {
            fetchProviderSlotsList(page, limit, query);
        }, 500),
        []
    );

    useEffect(() => {
        if (location.state?.refresh) {
            fetchProviderSlotsList(currentPage, limit, searchQuery);
        } else {
            debouncedFetchSlotsList(currentPage, limit, searchQuery);
        }
    }, [currentPage, limit, searchQuery, location.state]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSearchParams({ page: '1', limit: limit.toString(), search: e.target.value });
    };

    // Helper function to check if the slot is expired
    const isExpired = (endDate: Date, status: string) => {
        return status === "open" && new Date() > new Date(endDate);
    };


    return (
        <>
            <SpHeader />
            <div className="slots-list-container"> {/* Apply the background styles here */}
                <div className="text-4xl text-center font-bold mb-6 bg-gradient-to-r from-black/100 to-purple-600 text-white p-4 rounded-lg shadow-md">
                    Your Upcoming Bookings!
                </div>

                <div className="flex justify-between mb-4">
                    <button
                        className="mt-4 inline-flex items-center text-sm font-medium btn btn-danger hover:text-dark"
                        onClick={() => window.history.back()}
                    >
                        <FaArrowLeft className="mr-2 " /> Back to Home
                    </button>
                    <button className="mt-4 p-6 inline-flex items-center  text-sm font-medium btn btn-success hover:text-dark" onClick={handleAddSlot}>
                        Add Slot
                        <FaArrowRight className="mr-2 ms-2" />
                    </button>
                </div>
                <div className="input-container mb-4">
                    <Input
                        type="text"
                        placeholder="Search by title or date..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="input-field"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : (
                        slotsList.length > 0 ? (
                            slotsList.map((slot) => (
                                slot.schedule.map((schedule, index) => (
                                    <Card key={`${slot._id}-${index}`} className="shadow-lg p-4">
                                        <CardBody>
                                            <CardTitle tag="h5" className="text-lg font-semibold">{schedule.title}</CardTitle>
                                            <CardText className="text-gray-700">
                                                <strong>From:</strong> {new Date(schedule.from).toLocaleString()}<br />
                                                <strong>To:</strong> {new Date(schedule.to).toLocaleString()}<br />
                                                <strong>Price:</strong> ${schedule.price}<br />
                                                <strong>Status:</strong>
                                                <span style={{ color: isExpired(new Date(schedule.from), schedule.status) ? 'grey' : (schedule.status === 'open' ? 'green' : 'red') }}>
                                                    {isExpired(new Date(schedule.from), schedule.status) ? 'Expired' : schedule.status}
                                                </span>
                                            </CardText>
                                            {!isExpired(new Date(schedule.from), schedule.status) && schedule.status === 'open' && (
                                                <Button color="primary" className="mt-2" onClick={() => handleEditSlot(slot._id)}>Edit</Button>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))
                            ))
                        ) : (
                            <p className="text-center">No slots available</p>
                        )
                    )}
                </div>
            </div>
            <Footer />
            {showPopUp && (
                <div className="popup"> {/* Use the popup class */}
                    <div className="popup-content"> {/* Apply the popup content styles */}
                        <h2 className="text-xl font-semibold">Approval Required</h2>
                        <p>Your profile needs to be approved before you can add a slot.</p>
                        <Button color="primary" onClick={() => setShowPopUp(false)}>Close</Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SlotsList;