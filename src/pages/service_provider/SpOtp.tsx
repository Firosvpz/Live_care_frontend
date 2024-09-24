import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../css/user/user_otp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { verifySpOtp, resendSpOtp } from "../../api/sp_api";
import Swal from "sweetalert2";

const ServiceProviderOtp: React.FC = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(30);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);

  const handleOnChange = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
  };

  const handleVerify = async () => {
    const otp = otpValues.join("");
    if (otp.length !== 4) {
      return toast.error("Enter a 4-digit OTP");
    }

    const response = await verifySpOtp(otp);

    if (response?.data) {
      toast.success("You've successfully registered!");
      navigate("/sp-login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please check the OTP and try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleResendOtp = async () => {
    setCounter(30);
    const response = await resendSpOtp();

    if (response?.data.success) {
      toast.success("New OTP sent");
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const timer: any =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <section className="otp-page-container">
      <div className="otp-page-overlay"></div>
      <div className="otp-box">
        <h1 className="otp-title">
          <span className="text-primary">
            OTP<span className="text-light"> VERIFICATION</span>
          </span>
        </h1>
        <p className="otp-caption text-info">
          A One-Time Password (OTP) has been sent to your registered email.
          Please enter it below to verify your account.
        </p>
        <div className="otp-input-container">
          {otpValues.map((value, index) => (
            <input
              key={index}
              value={value}
              className="otp-input"
              type="text"
              maxLength={1}
              onChange={(e) => handleOnChange(index, e.target.value)}
            />
          ))}
        </div>
        <div className="flex justify-evenly text-white mt-2">
          <p className="otp-timer bg-dark text-info fw-bold p-2 rounded d-flex align-items-center justify-content-center">
            <FontAwesomeIcon icon={faClock} />
            &nbsp; :&nbsp; {counter}
          </p>

          {counter === 0 ? (
            <button
              onClick={handleResendOtp}
              className=" active bg-dark text-info fw-bold p-2 rounded d-flex align-items-center justify-content-center"
            >
              <FontAwesomeIcon icon={faRedoAlt} />
              &nbsp; resend
            </button>
          ) : (
            <button
              className=" bg-dark text-secondary fw-bold p-2 rounded d-flex align-items-center justify-content-center"
              disabled
            >
              <FontAwesomeIcon icon={faRedoAlt} />
              &nbsp; resend
            </button>
          )}
        </div>
        <button onClick={handleVerify} className="otp-button mt-3 w-50">
          Verify
        </button>
      </div>
    </section>
  );
};

export default ServiceProviderOtp;
