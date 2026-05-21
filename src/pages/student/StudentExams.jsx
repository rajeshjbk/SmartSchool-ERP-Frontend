import api from "../../routers/api";
import { useEffect, useState } from "react";

export function StudentExams() {
  const [exams, setExams] = useState([]);

  const [search, setSearch] = useState("");

  // Fetch Exams
  const getExams = async () => {
    try {
      const response = await api.get("/schoolerp/exams/my-exams");

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
      exam.examStatus?.toLowerCase().includes(search.toLowerCase()) ||
      exam.academicYear?.toLowerCase().includes(search.toLowerCase()),
  );

  // Summary
  const upcomingExams = exams.filter(
    (exam) => exam.examStatus === "UPCOMING",
  ).length;

  const completedExams = exams.filter(
    (exam) => exam.examStatus === "COMPLETED",
  ).length;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-dark text-white p-4 mb-4">
        <h2 className="fw-bold">My Exams</h2>

        <p className="mb-0">View exam schedules and status</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-primary text-white">
            <h3>{exams.length}</h3>
            <h5>Total Exams</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-warning text-dark">
            <h3>{upcomingExams}</h3>
            <h5>Upcoming</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-success text-white">
            <h3>{completedExams}</h3>
            <h5>Completed</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by exam name, status or academic year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Exams Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-dark">Exam Schedule</h4>

            <span className="badge bg-dark fs-6">
              Total Exams: {exams.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Exam Name</th>
                  <th>Academic Year</th>
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

                      <td>{exam.academicYear}</td>

                      <td>{exam.endDate}</td>

                      <td>{exam.resultDate}</td>

                      <td>
                        <span
                          className={`badge ${
                            exam.examStatus === "COMPLETED"
                              ? "bg-success"
                              : exam.examStatus === "UPCOMING"
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
                    <td colSpan="6" className="text-muted py-4">
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
