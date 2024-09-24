import React from "react";
import { Button, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Col from "react-bootstrap/Col";
import { spLogin } from "../../api/sp_api";
import { setServiceProviderCredential } from "../../redux/slices/sp_slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";

interface IFormInput {
  email: string;
  password: string;
}

const ServiceProviderLogin: React.FC = () => {
  const spInfo = useSelector((state: RootState) => state.spInfo.spInfo); // Correctly accessing the Redux state
  console.log("Current Service Provider Info:", spInfo);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, password } = data;
    try {
      const response = await spLogin(email, password);

      if (!response) {
        toast.error(response.data.message);
        return;
      }

      console.log("API Response:", response);

      const { hasCompletedDetails } = response.data;

      if (!hasCompletedDetails) {
        dispatch(setServiceProviderCredential(response.data.token));
        console.log("Dispatching for incomplete details", response.data.token);
        navigate("/sp/verify-details");
      } else if (response.success) {
        const spInfo = response.data.token;
        console.log("spiNfooo", spInfo);

        dispatch(setServiceProviderCredential(spInfo));
        console.log("Dispatching for complete details", spInfo);
        navigate("/sp/sp-home");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <section className="login-page-container">
      <div className="login-page-overlay"></div>
      <div className="login-form-container">
        <h1 className="login-title">
          Welcome!! <span className="text-primary">LIVECARE</span>
        </h1>
        <p className="login-caption text-info">
          Providing compassionate and personalized care for seniors. Login to
          continue your journey with us.
        </p>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group
            as={Col}
            md="4"
            controlId="validationCustomUsername"
            className="login-form-input w-100"
          >
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend" className="border-info">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                autoComplete="off"
                className="border-info w-75"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">Email is required</p>
              )}
              <Form.Control.Feedback type="invalid">
                Please choose an email.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustom03"
            className="login-form-input w-100"
          >
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="off"
              className="border-info"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-danger  text-start  text-sm mt-1">Password is required</p>
            )}
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="login-btn primary-login-btn w-50 "
          >
            Login
          </Button>

          {/* <Button variant="primary" className="login-btn google-login-btn">
            Login with Google
          </Button> */}
        </Form>

        <Link to="/sp-register">
          <Button variant="link" className="signup-btn">
            Don't have an account? Sign up here
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ServiceProviderLogin;
