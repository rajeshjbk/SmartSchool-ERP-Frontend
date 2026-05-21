import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherStudents() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  // Get Students
  const getStudents = async () => {
    try {
      const response = await api.get("/schoolerp/students/all");

      setStudents(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Search Filter
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      student.admissionNo?.toLowerCase().includes(search.toLowerCase()) ||
      student.academicYear?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-success">Students Management</h2>

          <p className="text-muted mb-0">View all assigned students</p>
        </div>

        <span className="badge bg-success fs-6 px-3 py-2">
          Total Students: {students.length}
        </span>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Name, Admission No or Academic Year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Students Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Admission No</th>
                  <th>Full Name</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                  <th>Class ID</th>
                  <th>Parent ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>

                      <td>{student.admissionNo}</td>

                      <td className="fw-semibold">{student.fullName}</td>

                      <td>{student.dob}</td>

                      <td>{student.gender}</td>

                      <td>{student.academicYear}</td>

                      <td>
                        <span
                          className={`badge ${
                            student.studentStatus === "ACTIVE"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {student.studentStatus}
                        </span>
                      </td>

                      <td>{student.classes?.classId || "N/A"}</td>

                      <td>{student?.parent?.parentId || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-muted py-4">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
