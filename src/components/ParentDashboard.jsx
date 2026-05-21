import { Link, Outlet, useLocation } from "react-router-dom";

export function ParentDashboard() {
  const fullName = localStorage.getItem("fullName");
  const location = useLocation();

  // true when inside child page
  const isChildRoute = location.pathname !== "/parent-dashboard";

  return (
    <>
      {!isChildRoute && (
        <div className="container-fluid p-4 bg-light min-vh-100">
          {/* Welcome Card */}
          <div className="card shadow-lg border-0 rounded-4 mb-4 p-4 bg-info text-white">
            <h2 className="fw-bold">Welcome, {fullName}</h2>

            <p className="mb-0">Parent Dashboard - Smart School ERP</p>
          </div>

          {/* Dashboard Cards */}
          <div className="row g-4">
            {/* Child Profile */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/student"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-person-badge-fill fs-1 text-primary"></i>
                  <h5 className="mt-3">Child Profile</h5>
                  <p className="text-muted">View student details</p>
                </div>
              </Link>
            </div>

            {/* Attendance */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/attendance"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-calendar-check-fill fs-1 text-success"></i>
                  <h5 className="mt-3">Attendance</h5>
                  <p className="text-muted">Check attendance</p>
                </div>
              </Link>
            </div>

            {/* Results */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/results"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-bar-chart-fill fs-1 text-danger"></i>
                  <h5 className="mt-3">Results</h5>
                  <p className="text-muted">View exam performance</p>
                </div>
              </Link>
            </div>

            {/* Timetable */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/timetable"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-clock-history fs-1 text-warning"></i>
                  <h5 className="mt-3">Timetable</h5>
                  <p className="text-muted">View class routine</p>
                </div>
              </Link>
            </div>

            {/* Fees */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/fees"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-currency-rupee fs-1 text-success"></i>
                  <h5 className="mt-3">Fees</h5>
                  <p className="text-muted">View fee payments</p>
                </div>
              </Link>
            </div>

            {/* Notices */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/notices"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-megaphone-fill fs-1 text-primary"></i>
                  <h5 className="mt-3">Notices</h5>
                  <p className="text-muted">School announcements</p>
                </div>
              </Link>
            </div>

            {/* Exams */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/exams"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-pencil-square fs-1 text-dark"></i>
                  <h5 className="mt-3">Exams</h5>
                  <p className="text-muted">Exam schedule</p>
                </div>
              </Link>
            </div>

            {/* Library */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/library"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-journal-bookmark-fill fs-1 text-secondary"></i>
                  <h5 className="mt-3">Library</h5>
                  <p className="text-muted">Book issue details</p>
                </div>
              </Link>
            </div>

            {/* Leave Application */}
            <div className="col-md-3">
              <Link
                to="/parent-dashboard/parent/leave"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-file-earmark-text-fill fs-1 text-danger"></i>
                  <h5 className="mt-3">Leave Apply</h5>
                  <p className="text-muted">Apply leave for child</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}
