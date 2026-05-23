import api from "../../routers/api";

import { useEffect, useState } from "react";

export function ParentChildProfile() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const parentId = localStorage.getItem("userId");

  const getChildProfile = async () => {
    try {
      const response = await api.get(`/schoolerp/students/parent/${parentId}`);

      console.log(response.data);

      setStudents(response.data);
    } catch (error) {
      console.error(error.response?.data || error);

      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
      } else if (error.response?.status === 404) {
        alert("No child found for this parent.");
      } else {
        alert("Failed to fetch child profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      getChildProfile();
    } else {
      alert("Please Login Again");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading child profile...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-info text-white p-4 mb-4">
        <h2 className="fw-bold">Child Profile</h2>
        <p className="mb-0">View your children's academic profile</p>
      </div>

      {students.length > 0 ? (
        students.map((student) => (
          <div className="row mb-4" key={student.studentId}>
            {/* Left Card */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-lg border-0 rounded-4 text-center p-4 h-100">
                <i
                  className="bi bi-person-circle text-primary"
                  style={{ fontSize: "90px" }}
                ></i>

                <h3 className="fw-bold mt-3">{student.fullName}</h3>

                <p className="text-muted">Student ID: {student.studentId}</p>

                <span
                  className={`badge fs-6 ${
                    student.studentStatus === "ACTIVE"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {student.studentStatus}
                </span>
              </div>
            </div>

            {/* Right Card */}
            <div className="col-lg-8">
              <div className="card shadow-lg border-0 rounded-4 p-4">
                <h4 className="text-primary mb-4">Student Details</h4>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Full Name</label>
                    <input
                      className="form-control"
                      value={student.fullName || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Admission No</label>
                    <input
                      className="form-control"
                      value={student.admissionNo || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Date of Birth</label>
                    <input
                      className="form-control"
                      value={student.dob || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Gender</label>
                    <input
                      className="form-control"
                      value={student.gender || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Academic Year</label>
                    <input
                      className="form-control"
                      value={student.academicYear || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Class</label>
                    <input
                      className="form-control"
                      value={
                        student.classes
                          ? `${student.classes.className} (${student.classes.section})`
                          : "N/A"
                      }
                      readOnly
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="fw-bold">Parent</label>
                    <input
                      className="form-control"
                      value={
                        student.parent
                          ? `${student.parent.fullName} (ID: ${student.parent.userId})`
                          : "N/A"
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card shadow border-0 rounded-4 text-center p-5">
          <h4 className="text-muted">No child profile found</h4>
        </div>
      )}
    </div>
  );
}
