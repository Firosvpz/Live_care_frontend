import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import "../../css/user/verifySp.css";
import { verfiySpDetails, fetchCategories } from "../../api/sp_api";

interface IFormInput {
  gender: string;
  service: string;
  specialization: string;
  qualification: string;
  exp_year: number;
  profile_picture: File[];
  rate: number;
  experience_crt: File[];
}

const ServiceProviderDetails: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        console.log("categoriesData", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await verfiySpDetails(data);
      console.log("regRespo:", response);

      if (response) {
        toast.success("Details updated");
        navigate("/sp/sp-home");
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
        <h1 className="register-title">
          Upload <span className="text-primary">Details</span>
        </h1>

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomGender"
                className="register-form-input w-100"
              >
                <Form.Select
                  aria-label="Gender"
                  className="form-select bg-dark text-white"
                  {...register("gender", { required: "Gender is required" })}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomService"
                className="register-form-input w-100"
              >
                <Form.Select
                  aria-label="Service"
                  className="form-select bg-dark text-white"
                  {...register("service", { required: "Service is required" })}
                  isInvalid={!!errors.service}
                >
                  <option value="">Select Service</option>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))
                  ) : (
                    <option value="">No services available</option>
                  )}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.service?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomSpecialization"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="text"
                  placeholder="Specialization"
                  autoComplete="off"
                  {...register("specialization", {
                    required: "Specialization is required",
                  })}
                  isInvalid={!!errors.specialization}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.specialization?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomQualification"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="text"
                  placeholder="Qualification"
                  autoComplete="off"
                  {...register("qualification", {
                    required: "Qualification is required",
                  })}
                  isInvalid={!!errors.qualification}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.qualification?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomExpYear"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="number"
                  placeholder="Years of Experience"
                  autoComplete="off"
                  {...register("exp_year", {
                    required: "Experience is required",
                    min: {
                      value: 0,
                      message: "Experience cannot be negative",
                    },
                  })}
                  isInvalid={!!errors.exp_year}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.exp_year?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomRate"
                className="register-form-input w-100"
              >
                <Form.Control
                  type="number"
                  placeholder="Rate"
                  autoComplete="off"
                  {...register("rate", {
                    required: "Rate is required",
                    min: {
                      value: 0,
                      message: "Rate cannot be negative",
                    },
                  })}
                  isInvalid={!!errors.rate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.rate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomProfilePic"
                className="register-form-input w-100"
              >
                <Form.Label className="text-light">Profile photo</Form.Label>
                <Form.Control
                  type="file"
                  autoComplete="off"
                  {...register("profile_picture", {
                    required: "Profile picture is required",
                  })}
                  isInvalid={!!errors.profile_picture}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.profile_picture?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group
                controlId="validationCustomExpCert"
                className="register-form-input w-100"
              >
                <Form.Label className="text-light">
                  Experience certificate
                </Form.Label>
                <Form.Control
                  type="file"
                  autoComplete="off"
                  {...register("experience_crt", {
                    required: "Experience certificate is required",
                  })}
                  isInvalid={!!errors.experience_crt}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.experience_crt?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

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

export default ServiceProviderDetails;
