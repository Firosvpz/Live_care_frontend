import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import '../../css/user/user_otp.css'; 
import { verify_sp_otp } from "../../api/sp_api";

const ServiceProviderOtp: React.FC = () => {
  const navigate = useNavigate();
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

    const response = await verify_sp_otp(otp);

    if (response.success) {
      if (response.accessToken && response.refreshToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
      }
      toast.success("You've successfully registered!");
      navigate("/");
    } else {
      toast.error(response.message || "Invalid OTP");
    }
  };

  return (
    <section className="otp-page-container">
      <div className="otp-page-overlay"></div>
      <div className="otp-box">
        <h1 className="otp-title">OTP Verification</h1>
        <p className="otp-caption">
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
        <button
          onClick={handleVerify}
          className="otp-button"
        >
          Verify
        </button>
      </div>
    </section>
  );
};

export default ServiceProviderOtp;
