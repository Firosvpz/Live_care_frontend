import React, { useState, useEffect } from "react";
import Footer from "../../components/common/Footer";
import SpHeader from "../../components/serviceprovider/SpHeader";
import { getSpProfileDetails } from "../../api/sp_api";

const ServiceProviderLanding: React.FC = () => {
  const [profileData, setProfileData] = useState<{
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getSpProfileDetails();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <SpHeader />
      <div
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: 'url("/public/images/spHomee.jpg")' }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative flex flex-col items-center justify-center h-full w-full text-white text-center p-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 slide-in">
            Welcome {profileData?.name}
          </h1>
          <p className="mt-2 text-xl md:text-2xl fade-in">
            Empowering you in senior care excellence
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 ">Our Service Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              "Senior Consultation",
              "Home Health Monitoring",
              "Tailored Care Plans",
            ].map((service) => (
              <div
                key={service}
                className="bg-blue-500 rounded-lg shadow-lg p-6 text-white transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-3xl font-semibold mb-4">{service}</h3>
                <p className="text-lg">
                  Exceptional {service.toLowerCase()} for your clients’
                  well-being.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">What Our Providers Say</h2>
          <div className="flex flex-col md:flex-row md:justify-center gap-8">
            {[
              {
                name: "Dr. Emily Smith",
                text: "A transformative experience for my practice!",
              },
              {
                name: "Nurse John Doe",
                text: "I feel empowered to provide better care.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="italic text-xl">"{testimonial.text}"</p>
                <h4 className="mt-4 font-bold text-lg">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          <div className="bg-gray-200 rounded-lg p-8 shadow-lg mx-auto max-w-3xl">
            <h3 className="font-semibold text-xl mb-4">
              How can I enhance my service delivery?
            </h3>
            <p className="text-gray-700">
              We offer continuous training and resources to help you excel in
              your caregiving role.
            </p>

            <h3 className="font-semibold text-xl mt-6 mb-4">
              What support can I access?
            </h3>
            <p className="text-gray-700">
              Our dedicated team is always here to assist you with any inquiries
              or support you need.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ServiceProviderLanding;
