import React from "react";
import { Button } from "react-bootstrap";
import Header from "../../components/common/Header";
import "../../css/common/Home.css";
const Home: React.FC = () => {
  return (
    <>
      <Header />
      <section className="banner-container">
        <div className="banner-content text-center text-lg-start container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="banner-title">
                Welcome to <span className="highlight">LiveCare</span>
              </h1>
              <p className="banner-subtitle">
                Your health, our priority. Discover the best healthcare services
                tailored for you.
              </p>
              <div className="banner-buttons">
                <Button variant="info" className="banner-btn primary-btn me-3">
                  Get Started
                </Button>
                <Button
                  variant="outline-light"
                  className="banner-btn secondary-btn"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="banner-overlay"></div>
      </section>
    </>
  );
};

export default Home;
