import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { resendOtp, verifyOtp } from "../../api/user_api";
import "../../css/user/user_otp.css";

const UserOtp: React.FC = () => {
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

    const response = await verifyOtp(otp);

    if (response?.data.success) {
      toast.success("You've successfully registered!");
      navigate("/user-login");
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
    const response = await resendOtp();

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
        <div className="flex justify-evenly text-white mt-2 ">
          <p className="text-[#142057] ">
            Time remaining : <span className="font-medium">{counter}</span>
          </p>
          <p>
            {counter === 0 && (
              <button
                onClick={handleResendOtp}
                className="font-medium underline text-[#2F76FF] btn text-danger fw-bold "
              >
                Resend Otp
              </button>
            )}
          </p>
        </div>
        <button onClick={handleVerify} className="otp-button">
          Verify
        </button>
      </div>
    </section>
  );
};

export default UserOtp;
