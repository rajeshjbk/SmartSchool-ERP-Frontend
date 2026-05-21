import api from "../../routers/api";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ParentResults() {
  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");

  const parentId = localStorage.getItem("userId");

  // Fetch Child Results
  const getResults = async () => {
    try {
      const response = await api.get(
        `http://localhost:8080/schoolerp/results/parent/${parentId}`,
      );

      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch results");
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  // Search Filter
  const filteredResults = results.filter(
    (result) =>
      result.subject?.subjectName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      result.exam?.examName?.toLowerCase().includes(search.toLowerCase()) ||
      result.grade?.toLowerCase().includes(search.toLowerCase()),
  );

  // Statistics
  const totalMarks = results.reduce(
    (sum, result) => sum + (result.marksObtained || 0),
    0,
  );

  const maxMarks = results.reduce(
    (sum, result) => sum + (result.examSubjects?.maxMarks || 100),
    0,
  );

  const percentage =
    maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

  const passedSubjects = results.filter(
    (r) => r.resultStatus === "PASS",
  ).length;

  const downloadResultsPDF = () => {
    const doc = new jsPDF();

    // Get student details from first result
    const student = filteredResults[0]?.student;

    // Title
    doc.setFontSize(18);
    doc.text("Student Result Report", 14, 20);

    // Generated Date
    doc.setFontSize(11);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 30);

    // Student Details
    doc.setFontSize(14);
    doc.text("Student Details", 14, 42);

    doc.setFontSize(11);

    doc.text(`Student Name: ${student?.fullName || "N/A"}`, 14, 52);

    doc.text(`Admission No: ${student?.admissionNo || "N/A"}`, 14, 60);

    doc.text(`Academic Year: ${student?.academicYear || "N/A"}`, 14, 68);

    doc.text(
      `Class: ${
        student?.classes
          ? `${student.classes.className}-${student.classes.section}`
          : "N/A"
      }`,
      14,
      76,
    );

    doc.text(`Parent Name: ${student?.parent?.fullName || "N/A"}`, 110, 52);

    doc.text(`Gender: ${student?.gender || "N/A"}`, 110, 60);

    doc.text(`Date of Birth: ${student?.dob || "N/A"}`, 110, 68);

    // Results Table
    autoTable(doc, {
      startY: 90,

      head: [
        [
          "ID",
          "Subject",
          "Exam",
          "Marks",
          "Total",
          "Grade",
          "Percentage",
          "Status",
        ],
      ],

      body: filteredResults.map((result) => [
        result.resultId,

        result.examSubjects?.subjects?.subjectName || "N/A",

        result.examSubjects?.exam?.examName || "N/A",

        result.marksObtained,

        result.examSubjects?.maxMarks || 100,

        result.grade,

        (
          (result.marksObtained / (result.examSubjects?.maxMarks || 100)) *
          100
        ).toFixed(2) + "%",

        result.resultStatus || "PASS",
      ]),
    });

    doc.save(`${student?.fullName || "Student"}_Result_Report.pdf`);
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-danger text-white p-4 mb-4">
        <h2 className="fw-bold">Child Results</h2>

        <p className="mb-0">Monitor your child's academic performance</p>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-primary text-white text-center p-4">
            <h2>{results.length}</h2>
            <h5>Subjects</h5>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-success text-white text-center p-4">
            <h2>{passedSubjects}</h2>
            <h5>Passed</h5>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-warning text-dark text-center p-4">
            <h2>{percentage}%</h2>
            <h5>Percentage</h5>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-info text-white text-center p-4">
            <h2>
              {totalMarks}/{maxMarks}
            </h2>
            <h5>Total Marks</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by subject, exam or grade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-danger">Result Records</h4>

            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={downloadResultsPDF}>
                Download PDF
              </button>

              <span className="badge bg-danger fs-6">
                Total Results: {results.length}
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-danger">
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => {
                    const obtained = result.marksObtained || 0;
                    const total = result.totalMarks || 100;

                    const percent =
                      total > 0 ? ((obtained / total) * 100).toFixed(2) : 0;

                    return (
                      <tr key={result.resultId}>
                        <td>{result.resultId}</td>

                        <td>
                          {result.examSubjects?.subjects?.subjectName || "N/A"}
                        </td>

                        <td>{result.examSubjects?.exam?.examName || "N/A"}</td>

                        <td>{result.marksObtained}</td>

                        <td>{result.examSubjects?.maxMarks || 100}</td>

                        <td>
                          <span className="badge bg-primary">
                            {result.grade}
                          </span>
                        </td>

                        <td>
                          {(
                            (result.marksObtained /
                              (result.examSubjects?.maxMarks || 100)) *
                            100
                          ).toFixed(2)}
                          %
                        </td>

                        <td>
                          <span className="badge bg-success">PASS</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-muted py-4">
                      No result records found
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
