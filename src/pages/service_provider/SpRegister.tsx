import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import "../../css/user/verifySp.css";
import { spRegister } from "../../api/sp_api";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
}

const ServiceProviderRegister: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IFormInput>({ mode: "onChange" });

  const password = watch("password");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setLoading(true);
      const { name, email, password, phone_number } = data;
      const response = await spRegister(name, email, password, phone_number);

      if (response?.data.success) {
        toast.success("Registration successful! Please verify your email.");
        navigate("/sp/verify-sp-otp");
      } else {
        toast.error("Email already in use. Please log in or choose another.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page-container">
      <div className="register-page-overlay"></div>
      <div className="register-form-container">
        <h1 className="register-title">
          <span className="text-primary">
            LIVE<span className="text-light">CARE</span>
          </span>
        </h1>
        <p className="register-caption">
          Compassionate and personalized care for seniors. Register now to begin
          your journey with us.
        </p>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group
                controlId="validationCustomName"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  autoComplete="off"
                  {...register("name", {
                    required: "Name is required",
                    pattern: {
                      value: /^[a-zA-Z ]{2,30}$/,
                      message: "Invalid name",
                    },
                  })}
                  isInvalid={!!errors.name}
                />
                {errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group
                controlId="validationCustomEmail"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  autoComplete="off"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  isInvalid={!!errors.email}
                />
                {errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group
                controlId="validationCustomPassword"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                      message:
                        "Password must be 6-16 characters long with a number and special character",
                    },
                  })}
                  isInvalid={!!errors.password}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group
                controlId="validationCustomConfirmPassword"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  isInvalid={!!errors.confirm_password}
                />
                {errors.confirm_password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm_password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group
                controlId="validationCustomPhone"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  autoComplete="off"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number should be 10 digits",
                    },
                  })}
                  isInvalid={!!errors.phone_number}
                />
                {errors.phone_number && (
                  <Form.Control.Feedback type="invalid">
                    {errors.phone_number.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={6} className="d-flex align-items-end">
              <Button
                disabled={loading}
                variant="primary"
                type="submit"
                className="register-btn w-100"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Register"}
              </Button>
            </Col>
          </Row>

          <Link to="/sp-login">
            <Button variant="link" className="signup-btn">
              Already have an account? Login here
            </Button>
          </Link>
        </Form>
      </div>
    </section>
  );
};

export default ServiceProviderRegister;
