import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import UserHeader from "../../components/user/Header";
import Footer from "../../components/common/Footer";
import SpHeader from "../../components/serviceprovider/SpHeader";
import Header from "../../components/common/Header";
import { Heart, Shield, Award, Users } from "lucide-react";

const About: React.FC = () => {
  const location = useLocation();

  const renderHeader = () => {
    if (location.pathname.includes("sp")) {
      return <SpHeader />;
    } else if (location.pathname.includes("user")) {
      return <UserHeader />;
    } else {
      return <Header />;
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {renderHeader()}
      <main className="flex-grow">
        <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              About LiveCare
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-center max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              Your trusted partner in senior consultation services, dedicated to enhancing the quality of life for our elderly community.
            </motion.p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                <p className="text-lg text-gray-600">
                  At LiveCare, our mission is to provide compassionate and tailored consultation services that empower seniors to thrive in their golden years. We are committed to delivering personalized care solutions that enhance the well-being, independence, and dignity of every individual we serve.
                </p>
              </motion.div>
              <motion.div 
                className="rounded-lg overflow-hidden shadow-xl"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
              >
                <img src="/images/blog6.jpg" alt="Senior care" className="w-full h-auto" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              Our Core Values
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: "Compassion", description: "We care deeply about our clients and their well-being, providing empathetic support in every interaction." },
                { icon: Shield, title: "Integrity", description: "We operate with unwavering honesty and transparency, building trust with our clients and their families." },
                { icon: Award, title: "Excellence", description: "We continuously strive for the highest quality in our services, setting new standards in senior care." },
                { icon: Users, title: "Respect", description: "We honor the dignity and individuality of each person, tailoring our approach to their unique needs and preferences." }
              ].map((value, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-lg p-6 shadow-md"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.2 * index }}
                >
                  <value.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              Our Commitment to You
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Personalized Care", description: "We tailor our services to meet the unique needs of each individual, ensuring a personalized care experience." },
                { title: "Professional Expertise", description: "Our team of experienced professionals is dedicated to providing expert guidance and support." },
                { title: "Continuous Support", description: "We're here for you 24/7, offering round-the-clock assistance and peace of mind." }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gray-50 rounded-lg p-6 shadow-md"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: 0.2 * index }}
                >
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      
      </main>
      <Footer />
    </div>
  );
};

export default About;