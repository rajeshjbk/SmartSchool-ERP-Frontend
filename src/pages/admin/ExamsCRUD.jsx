import api from "../../routers/api";
import { useEffect, useState } from "react";

export function ExamsCRUD() {
  const [exams, setExams] = useState([]);

  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    examName: "",
    classId: "",
    academicYear: "",
    startDate: "",
    endDate: "",
    resultDate: "",
    examStatus: "SCHEDULED",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedExamId, setSelectedExamId] = useState(null);

  // Get All Exams
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
    getClasses();
  }, []);

  // Get All Classes
  const getClasses = async () => {
    try {
      const response = await api.get("/schoolerp/classes/all");

      setClasses(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch classes");
    }
  };
  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,

      [name]: name === "classId" ? Number(value) : value,
    });
  };

  // Add Exam
  const handleAddExam = async () => {
    try {
      await api.post("/schoolerp/exams/add", formData);

      alert("Exam Added Successfully");

      resetForm();
      getExams();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Exam");
    }
  };

  // Update Exam
  const handleUpdateExam = async () => {
    try {
      await api.put(`/schoolerp/exams/update/${selectedExamId}`, formData);

      alert("Exam Updated Successfully");

      resetForm();
      getExams();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Exam");
    }
  };

  // Delete Exam
  const handleDelete = async (examId) => {
    const confirmDelete = window.confirm("Are you sure to delete this exam?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/exams/delete/${examId}`);

      alert("Exam Deleted Successfully");

      getExams();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Exam
  const handleEdit = (exam) => {
    setEditMode(true);

    setSelectedExamId(exam.examId);

    setFormData({
      examName: exam.examName,
      classId: exam.classes?.classId || "",
      academicYear: exam.academicYear,
      startDate: exam.startDate,
      endDate: exam.endDate,
      resultDate: exam.resultDate,
      examStatus: exam.examStatus,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedExamId(null);

    setFormData({
      examName: "",
      classId: "",
      academicYear: "",
      endDate: "",
      resultDate: "",
      examStatus: "UPCOMING",
    });
  };

  // Search Filter
  const filteredExams = exams.filter(
    (exam) =>
      exam.examName?.toLowerCase().includes(search.toLowerCase()) ||
      exam.examStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Exams Management</h2>

        <span className="badge bg-dark fs-6">Total Exams: {exams.length}</span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Exam" : "Add Exam"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Exam Name</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Exam Name"
              name="examName"
              value={formData.examName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Select Class</label>

            <select
              className="form-select"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.classId}
                  {" - "}
                  {cls.className}
                  {" ("}
                  {cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Academic Year</label>

            <input
              type="text"
              className="form-control"
              placeholder="Ex: 2025-2026"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Start Date</label>

            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>End Date</label>

            <input
              type="date"
              className="form-control"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Result Date</label>

            <input
              type="date"
              className="form-control"
              name="resultDate"
              value={formData.resultDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Exam Status</label>

            <select
              className="form-select"
              name="examStatus"
              value={formData.examStatus}
              onChange={handleChange}
            >
              <option value="SCHEDULED">SCHEDULED</option>

              <option value="ONGOING">ONGOING</option>

              <option value="COMPLETED">COMPLETED</option>

              <option value="CANCELLED">CANCELLED</option>

              <option value="RESULT_DECLARED">RESULT_DECLARED</option>
            </select>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button className="btn btn-warning" onClick={handleUpdateExam}>
                  Update Exam
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddExam}>
                Add Exam
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Exam Name or Status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="card shadow rounded-4 p-3">
        <div className="table-responsive">
          <table className="table table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Exam Name</th>
                <th>Class ID</th>
                <th>Academic Year</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Result Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.examId}>
                  <td>{exam.examId}</td>

                  <td>{exam.examName}</td>

                  <td>{exam.classes?.classId || "N/A"}</td>

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
                            ? "bg-warning"
                            : exam.examStatus === "CANCELLED"
                              ? "bg-danger"
                              : "bg-primary"
                      }`}
                    >
                      {exam.examStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(exam)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(exam.examId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
