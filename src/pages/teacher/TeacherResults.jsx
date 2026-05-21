import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherResults() {
  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [selectedResultId, setSelectedResultId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [examSubjects, setExamSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const gradeOptions = [
    { grade: "A+", label: "A+ (Pass With Distinction)", point: 10 },
    { grade: "A", label: "A (Pass with First Division)", point: 9 },
    { grade: "B+", label: "B+ (Pass with Upper Second Division)", point: 8 },
    { grade: "B", label: "B (Pass with Second Division)", point: 7 },
    { grade: "C", label: "C (Pass)", point: 6 },
    { grade: "FAIL", label: "Fail", point: 0 },
  ];

  const [formData, setFormData] = useState({
    studentId: "",
    examSubId: "",
    marksObtained: "",
    grade: "",
    gradePoint: "",
    rankInClass: "",
    isAbsent: false,
    remarks: "",
  });

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

  const fetchDropdownData = async () => {
    try {
      const [classRes, studentRes, examRes] = await Promise.all([
        api.get("/schoolerp/classes/all"),
        api.get("/schoolerp/students/all"),
        api.get("/schoolerp/exam-subjects/all"),
      ]);

      setClasses(classRes.data);
      setStudents(studentRes.data);
      setExamSubjects(examRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getResults();
    fetchDropdownData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto grade point
    if (name === "grade") {
      const selectedGrade = gradeOptions.find((g) => g.grade === value);

      updatedData.gradePoint = selectedGrade?.point || "";
    }

    setFormData(updatedData);
  };

  // Add Result
  const handleAddResult = async () => {
    try {
      const payload = {
        studentId: Number(formData.studentId),
        examSubjectId: Number(formData.examSubId),
        marksObtained: Number(formData.marksObtained),
        grade: formData.grade,
        gradePoint: Number(formData.gradePoint),
        rankInClass: Number(formData.rankInClass),
        isAbsent: formData.isAbsent,
        remarks: formData.remarks,
      };

      console.log(payload);

      await api.post("/schoolerp/results/add", payload);

      alert("Result Added Successfully");

      resetForm();
      getResults();
    } catch (error) {
      console.error(error);
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Failed to add result");
    }
  };
  // Update Result
  const handleUpdateResult = async () => {
    try {
      const payload = {
        studentId: Number(formData.studentId),
        examSubjectId: Number(formData.examSubId),
        marksObtained: Number(formData.marksObtained),
        grade: formData.grade,
        gradePoint: Number(formData.gradePoint),
        rankInClass: Number(formData.rankInClass),
        isAbsent: formData.isAbsent,
        remarks: formData.remarks,
      };

      await api.put(`/schoolerp/results/update/${selectedResultId}`, payload);

      alert("Result Updated Successfully");

      resetForm();
      getResults();
    } catch (error) {
      console.error(error);
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Failed to update result");
    }
  };

  // Edit Result
  const handleEdit = (result) => {
    setEditMode(true);

    setSelectedResultId(result.resultId);

    setFormData({
      studentId: result.student?.studentId?.toString() || "",
      examSubId: result.examSubjects?.examSubId?.toString() || "",

      marksObtained: result.marksObtained?.toString() || "",

      grade: result.grade || "",

      gradePoint: result.gradePoint?.toString() || "",

      rankInClass: result.rankInClass?.toString() || "",

      isAbsent: result.isAbsent || false,

      remarks: result.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedResultId(null);

    setFormData({
      studentId: "",
      examSubId: "",
      marksObtained: "",
      grade: "",
      gradePoint: "",
      rankInClass: "",
      isAbsent: false,
      remarks: "",
    });
  };
  // Search Filter
  const filteredResults = results.filter((result) => {
    const studentName = result.student?.fullName?.toLowerCase() || "";

    const grade = result.grade?.toLowerCase() || "";

    const className = result.student?.classes?.className || "";

    const matchesSearch =
      studentName.includes(search.toLowerCase()) ||
      grade.includes(search.toLowerCase());

    const matchesClass = !selectedClass || className === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-danger">Results Management</h2>

          <p className="text-muted mb-0">Add & Manage Student Results</p>
        </div>

        <span className="badge bg-danger fs-6 px-3 py-2">
          Total Results: {results.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 border-0 p-4 mb-4">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Result" : "Add Result"}
        </h4>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Student ID</label>

            <select
              className="form-select"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId} - {student.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Exam Subject ID</label>

            <select
              className="form-select"
              name="examSubId"
              value={formData.examSubId}
              onChange={handleChange}
            >
              <option value="">Select Exam Subject</option>

              {examSubjects.map((examSubject) => (
                <option
                  key={examSubject.examSubId}
                  value={examSubject.examSubId}
                >
                  {examSubject.subjects?.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Marks</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Marks"
              name="marksObtained"
              value={formData.marksObtained}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Grade</label>

            <select
              className="form-select"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            >
              <option value="">Select Grade</option>

              {gradeOptions.map((g) => (
                <option key={g.grade} value={g.grade}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Grade Point</label>

            <input
              type="number"
              className="form-control"
              name="gradePoint"
              value={formData.gradePoint}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Rank</label>

            <input
              type="number"
              className="form-control"
              placeholder="Rank"
              name="rankInClass"
              value={formData.rankInClass}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-semibold">Remarks</label>

            <textarea
              rows="2"
              className="form-control"
              placeholder="Enter Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isAbsent"
                checked={formData.isAbsent}
                onChange={handleChange}
              />

              <label className="form-check-label">Student Absent</label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-2">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateResult}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-danger" onClick={handleAddResult}>
                Add Result
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Filter By Class</option>

            {classes.map((cls) => (
              <option key={cls.classId} value={cls.className}>
                {cls.className}-{cls.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-danger">
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <tr key={result.resultId}>
                      <td>{result.resultId}</td>

                      <td>{result.student?.fullName || "N/A"}</td>

                      <td>
                        {result.examSubjects?.subjects?.subjectName || "N/A"}
                      </td>

                      <td>{result.marksObtained}</td>

                      <td>{result.grade}</td>

                      <td>{result.rankInClass}</td>

                      <td>
                        {result.isAbsent ? (
                          <span className="badge bg-danger">Absent</span>
                        ) : (
                          <span className="badge bg-success">Present</span>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(result)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-muted py-4">
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
