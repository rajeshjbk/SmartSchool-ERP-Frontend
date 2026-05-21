import api from "../../routers/api";

import { useEffect, useState } from "react";

export function StudentSubjects() {
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");

  // Fetch Subjects
  const getSubjects = async () => {
    try {
      const response = await api.get(
        "/schoolerp/subjects/my-subjects",
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
      subject.subjectType?.toLowerCase().includes(search.toLowerCase()) ||
      subject.teacher?.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-info text-white p-4 mb-4">
        <h2 className="fw-bold">My Subjects</h2>

        <p className="mb-0">View enrolled subjects and teacher details</p>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-primary text-white">
            <h3>{subjects.length}</h3>
            <h5>Total Subjects</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-success text-white">
            <h3>{subjects.filter((s) => s.isElective === false).length}</h3>
            <h5>Core Subjects</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-warning text-dark">
            <h3>{subjects.filter((s) => s.isElective === true).length}</h3>
            <h5>Electives</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by subject, code, type or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Subject Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-info">Subject Details</h4>

            <span className="badge bg-info fs-6">
              Total Subjects: {subjects.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-info">
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Credit Hours</th>
                  <th>Teacher</th>
                  <th>Elective</th>
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
                        <span className="badge bg-primary">
                          {subject.subjectType}
                        </span>
                      </td>

                      <td>{subject.creditHrs}</td>

                      <td>{subject.teacher?.user?.fullName || "N/A"}</td>

                      <td>
                        {subject.isElective ? (
                          <span className="badge bg-warning text-dark">
                            Yes
                          </span>
                        ) : (
                          <span className="badge bg-success">No</span>
                        )}
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
