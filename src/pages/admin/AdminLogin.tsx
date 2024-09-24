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
      toast.success("admin login successfully");
    } else {
      toast.error("Invalid email or password", {
        style: {
          padding: "16px",
          color: "red", // Text color
          backgroundColor: "#fff", // Background color
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
                className="w-75"
                type="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                autoComplete="off"
                {...register("email", {
                  required: true,
                })}
              />
              {errors.email && (
                <p className="text-danger  text-sm mt-1">
                  Email is required !!
                </p>
              )}
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
              <p className="text-danger text-start text-sm mt-1">
                Password is required !!
              </p>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="login-btn w-50">
            Login
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default AdminLogin;
