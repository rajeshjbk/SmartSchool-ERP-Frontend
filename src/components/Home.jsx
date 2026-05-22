import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole) {
      switch (userRole) {
        case "ROLE_ADMIN":
          navigate("/admin-dashboard");
          break;

        case "ROLE_TEACHER":
          navigate("/teacher-dashboard");
          break;

        case "ROLE_STUDENT":
          navigate("/student-dashboard");
          break;

        case "ROLE_PARENT":
          navigate("/parent-dashboard");
          break;

        default:
          console.log("Invalid Role");
          navigate("/");
      }
    }
  }, [userRole, navigate]);

  return (
    <>
      <div className="container-fluid p-0">
        {/* Hero Section */}
        <div
          className="d-flex justify-content-center align-items-center text-center"
          style={{
            minHeight: "90vh",
            background:
              "linear-gradient(to right,rgb(160,186,232),rgb(150,183,223))",
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 text-lg-start text-center">
                <h1
                  className="fw-bold text-dark"
                  style={{
                    fontSize: "3.5rem",
                  }}
                >
                  Welcome to
                  <span className="text-danger"> Smart School ERP</span>
                </h1>

                <p className="lead text-dark mt-4">
                  Manage Students, Teachers, Attendance, Timetable, Fees,
                  Results, Exams, Library & More — All in One Platform.
                </p>

                {/* Hide buttons after login */}
                {!token && (
                  <div className="mt-4">
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <button className="btn btn-danger btn-lg me-3 px-4">
                        Login
                      </button>
                    </Link>

                    <Link to="/register" style={{ textDecoration: "none" }}>
                      <button className="btn btn-outline-dark btn-lg px-4">
                        Register
                      </button>
                    </Link>
                  </div>
                )}
              </div>
              <div className="col-lg-6 text-center mt-5 mt-lg-0">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                  alt="school"
                  className="img-fluid"
                  style={{
                    width: "450px",
                    filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-5">
          <h2 className="text-center fw-bold text-danger mb-5">Our Features</h2>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="card shadow border-0 rounded-4 text-center p-4 h-100">
                <i className="bi bi-people-fill text-primary fs-1"></i>

                <h4 className="mt-3">Student Management</h4>

                <p className="text-muted">
                  Easily manage students and academic records.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 rounded-4 text-center p-4 h-100">
                <i className="bi bi-calendar-check-fill text-success fs-1"></i>

                <h4 className="mt-3">Attendance</h4>

                <p className="text-muted">
                  Track student attendance efficiently.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 rounded-4 text-center p-4 h-100">
                <i className="bi bi-currency-rupee text-warning fs-1"></i>

                <h4 className="mt-3">Fees Management</h4>

                <p className="text-muted">
                  Secure and easy fee payment system.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow border-0 rounded-4 text-center p-4 h-100">
                <i className="bi bi-journal-bookmark-fill text-danger fs-1"></i>

                <h4 className="mt-3">Library System</h4>

                <p className="text-muted">
                  Manage books and issue records smartly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
