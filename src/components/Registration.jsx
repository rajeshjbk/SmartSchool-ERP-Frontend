import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Registration() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userName: "",
    password: "",
    role: "",
    fullName: "",
    email: "",
    phone: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(userData);

    // API call here
    axios
      .post(
        "https://smartschool-erp.onrender.com/schoolerp/users/add",
        userData,
      )
      .then((response) => {
        console.log("User registered successfully:", response.data);
        alert("User registered successfully!");
        // Redirect to login page
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        alert("Error registering user. Please try again.");
      });
  };

  return (
    <>
      <div className="container-fluid">
        {/* Registration Form */}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "90vh" }}
        >
          <div
            className="card shadow-lg p-2 rounded-4"
            style={{ width: "500px" }}
          >
            <h2 className="text-center text-danger mb-4">User Registration</h2>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  name="userName"
                  value={userData.userName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-bold">Password</label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Full Name"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-bold">Phone Number</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Phone Number"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="form-label fw-bold">Select Role</label>

                <select
                  className="form-select"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>

                  <option value="ROLE_ADMIN">ADMIN</option>

                  <option value="ROLE_TEACHER">TEACHER</option>

                  <option value="ROLE_STUDENT">STUDENT</option>

                  <option value="ROLE_PARENT">PARENT</option>
                </select>
              </div>

              {/* Register Button */}
              <button type="submit" className="btn btn-danger w-100">
                Register
              </button>
            </form>

            <div className="text-center mt-3">
              <span>Already have an account?</span>

              <span className="text-primary ms-2" role="button">
                <Link
                  className="fw-bold"
                  style={{ textDecoration: "none" }}
                  to="/login"
                >
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
