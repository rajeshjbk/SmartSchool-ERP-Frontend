import api from "../../routers/api";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ResultsCRUD() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("userRole");

  // Admin Only Access
  useEffect(() => {
    if (role !== "ROLE_ADMIN") {
      alert("Access Denied! Admin Only");
      navigate("/login");
      return;
    }

    getResults();
  }, []);

  // Fetch Results
  const getResults = async () => {
    try {
      const response = await api.get("/schoolerp/results/all");

      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch results");
    }
  };

  // Search + Class Wise + Rank Wise Sorting
  const filteredResults = results
    .filter(
      (result) =>
        result.student?.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        result.grade?.toLowerCase().includes(search.toLowerCase()) ||
        result.student?.classes?.className
          ?.toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const classA = `${a.student?.classes?.className || ""}-${
        a.student?.classes?.section || ""
      }`;

      const classB = `${b.student?.classes?.className || ""}-${
        b.student?.classes?.section || ""
      }`;

      // Sort by Class
      const classCompare = classA.localeCompare(classB);

      if (classCompare !== 0) {
        return classCompare;
      }

      // Sort by Rank Ascending
      return (a.rankInClass || 9999) - (b.rankInClass || 9999);
    });

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Results Management</h2>

        <span className="badge bg-dark fs-6">
          Total Results:
          {results.length}
        </span>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4 shadow-sm"
        placeholder="Search by Student, Class or Grade..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Results Table */}
      <div className="card shadow rounded-4 p-3">
        <div className="table-responsive">
          <table className="table table-hover table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Class</th>
                <th>Exam Subject</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Rank</th>
                <th>Absent</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted fw-bold">
                    No Results Found
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result.resultId}>
                    {/* ID */}
                    <td>{result.resultId}</td>

                    {/* Student */}
                    <td className="fw-semibold">
                      {result.student?.fullName || "N/A"}
                    </td>

                    {/* Class */}
                    <td>
                      {result.student?.classes
                        ? `${result.student.classes.className} (${result.student.classes.section})`
                        : "N/A"}
                    </td>

                    {/* Exam Subject */}
                    <td>
                      {result.examSubjects ? (
                        <>
                          <div className="fw-semibold">
                            {result.examSubjects?.exam?.examName}
                          </div>

                          <small className="text-muted">
                            {result.examSubjects?.subjects?.subjectName}
                          </small>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* Marks */}
                    <td>{result.marksObtained}</td>

                    {/* Grade */}
                    <td>
                      <span className="badge bg-success">{result.grade}</span>
                    </td>

                    {/* Grade Point */}
                    <td>{result.gradePoint}</td>

                    {/* Rank */}
                    <td>
                      <span className="badge bg-primary">
                        #{result.rankInClass}
                      </span>
                    </td>

                    {/* Absent */}
                    <td>
                      {result.isAbsent ? (
                        <span className="badge bg-danger">Yes</span>
                      ) : (
                        <span className="badge bg-success">No</span>
                      )}
                    </td>

                    {/* Remarks */}
                    <td>{result.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
