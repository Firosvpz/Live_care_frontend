import React from "react";
import "../../css/common/Contact.css";
import UserHeader from "../../components/user/Header";
import Footer from "../../components/common/Footer";

const Contact: React.FC = () => {
  return (
    <>
      <UserHeader />
      <div className="bg-gray-100 contact-container">
        <section className="hero bg-blue-500 text-white text-center py-16">
          <h1 className="text-4xl font-bold">Contact LiveCare</h1>
          <p className="mt-4 text-lg">
            We're here to assist you with any inquiries or support needs.
          </p>
        </section>

        <main className="container mx-auto py-10 px-5">
          <section className="bg-white shadow-lg rounded-lg p-6 mb-8 contact-info">
            <h2 className="text-2xl font-semibold text-blue-600">
              Get in Touch
            </h2>
            <p>
              If you have any questions, feel free to reach out to us through
              the contact details below:
            </p>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-blue-600">Phone</h3>
              <p>📞 +1 234 567 890</p>

              <h3 className="text-xl font-bold text-blue-600 mt-4">Email</h3>
              <p>✉️ support@livecare.com</p>

              <h3 className="text-xl font-bold text-blue-600 mt-4">
                Office Address
              </h3>
              <p>🏢 123 LiveCare Street, Senior City, ST 56789</p>

              <h3 className="text-xl font-bold text-blue-600 mt-4">
                Social Media
              </h3>
              <p>
                <a href="#" className="text-blue-500">
                  Facebook
                </a>{" "}
                |
                <a href="#" className="text-blue-500 ml-2">
                  Twitter
                </a>{" "}
                |
                <a href="#" className="text-blue-500 ml-2">
                  LinkedIn
                </a>
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
