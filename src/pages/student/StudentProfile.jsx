import api from "../../routers/api";
import { useEffect, useState } from "react";

export function StudentProfile() {
  const [student, setStudent] = useState(null);

  const studentId = localStorage.getItem("studentId");

  // Fetch Student Profile
  const getStudentProfile = async () => {
    try {
      const response = await api.get(`/schoolerp/students/${studentId}`);

      setStudent(response.data);
    } catch (error) {
      console.error("Student Profile Error:", error);

      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
      } else if (error.response?.status === 404) {
        alert("Student profile not found");
      } else {
        alert("Failed to fetch student profile");
      }
    }
  };

  useEffect(() => {
    getStudentProfile();
  }, []);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 mb-4 bg-primary text-white p-4">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-white d-flex justify-content-center align-items-center me-4"
            style={{
              width: "90px",
              height: "90px",
            }}
          >
            <i className="bi bi-person-circle text-primary fs-1"></i>
          </div>

          <div>
            <h2 className="fw-bold mb-1">
              {student?.fullName || "Student Name"}
            </h2>

            <p className="mb-0">Admission No: {student?.admissionNo}</p>

            <p className="mb-0">Academic Year: {student?.academicYear}</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <h3 className="fw-bold text-primary mb-4">Student Details</h3>

          <div className="row">
            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Full Name</label>

              <div className="form-control bg-light">
                {student?.fullName || "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Admission No</label>

              <div className="form-control bg-light">
                {student?.admissionNo || "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Date of Birth</label>

              <div className="form-control bg-light">
                {student?.dob || "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Gender</label>

              <div className="form-control bg-light">
                {student?.gender || "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Academic Year</label>

              <div className="form-control bg-light">
                {student?.academicYear || "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Status</label>

              <div>
                <span
                  className={`badge fs-6 px-3 py-2 ${
                    student?.studentStatus === "ACTIVE"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {student?.studentStatus}
                </span>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Class</label>

              <div className="form-control bg-light">
                {student?.classes?.className || "N/A"}{" "}
                {student?.classes?.section
                  ? `(${student.classes.section})`
                  : ""}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Parent ID</label>

              <div className="form-control bg-light">
                {student?.parent
                  ? `${student.parent.fullName} (ID: ${student.parent.userId})`
                  : "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <label className="fw-semibold text-muted">Student ID</label>

              <div className="form-control bg-light">
                {student?.studentId || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
