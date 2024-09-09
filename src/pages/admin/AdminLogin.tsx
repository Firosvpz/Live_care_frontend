import React from "react";
import { Button, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Col from "react-bootstrap/Col";
import "../../css/user/user_login.css";
import { verifyAdminLogin } from "../../api/admin_api";
import { setAdminCredential } from "../../redux/slices/admin_slice";

interface IFormInput {
  email: string;
  password: string;
}
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, password } = data;

    const response = await verifyAdminLogin(email, password);

    if (response?.data.success) {
      const adminInfo = response.data.token;
      dispatch(setAdminCredential(adminInfo));
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credential", {
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
  return (
    <section className="login-page-container">
      <div className="login-page-overlay"></div>
      <div className="login-form-container">
        <h1 className="login-title">
          Welcome!! <span className="text-primary">Admin</span>
        </h1>

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group
            as={Col}
            md="4"
            controlId="validationCustomUsername"
            className="login-form-input w-100"
          >
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                autoComplete="off"
                {...register("email", {
                  required: true,
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
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
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="login-btn primary-login-btn"
          >
            Login
          </Button>

          <Button variant="primary" className="login-btn google-login-btn">
            Login with Google
          </Button>
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

export default AdminLogin;
