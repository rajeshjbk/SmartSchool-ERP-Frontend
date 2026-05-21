import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  // Check token exists or not
  const token = localStorage.getItem("jwtToken");

  // Logout Function
  const handleLogout = () => {
    localStorage.clear(); // remove all localStorage items
    alert("Logout Successful");
    navigate("/");
  };

  return (
    <>
      <div className="border border-4 mt-2 p-3 d-flex align-items-center justify-content-between rounded shadow">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <Link
            to="/"
            className="d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <span className="bi bi-house-fill fs-3 text-danger"></span>

            <h2 className="text-danger mx-2 mb-0">Smart School ERP</h2>
          </Link>
        </div>

        {/* Buttons */}
        <div className="d-flex align-items-center">
          {!token ? (
            <>
              {/* Login Button */}
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button className="btn btn-outline-primary mx-2">
                  <span className="bi bi-person me-1"></span>
                  Login
                </button>
              </Link>

              {/* Signup Button */}
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button className="btn btn-danger">
                  <span className="bi bi-person-fill me-1"></span>
                  SignUp
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Logout Button */}
              <button className="btn btn-danger" onClick={handleLogout}>
                <span className="bi bi-box-arrow-right me-1"></span>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
