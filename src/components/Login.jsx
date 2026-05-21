import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const authHeader = `Basic ${btoa(
        `${loginData.userName}:${loginData.password}`,
      )}`;

      const response = await axios.post(
        "https://smartschool-erp.onrender.com/schoolerp/signIn",
        {}, // Empty body
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      console.log(response.data);

      // JWT token from response header
      const token = response.headers["authorization"];

      if (token) {
        localStorage.setItem("jwtToken", token);

        localStorage.setItem("fullName", response.data.fullName);

        localStorage.setItem("userId", response.data.id);

        localStorage.setItem("userRole", response.data.userRole);

        alert("Login Successful!");

        switch (response.data.userRole) {
          case "ROLE_ADMIN":
            navigate("/admin-dashboard");
            break;

          case "ROLE_TEACHER":
            localStorage.setItem("teacherId", response.data?.teacherId);
            navigate("/teacher-dashboard");
            break;

          case "ROLE_STUDENT":
            localStorage.setItem("studentId", response.data.studentId);

            navigate("/student-dashboard");
            break;

          case "ROLE_PARENT":
            navigate("/parent-dashboard");
            break;

          default:
            console.log("Invalid Role");
            navigate("/");
        }
      } else {
        alert("JWT Token Not Found");
        console.error("JWT retrieval failed");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response && error.response.status === 401) {
        alert("Invalid Username or Password");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="container-fluid">
        {/* Login Form */}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div className="card shadow p-4 rounded-4" style={{ width: "400px" }}>
            <h2 className="text-center text-danger mb-4">Login</h2>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  name="userName"
                  value={loginData.userName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-danger w-100">
                Login
              </button>
            </form>

            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <span className="text-primary" role="button">
                <Link
                  className="fw-bold"
                  style={{ textDecoration: "none" }}
                  to="/register"
                >
                  SignUp
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
