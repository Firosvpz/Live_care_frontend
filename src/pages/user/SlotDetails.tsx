import { useEffect, useState } from "react";
import { getServiceProviderSlotDetails, makePayment } from "../../api/user_api";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import Footer from "../../components/common/Footer";
import UserHeader from "../../components/user/Header";

interface IServiceProvider {
  name: string;
  gender: string;
  service: string;
  profile_picture: string;
  exp_year: string;
}

const ProviderAndSlotDetails = () => {
  const { serviceProviderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  //   const [searchParams] = useSearchParams();
  //   const selectedService = searchParams.get("selectedService") as string;
  // console.log('id',serviceProviderId);

  const [serviceProvider, setServiceProvider] =
    useState<IServiceProvider | null>(null);
  const [slots, setSlots] = useState<any[]>([]);

  const fetchProviderSlotDetails = async (serviceProviderId: string) => {
    try {
      const response = await getServiceProviderSlotDetails(serviceProviderId);
      //   console.log("API Response:", response);

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

  const handleCheckout = async (slot: any) => {
    const previousUrl = `${location.pathname}${location.search}`;
    try {
      const response = await makePayment(slot, previousUrl);
      console.log("payment", response);

      if (response) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };

  return (
    <>
      <UserHeader />
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat py-24 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('../../images/login.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto bg-gray-100 bg-opacity-80 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section */}
            <div className="lg:w-2/3 p-6 lg:p-10">
              <div className="flex items-center mb-8">
                <button
                  onClick={() => navigate("/user/service-providers")}
                  className="mr-4 p-2 rounded-full text-indigo-600 hover:bg-indigo-200 transition duration-300"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <h1 className="text-4xl font-bold text-gray-900">
                  Book your slots
                </h1>
              </div>

              {/* Slots Display as Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.length > 0 ? (
                  slots.map((slot: any, index: number) => (
                    <div
                      key={slot._id + index}
                      className="bg-white bg-opacity-90 shadow-lg rounded-lg p-6 border-t-4 border-indigo-500 transition transform hover:scale-105"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="text-xl font-semibold text-gray-800">
                          {new Date(slot.slots.date).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            slot.slots.schedule.status === "open"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {slot.slots.schedule.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">
                        {new Date(slot.slots.schedule.from).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}{" "}
                        -{" "}
                        {new Date(slot.slots.schedule.to).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>

                      <p className="text-sm text-indigo-600">
                        Service: {slot.slots.schedule.title}
                      </p>

                      <p className="mt-4 flex items-center text-lg font-semibold text-gray-900">
                        <MdOutlineCurrencyRupee className="mr-1" />
                        {slot.slots.schedule.price}
                      </p>

                      <div className="mt-6 flex justify-end">
                        {slot.slots.schedule.status === "open" ? (
                          <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCheckout(slot);
                            }}
                          >
                            Book
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                            disabled
                          >
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No slots available
                  </div>
                )}
              </div>
            </div>

            {/* Right Section (Service Provider Info) */}
            <div className="lg:w-1/3 p-6 lg:p-10 border-l border-indigo-100 bg-white bg-opacity-90">
              {serviceProvider && (
                <div className="text-center rounded-xl shadow-lg p-8 bg-indigo-50">
                  <img
                    src={serviceProvider.profile_picture}
                    alt="provider"
                    className="h-48 w-48 rounded-full mx-auto mb-6 border-4 border-indigo-200 shadow-lg"
                  />
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    {serviceProvider.name}
                  </h2>
                  <div className="space-y-3 text-left">
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">
                        Gender:
                      </span>{" "}
                      {serviceProvider.gender}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">
                        Service:
                      </span>{" "}
                      {serviceProvider.service}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-indigo-600">
                        Experience:
                      </span>{" "}
                      {serviceProvider.exp_year} years
                    </p>
                  </div>
                  <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
                    <FaInfoCircle className="inline mr-2 text-indigo-600" />
                    <span className="text-sm text-indigo-800">
                      Expert in {serviceProvider.service}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProviderAndSlotDetails;
