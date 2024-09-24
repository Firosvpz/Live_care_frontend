import React from "react";
import { Button, Carousel, Accordion } from "react-bootstrap";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Home: React.FC = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/images/image2.jpg')` }}>
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="container relative z-10 text-center text-white lg:text-left">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="text-4xl lg:text-6xl font-bold">
                Welcome to <span className="text-info">LiveCare</span>
              </h1>
              <p className="mt-4 text-lg lg:text-xl">
                Your health, our priority. Discover the best healthcare services
                tailored for you.
              </p>
              <div className="mt-6 flex justify-center lg:justify-start space-x-4">
                <Button variant="info" className="px-6 py-3 text-lg font-semibold">
                  Get Started
                </Button>
                <Button
                  variant="outline-light"
                  className="px-6 py-3 text-lg font-semibold"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Services</h2>
          <div className="row justify-center">
            {["Senior Consultation", "Home Health Monitoring", "Tailored Care Plans"].map((service, index) => (
              <div className="col-lg-4 col-md-6 mb-8" key={index}>
                <div className="p-6 bg-white shadow-lg rounded-lg transform transition-transform duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold mb-4">{service}</h3>
                  <p className="text-gray-700">
                    Experience top-notch {service.toLowerCase()} services tailored to meet your needs.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold mb-8">What Our Clients Say</h2>
          <Carousel className="w-full md:w-2/3 mx-auto">
            {[
              { name: "Dr. Emily Smith", text: "A transformative experience for my practice!" },
              { name: "Nurse John Doe", text: "I feel empowered to provide better care." },
              { name: "Client Jane Roe", text: "LiveCare has truly elevated my care experience!" },
            ].map((testimonial, index) => (
              <Carousel.Item key={index}>
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <p className="text-lg italic mb-4">"{testimonial.text}"</p>
                  <h5 className="text-xl font-semibold">- {testimonial.name}</h5>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h2>
          <div className="mx-auto md:w-2/3">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>How can I enhance my service delivery?</Accordion.Header>
                <Accordion.Body>
                  We offer continuous training and resources to help you excel in your caregiving role.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>What support can I access?</Accordion.Header>
                <Accordion.Body>
                  Our dedicated team is always here to assist you with any inquiries or support you need.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>

    

      <Footer />
    </>
  );
};

export default Home;
