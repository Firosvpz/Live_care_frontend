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
import { FaArrowLeft } from "react-icons/fa";

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
    if (response?.data.success) {
      const userInfo = {
        token: response.data.data.token,
        userId: response.data.data.userId,
      };

      toast.success("Login successful!");
      dispatch(setUserCredential(userInfo));
      navigate("/user/user-home");
    } else {
      toast.error(response?.data.message);
    }
  };

  // Handle Google login response
  const responseGoogle = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    const res = await googleLogin(credential);

    if (res?.data.success) {
      const userInfo = {
        token: res.data.data.token,
        userId: res.data.data.userId,
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
      <div className="login-page-overlay outset bg-black/70"></div>
     
      <div className="login-form-container">
      <button
              className="mb-4 inline-flex items-center text-sm font-medium text-blue-300 hover:text-white"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </button>
        <div className="login-title">
          Welcome!! <span className="text-info">LIVECARE</span>
        </div>
        <p className="login-caption italic text-gray-600">
          Providing compassionate and personalized care for seniors. Login to continue your journey with us.
        </p>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername" className="login-form-input w-100">
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend" className="border-info">@</InputGroup.Text>
              <Form.Control
                className="w-75 border-info"
                type="email"
                placeholder="Email"
                autoComplete="off"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">Email is required !!</p>
              )}
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="validationCustom03" className="login-form-input w-100">
            <Form.Control
              type="password"
              placeholder="Password"
              autoComplete="off"
              className="border-info"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-danger text-start text-sm mt-1">Password is required</p>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="login-btn primary-login-btn w-50">
            Login
          </Button>

          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => toast.error("Google Login failed!")}
            
          />

        </Form>

        <Link to="/user-register">
          <Button variant="link" className="text-info">
            Don't have an account? Sign up here
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default UserLogin;