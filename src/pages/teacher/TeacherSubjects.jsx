import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherSubjects() {
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");

  const teacherId = localStorage.getItem("teacherId");

  // Fetch Teacher Subjects
  const getSubjects = async () => {
    try {
      const response = await api.get(
        `/schoolerp/subjects/teacher/${teacherId}`,
      );

      setSubjects(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch subjects");
    }
  };

  useEffect(() => {
    getSubjects();
  }, []);

  // Search Filter
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      subject.subjectCode?.toLowerCase().includes(search.toLowerCase()) ||
      subject.subjectType?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-secondary">My Subjects</h2>

          <p className="text-muted mb-0">View assigned subjects</p>
        </div>

        <span className="badge bg-secondary fs-6 px-3 py-2">
          Total Subjects: {subjects.length}
        </span>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Subject Name, Code or Type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Subject Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-secondary">
                <tr>
                  <th>ID</th>
                  <th>Subject Name</th>
                  <th>Subject Code</th>
                  <th>Subject Type</th>
                  <th>Credit Hours</th>
                  <th>Elective</th>
                  <th>Class</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.subjectId}>
                      <td>{subject.subjectId}</td>

                      <td className="fw-semibold">{subject.subjectName}</td>

                      <td>{subject.subjectCode}</td>

                      <td>
                        <span className="badge bg-info text-dark">
                          {subject.subjectType}
                        </span>
                      </td>

                      <td>{subject.creditHrs}</td>

                      <td>
                        {subject.isElective ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-danger">No</span>
                        )}
                      </td>

                      <td>
                        {subject.classes?.className || "N/A"}{" "}
                        {subject.classes?.section
                          ? `(${subject.classes.section})`
                          : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No subjects found
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
