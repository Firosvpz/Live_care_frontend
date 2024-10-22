import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import "../../css/user/verifySp.css";
import { verfiyUserDetails } from "../../api/user_api";

interface IFormInput {
  dob: Date;
  user_address: string;
  medical_history: string;
  blood_type: string;
  // profile_picture?: File[];
}

const UserDetails: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await verfiyUserDetails(data);
      console.log("regRespo:", response);

      if (response) {
        toast.success("Details updated");
        navigate("/user/user-home");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="register-page-container">
      <div className="register-page-overlay"></div>
      <div className="register-form-container">
        <h1 className="register-title text-light">
          Upload <span className="text-primary">Details</span>
        </h1>

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Date of Birth */}
            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomDob"
                className="register-form-input w-100"
              ><Form.Label className="text-white">Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  className="bg-dark text-white"
                  {...register("dob", {
                    required: "DOB is required",
                    validate: (value) =>
                      new Date(value) < new Date("1990-01-01") ||
                      "Must be before 1990",
                  })}
                  isInvalid={!!errors.dob}
                  max="1989-12-31" // Restrict date selection
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dob?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Address */}
            <Col md={6} className="mb-3">
            <Form.Label className="text-white">Enter your Address</Form.Label>
              <Form.Group
                controlId="validationCustomAddress"
                className="register-form-input bg-dark w-100"
              >
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  autoComplete="off"
                  style={{
                    height: "60px",
                    backgroundColor: "dark", // Set the background color to black
                    color: "white", // Change text color to white for better visibility
                  }}
                  {...register("user_address", {
                    required: "Address is required",
                  })}
                  isInvalid={!!errors.user_address}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_address?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Medical History Dropdown */}
            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomMedicalHistory"
                className="register-form-input w-100"
              >
                <Form.Control
                  as="select"
                  className="bg-dark text-white" // Dropdown styling
                  {...register("medical_history", {
                    required: "Medical history is required",
                  })}
                  isInvalid={!!errors.medical_history}
                >
                  <option value="">Select Medical History</option>
                  <option value="none">None</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="hypertension">Hypertension</option>
                  <option value="heart_disease">Heart Disease</option>
                  <option value="allergies">Allergies</option>
                  <option value="other">Other</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.medical_history?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Blood Group Dropdown */}
            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomBloodType"
                className="register-form-input w-100"
              >
                <Form.Control
                  as="select"
                  className="bg-dark text-white" // Dropdown styling
                  {...register("blood_type", {
                    required: "Blood group is required",
                  })}
                  isInvalid={!!errors.blood_type}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.blood_type?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Profile Picture */}
            {/* <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomProfilePic"
                className="register-form-input w-100"
              >
                <Form.Label className="text-light">Profile Photo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register("profile_picture", {
                    required: "Profile picture is required",
                  })}
                  isInvalid={!!errors.profile_picture}
                  className="bg-dark text-white" // File input styling
                />
                <Form.Control.Feedback type="invalid">
                  {errors.profile_picture?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col> */}

            {/* Submit Button */}
            <Col md={12} className="d-flex justify-content-center">
              <Button
                variant="primary"
                type="submit"
                className="register-btn w-50"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export default UserDetails;
