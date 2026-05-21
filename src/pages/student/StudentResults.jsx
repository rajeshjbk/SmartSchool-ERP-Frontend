import api from "../../routers/api";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function StudentResults() {
  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");

  const downloadResultPDF = () => {
    const doc = new jsPDF();

    // Student Details
    const studentName = results[0]?.student?.fullName || "Student Name";

    const admissionNo = results[0]?.student?.admissionNo || "N/A";

    const academicYear = results[0]?.student?.academicYear || "N/A";

    // Title
    doc.setFontSize(20);
    doc.text("SMART SCHOOL ERP", 70, 15);

    doc.setFontSize(16);
    doc.text("Student Result Report", 70, 25);

    // Student Info
    doc.setFontSize(12);

    doc.text(`Student Name: ${studentName}`, 14, 40);
    doc.text(`Admission No: ${admissionNo}`, 14, 48);
    doc.text(`Academic Year: ${academicYear}`, 14, 56);

    // Table Data
    const tableData = results.map((result, index) => [
      index + 1,
      result.examSubjects?.exam?.examName || "N/A",
      result.examSubjects?.subjects?.subjectName || "N/A",
      result.marksObtained || 0,
      result.grade || "N/A",
      result.gradePoint || 0,
      result.rankInClass || "N/A",
      result.isAbsent ? "ABSENT" : "PRESENT",
      result.remarks || "N/A",
    ]);

    autoTable(doc, {
      startY: 65,
      head: [
        [
          "S.No",
          "Exam",
          "Subject",
          "Marks",
          "Grade",
          "Grade Point",
          "Rank",
          "Status",
          "Remarks",
        ],
      ],
      body: tableData,
    });

    // Summary
    const totalMarks = results.reduce(
      (sum, item) => sum + (item.marksObtained || 0),
      0,
    );

    const percentage =
      results.length > 0 ? (totalMarks / results.length).toFixed(2) : 0;

    const finalY = doc.lastAutoTable.finalY + 15;

    doc.text(`Total Subjects: ${results.length}`, 14, finalY);

    doc.text(`Total Marks: ${totalMarks}`, 14, finalY + 8);

    doc.text(`Percentage: ${percentage}%`, 14, finalY + 16);

    doc.text(`Best Grade: ${topGrade}`, 14, finalY + 24);

    // Download
    doc.save(`${studentName}_Result.pdf`);
  };

  // Fetch Results
  const getResults = async () => {
    try {
      const response = await api.get("/schoolerp/results/my-result");

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
      result.examSubjects?.subjects?.subjectName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      result.grade?.toLowerCase().includes(search.toLowerCase()) ||
      result.examSubjects?.exam?.examName
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  );

  // Summary
  const totalSubjects = results.length;

  const averageMarks =
    results.length > 0
      ? (
          results.reduce(
            (sum, result) => sum + (result.marksObtained || 0),
            0,
          ) / results.length
        ).toFixed(2)
      : 0;

  const topGrade =
    results.length > 0
      ? results.reduce((prev, current) =>
          prev.gradePoint > current.gradePoint ? prev : current,
        ).grade
      : "N/A";

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-danger text-white p-4 mb-4">
        <h2 className="fw-bold">My Results</h2>

        <p className="mb-0">View your exam performance and grades</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-primary text-white">
            <h3>{totalSubjects}</h3>
            <h5>Subjects</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-success text-white">
            <h3>{averageMarks}%</h3>
            <h5>Average Marks</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-warning text-dark">
            <h3>{topGrade}</h3>
            <h5>Best Grade</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Subject, Grade or Exam Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-danger">Result Records</h4>

            <div>
              <button
                className="btn btn-success me-2"
                onClick={downloadResultPDF}
              >
                Download Result PDF
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
                  <th>Exam</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <tr key={result.resultId}>
                      <td>{result.resultId}</td>

                      <td>{result.examSubjects?.exam?.examName || "N/A"}</td>

                      <td>
                        {result.examSubjects?.subjects?.subjectName || "N/A"}
                      </td>

                      <td>{result.marksObtained}</td>

                      <td>
                        <span className="badge bg-primary">{result.grade}</span>
                      </td>

                      <td>{result.gradePoint}</td>

                      <td>{result.rankInClass || "N/A"}</td>

                      <td>
                        <span
                          className={`badge ${
                            result.isAbsent ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {result.isAbsent ? "ABSENT" : "PRESENT"}
                        </span>
                      </td>

                      <td>{result.remarks || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-muted py-4">
                      No results found
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
