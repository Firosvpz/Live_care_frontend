import React from "react";
import "../../css/common/About.css";
import UserHeader from "../../components/user/Header";
import Footer from "../../components/common/Footer";

const About: React.FC = () => {
  return (
    <>
      <UserHeader />
      <div className="bg-gray-100 about-container">
        <section className="hero">
          <div className="text-5xl font-semibold  mb-12 tracking-wide">
            About LiveCare
          </div>
          <p>Your trusted partner in senior consultation services</p>
        </section>
        <main className="container mx-auto py-10 px-5">
          <section className="mb-8 about-content shadow-lg">
            <h2>Our Mission</h2>
            <p>
              At LiveCare, our mission is to provide compassionate and tailored
              consultation services that empower seniors to thrive in their
              golden years.
            </p>
            <h2 className="mt-4">Our Vision</h2>
            <p>
              We envision a world where every senior citizen receives the care
              and support they deserve, leading to healthier and happier lives.
            </p>
          </section>
          <section className="mb-8 about-content shadow-lg">
            <h2>Our Core Values</h2>
            <div className="value-item">
              <strong>Compassion:</strong> We care deeply about our clients and
              their well-being.
            </div>
            <div className="value-item">
              <strong>Integrity:</strong> We operate with honesty and
              transparency.
            </div>
            <div className="value-item">
              <strong>Excellence:</strong> We strive for the highest quality in
              our services.
            </div>
            <div className="value-item">
              <strong>Respect:</strong> We honor the dignity and individuality
              of each person.
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default About;
