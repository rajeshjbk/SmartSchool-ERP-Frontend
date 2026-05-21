import { Link, Outlet, useLocation } from "react-router-dom";

export function TeacherDashboard() {
  const location = useLocation();

  // true when inside child page
  const isChildRoute = location.pathname !== "/teacher-dashboard";
  const fullName = localStorage.getItem("fullName");

  return (
    <>
      {!isChildRoute && (
        <div className="container-fluid p-4 bg-light min-vh-100">
          {/* Welcome Card */}
          <div className="card shadow-lg border-0 rounded-4 mb-4 p-4 bg-success text-white">
            <h2 className="fw-bold">Welcome, {fullName}</h2>

            <p className="mb-0">Teacher Dashboard - Smart School ERP</p>
          </div>

          {/* Dashboard Cards */}
          <div className="row g-4">
            {/* Students */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/student"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-people-fill fs-1 text-primary"></i>
                  <h5 className="mt-3">Students</h5>
                  <p className="text-muted">View student records</p>
                </div>
              </Link>
            </div>

            {/* Attendance */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/attendance"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-calendar-check-fill fs-1 text-success"></i>
                  <h5 className="mt-3">Attendance</h5>
                  <p className="text-muted">Mark attendance</p>
                </div>
              </Link>
            </div>

            {/* Results */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/results"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-bar-chart-fill fs-1 text-danger"></i>
                  <h5 className="mt-3">Results</h5>
                  <p className="text-muted">Manage student results</p>
                </div>
              </Link>
            </div>

            {/* Timetable */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/timetable"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-clock-history fs-1 text-warning"></i>
                  <h5 className="mt-3">Timetable</h5>
                  <p className="text-muted">View teaching schedule</p>
                </div>
              </Link>
            </div>

            {/* Classes */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/classes"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-building fs-1 text-info"></i>
                  <h5 className="mt-3">Classes</h5>
                  <p className="text-muted">View assigned classes</p>
                </div>
              </Link>
            </div>

            {/* Subjects */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/subjects"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-book-fill fs-1 text-secondary"></i>
                  <h5 className="mt-3">Subjects</h5>
                  <p className="text-muted">View subject details</p>
                </div>
              </Link>
            </div>

            {/* Notices */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/notices"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-megaphone-fill fs-1 text-danger"></i>
                  <h5 className="mt-3">Notices</h5>
                  <p className="text-muted">View & create notices</p>
                </div>
              </Link>
            </div>

            {/* Exams */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/exams"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-pencil-square fs-1 text-dark"></i>
                  <h5 className="mt-3">Exams</h5>
                  <p className="text-muted">View exam schedule</p>
                </div>
              </Link>
            </div>

            {/* Library */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/library"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-journal-bookmark-fill fs-1 text-primary"></i>
                  <h5 className="mt-3">Library</h5>
                  <p className="text-muted">View books</p>
                </div>
              </Link>
            </div>

            {/* Leave */}
            <div className="col-md-3">
              <Link
                to="/teacher-dashboard/teacher/leave"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="card shadow rounded-4 border-0 text-center p-4 h-100">
                  <i className="bi bi-file-earmark-text-fill fs-1 text-success"></i>
                  <h5 className="mt-3">Leave</h5>
                  <p className="text-muted">Apply leave request</p>
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
