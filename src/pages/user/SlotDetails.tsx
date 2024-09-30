
import { useEffect, useState } from "react";
import { getServiceProviderSlotDetails } from "../../api/user_api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";
// import Footer from "../../components/common_pages/Footer";

interface IServiceProvider {
  name: string;
  gender: string;
  service: string;
  profilePicture: string;
  expYear: string;
}

const ProviderAndSlotDetails = () => {
  const { serviceProviderId } = useParams();
  const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const selectedService = searchParams.get("selectedService") as string;

  const [serviceProvider, setServiceProvider] = useState<IServiceProvider | null>(null);
  const [slots, setSlots] = useState<any[]>([]);

  const fetchProviderSlotDetails = async (serviceProviderId: string) => {
    try {
      const response = await getServiceProviderSlotDetails(serviceProviderId);
      console.log("API Response:", response);

      if (response && response.success) {
        // Set the service provider details
        setServiceProvider(response.data.details.providerDetails);

        // Set the slots, or default to an empty array if no slots are available
        setSlots(response.data.details.bookingSlotDetails || []);
      } else {
        console.error("API response is missing data:", response);
      }
    } catch (error) {
      console.error("Error fetching provider slot details:", error);
    }
  };

  useEffect(() => {
    if (serviceProviderId) {
      fetchProviderSlotDetails(serviceProviderId);
    }
  }, [serviceProviderId]);
  

//   const handleCheckout = async (slot: any) => {
//     const previousUrl = `${location.pathname}${location.search}`;
//     try {
//       const response = await makePayment(slot, previousUrl);
//       if (response.success) {
//         window.location.href = response.data;
//       }
//     } catch (error) {
//       console.error("Error making payment:", error);
//     }
//   };

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gradient-to-br bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#949aa4] rounded-xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3 p-6 lg:p-10">
              <div className="flex items-center mb-8">
                <button
                  onClick={() => navigate("/user/home")}
                  className="mr-4 p-2 rounded-full text-indigo-600 hover:bg-[#D9E9FF] transition duration-300"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <h1 className="text-3xl lg:text-4xl font-bold text-black">Book your slots</h1>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Time (from & to)</th>
                      <th scope="col" className="px-6 py-3">Service</th>
                      <th scope="col" className="px-6 py-3">Price</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.length > 0 ? (
                      slots.map((slot: any, index: number) => (
                        <tr key={slot._id + index} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {new Date(slot.slots.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(slot.slots.schedule.from).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - {" "}
                            {new Date(slot.slots.schedule.to).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-6 py-4 font-medium text-indigo-600 hover:text-indigo-900">
                            {slot.slots.schedule.title}
                          </td>
                          <td className="px-6 flex items-center py-4">
                            <MdOutlineCurrencyRupee />
                            {slot.slots.schedule.price}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                slot.slots.schedule.status === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {slot.slots.schedule.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {slot.slots.schedule.status === "open" ? (
                              <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                onClick={(e) => {
                                  e.preventDefault();
                                //   handleCheckout(slot);
                                }}
                              >
                                Book
                              </button>
                            ) : (
                              <button
                                className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed"
                                disabled
                              >
                                Unavailable
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No slots available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:w-1/3 p-6 lg:p-10 border-l border-indigo-100">
              {serviceProvider && (
                <div className="text-center  rounded-xl shadow-lg p-8">
                  <img
                    src={serviceProvider.profilePicture}
                    alt="provider"
                    className="h-48 w-48 rounded-full mx-auto mb-6 border-4 border-indigo-200 shadow-lg"
                  />
                  <h2 className="text-3xl font-bold mb-4 text-black">{serviceProvider.name}</h2>
                  <div className="space-y-3 text-left">
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">Gender:</span> {serviceProvider.gender}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">Service:</span> {serviceProvider.service}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">Experience:</span> {serviceProvider.expYear} years
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
                    <FaInfoCircle className="inline mr-2 text-indigo-600" />
                    <span className="text-sm text-indigo-800">Expert in {serviceProvider.service}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProviderAndSlotDetails;