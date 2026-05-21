import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherExams() {
  const [exams, setExams] = useState([]);

  const [search, setSearch] = useState("");

  // Fetch Exams
  const getExams = async () => {
    try {
      const response = await api.get("/schoolerp/exams/all");

      setExams(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch exams");
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  // Search Filter
  const filteredExams = exams.filter(
    (exam) =>
      exam.examName?.toLowerCase().includes(search.toLowerCase()) ||
      exam.academicYear?.toLowerCase().includes(search.toLowerCase()) ||
      exam.examStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Exams Schedule</h2>

          <p className="text-muted mb-0">View all exam schedules</p>
        </div>

        <span className="badge bg-dark fs-6 px-3 py-2">
          Total Exams: {exams.length}
        </span>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Exam Name, Academic Year or Status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Exams Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Exam Name</th>
                  <th>Class</th>
                  <th>Academic Year</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Result Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <tr key={exam.examId}>
                      <td>{exam.examId}</td>

                      <td className="fw-semibold">{exam.examName}</td>

                      <td>
                        {exam.classes?.className || "N/A"}{" "}
                        {exam.classes?.section
                          ? `(${exam.classes.section})`
                          : ""}
                      </td>

                      <td>{exam.academicYear}</td>
                      <td>{exam.startDate}</td>
                      <td>{exam.endDate}</td>

                      <td>{exam.resultDate}</td>

                      <td>
                        <span
                          className={`badge ${
                            exam.examStatus === "COMPLETED"
                              ? "bg-success"
                              : exam.examStatus === "ONGOING"
                                ? "bg-warning text-dark"
                                : "bg-primary"
                          }`}
                        >
                          {exam.examStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No exams found
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
