import React, { useState, useEffect } from "react";
import UserHeader from "../../components/user/Header";
import { getProfileDetails } from "../../api/user_api";
import Footer from "../../components/common/Footer";
const UserLanding: React.FC = () => {
  const [profileData, setProfileData] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getProfileDetails();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <UserHeader />
      <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: 'url("/images/userLand.jpg")' }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative flex flex-col items-center justify-center h-full w-full text-white">
          <h1 className="text-5xl md:text-7xl font-bold slide-in">Welcome, {profileData?.name}</h1>
          <p className="mt-4 text-xl md:text-2xl fade-in">Your trusted partner in senior citizen care</p>
        </div>
      </div>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Consultation", "Home Care", "Nursing Services"].map((service) => (
              <div
                key={service}
                className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-4">{service}</h3>
                <p className="text-gray-600">Providing the best {service.toLowerCase()} for your needs.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Testimonials</h2>
          <div className="flex flex-col md:flex-row md:justify-center gap-6">
            {[
              { name: "John Doe", text: "The service was exceptional!" },
              { name: "Jane Smith", text: "Highly recommend for senior care." },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="italic text-lg">"{testimonial.text}"</p>
                <h4 className="mt-4 font-bold text-xl">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-8">FAQs</h2>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="font-semibold text-xl mb-4">What services do you offer?</h3>
            <p className="text-gray-600">We offer a range of services including home care, consultations, and nursing services tailored for senior citizens.</p>

            <h3 className="font-semibold text-xl mt-6 mb-4">How can I contact you?</h3>
            <p className="text-gray-600">You can reach us through our contact page or by calling our support line.</p>
          </div>
        </div>
      </section>

    <Footer/>
    </>
  );
};

export default UserLanding;
