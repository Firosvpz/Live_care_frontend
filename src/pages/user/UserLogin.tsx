import React from "react";
import { Button, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Col from "react-bootstrap/Col";
import "../../css/user/user_login.css";
import { userLogin, googleLogin } from "../../api/user_api";
import { setUserCredential } from "../../redux/slices/user_slice";
import { GoogleLogin } from "@react-oauth/google";

interface IFormInput {
  email: string;
  password: string;
}
const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, password } = data;

    const response = await userLogin(email, password);
    console.log("response", response);
    if (response?.data.success) {
      const userInfo = {
        token: response.data.data.token, // Store token
        userId: response.data.data.userId, // Assume userId is returned in response
      };
      console.log("userInfo", userInfo);

      toast.success("Login successful!");
      dispatch(setUserCredential(userInfo));
      navigate("/user/user-home");
    } else {
      toast.error(response?.data.message, {
        style: {
          border: "1px solid #dc3545",
          padding: "16px",
          color: "#721c24", // Text color
          backgroundColor: "#f8d7da", // Background color
          fontSize: "14px", // Ensure text size is readable
        },
        iconTheme: {
          primary: "#dc3545",
          secondary: "#721c24",
        },
      });
    }
  };

  // Function to handle Google login response
  const responseGoogle = async (response: any) => {
    console.log("Google Login response", response);
    const { credential } = response;

    // Use the new googleLogin function
    const res = await googleLogin(credential);

    if (res?.data.success) {
      const userInfo = {
        token: res.data.data.token, // Assuming the backend returns a token
        userId: res.data.data.userId, // Assuming the backend returns a userId
      };
      dispatch(setUserCredential(userInfo));
      toast.success("Google Login successful!");
      navigate("/user/user-home");
    } else {
      toast.error(res?.data.message || "Google Login failed!");
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
              <InputGroup.Text id="inputGroupPrepend" className="border-info">
                @
              </InputGroup.Text>
              <Form.Control
                className="w-75 border-info"
                type="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                autoComplete="off"
                {...register("email", {
                  required: true,
                })}
              />

              {errors.email && (
                <p className="text-danger text-sm mt-1">Email is required !!</p>
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
              <p className="text-danger text-start text-sm mt-1">
                Password is required
              </p>
            )}
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="login-btn primary-login-btn w-50"
          >
            Login
          </Button>
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={responseGoogle}
            onFailure={(error: any) => toast.error("Google Login failed!")}
            cookiePolicy={"single_host_origin"}
            style={{ marginTop: "10px" }} // Adjust styles if necessary
          />
          {/* <Button variant="primary" className="login-btn google-login-btn">
            Login with Google
          </Button> */}
        </Form>

        <Link to="/user-register">
          <Button variant="link" className="signup-btn">
            Don't have an account? Sign up here
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default UserLogin;
