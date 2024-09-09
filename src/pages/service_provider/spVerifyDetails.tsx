import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import "../../css/user/verify_sp.css";
import { verfiySpDetails } from "../../api/sp_api";

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

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await verfiySpDetails(data);
      console.log("regRespo:", response);

      if (response) {
        toast.success("Details updated");
        navigate("/sp/sp-home");
      } else {
        toast.error("something went wrong");
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
          Details <span className="text-primary">HERE</span>
        </h1>

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="validationCustomGender">
                <Form.Select
                  aria-label="Gender"
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
              <Form.Group controlId="validationCustomSpecialization">
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
              <Form.Group controlId="validationCustomQualification">
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
              <Form.Group controlId="validationCustomService">
                <Form.Select
                  aria-label="Service"
                  {...register("service", { required: "Service is required" })}
                  isInvalid={!!errors.service}
                >
                  <option value="">Select a Service</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="preDeliveryCare">Pre-Delivery Care</option>
                  <option value="PostDeliveryCare">Post-Delivery Care</option>
                  <option value="HomeTaker">Home Taker</option>
                  <option value="YogaTherapy">Yoga Therapy</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.service?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group controlId="validationCustomExpYear">
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
              <Form.Group controlId="validationCustomRate">
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
              <Form.Group controlId="validationCustomProfilePic">
                <Form.Label className="text-light">Profile photo</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Profile Photo"
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
              <Form.Group controlId="validationCustomExpCert">
                <Form.Label className="text-light">
                  Experience certificate
                </Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Experience Certificate"
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
              <Button variant="primary" type="submit" className="w-100">
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
