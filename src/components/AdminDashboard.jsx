import { Link, Outlet, useLocation } from "react-router-dom";

export function AdminDashboard() {
  const location = useLocation();

  // true when inside child page
  const isChildRoute = location.pathname !== "/admin-dashboard";

  const adminOperations = [
    {
      title: "Users",
      icon: "bi-people-fill",
      path: "/admin-dashboard/users-crud",
      color: "primary",
    },
    {
      title: "Teachers",
      icon: "bi-person-workspace",
      path: "/admin-dashboard/teachers-crud",
      color: "success",
    },
    {
      title: "Students",
      icon: "bi-mortarboard-fill",
      path: "/admin-dashboard/students-crud",
      color: "warning",
    },
    {
      title: "Classes",
      icon: "bi-building",
      path: "/admin-dashboard/classes-crud",
      color: "info",
    },
    {
      title: "Subjects",
      icon: "bi-book-fill",
      path: "/admin-dashboard/subjects-crud",
      color: "secondary",
    },
    {
      title: "Attendance",
      icon: "bi-calendar-check-fill",
      path: "/admin-dashboard/attendance-crud",
      color: "danger",
    },
    {
      title: "Exams",
      icon: "bi-file-earmark-text-fill",
      path: "/admin-dashboard/exams-crud",
      color: "dark",
    },
    {
      title: "Exam Subjects",
      icon: "bi-journal-bookmark-fill",
      path: "/admin-dashboard/exam-subjects-crud",
      color: "primary",
    },
    {
      title: "Results",
      icon: "bi-award-fill",
      path: "/admin-dashboard/results-crud",
      color: "success",
    },
    {
      title: "Timetable",
      icon: "bi-clock-fill",
      path: "/admin-dashboard/timetable-crud",
      color: "warning",
    },
    {
      title: "Books",
      icon: "bi-book-half",
      path: "/admin-dashboard/books-crud",
      color: "info",
    },
    {
      title: "Book Issues",
      icon: "bi-journal-arrow-up",
      path: "/admin-dashboard/book-issues-crud",
      color: "secondary",
    },
    {
      title: "Fee Structure",
      icon: "bi-cash-stack",
      path: "/admin-dashboard/fee-structure-crud",
      color: "danger",
    },
    {
      title: "Fee Transactions",
      icon: "bi-credit-card-fill",
      path: "/admin-dashboard/fee-transactions-crud",
      color: "dark",
    },
    {
      title: "Notices",
      icon: "bi-megaphone-fill",
      path: "/admin-dashboard/notices-crud",
      color: "primary",
    },
    {
      title: "Leave Applications",
      icon: "bi-envelope-paper-fill",
      path: "/admin-dashboard/leave-applications-crud",
      color: "success",
    },
  ];

  return (
    <>
      {!isChildRoute && (
        <div className="container py-4">
          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-danger">Admin Dashboard</h1>

            <p className="text-muted">
              Manage all Smart School ERP operations from one place
            </p>
          </div>

          {/* Cards */}
          <div className="row g-4">
            {adminOperations.map((operation, index) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                <div
                  className={`card shadow border-0 rounded-4 h-100 text-center p-3`}
                >
                  <div className="card-body">
                    <i
                      className={`bi ${operation.icon} fs-1 text-${operation.color}`}
                    ></i>

                    <h5 className="mt-3 fw-bold">{operation.title}</h5>

                    <Link
                      to={operation.path}
                      className={`btn btn-${operation.color} mt-3 w-100`}
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
}
