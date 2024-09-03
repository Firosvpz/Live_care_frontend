import React, { useState } from "react";
import { Button, Form, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import "../../css/user/user_register.css";
import { sp_register } from "../../api/sp_api";


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
        const response = await sp_register(name, email, password, phone_number);
        console.log('response:',response);
        
        if (response) {
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
            Join Us at <span className="text-primary">LIVECARE</span>
          </h1>
          <p className="register-caption">
            Providing compassionate and personalized care for seniors. Register to
            start your journey with us.
          </p>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustomName"
              className="register-form-input w-100"
            >
              <Form.Control
                type="text"
                placeholder="Name"
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
  
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustomEmail"
              className="register-form-input w-100"
            >
              <Form.Control
                type="email"
                placeholder="Email"
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
  
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustomPassword"
              className="login-form-input w-100"
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
                      "Password should be 6-16 characters long and contain at least one number and one special character",
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
  
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustomConfirmPassword"
              className="login-form-input w-100"
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
  
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustomPhone"
              className="login-form-input w-100"
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
  
            <Button
              disabled={loading}
              variant="primary"
              type="submit"
              className="login-btn primary-login-btn"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Register"}
            </Button>
  
            <Link to="/user-login">
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
