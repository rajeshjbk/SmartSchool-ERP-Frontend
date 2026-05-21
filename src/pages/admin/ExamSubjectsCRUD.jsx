import api from "../../routers/api";
import { useEffect, useState } from "react";

export function ExamSubjectsCRUD() {
  const [examSubjects, setExamSubjects] = useState([]);

  const [search, setSearch] = useState("");
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    examId: "",
    subjectId: "",
    examDate: "",
    durationMin: "",
    maxMarks: "",
    passMarks: "",
    startTime: "",
    roomNo: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedExamSubId, setSelectedExamSubId] = useState(null);

  // Get All Exam Subjects
  const getExamSubjects = async () => {
    try {
      const response = await api.get("/schoolerp/exam-subjects/all");

      setExamSubjects(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch exam subjects");
    }
  };

  // Get Classes
  const getClasses = async () => {
    try {
      const response = await api.get("/schoolerp/classes/all");

      setClasses(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch classes");
    }
  };
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

  // Get All Subjects
  const getSubjects = async () => {
    try {
      const response = await api.get("/schoolerp/subjects/all");

      setSubjects(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch subjects");
    }
  };

  useEffect(() => {
    getExamSubjects();
    getExams();
    getSubjects();
    getClasses();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,

      [name]: name === "examId" || name === "subjectId" ? Number(value) : value,
    });
  };
  // Add Exam Subject
  const handleAddExamSubject = async () => {
    try {
      await api.post("/schoolerp/exam-subjects/add", formData);

      alert("Exam Subject Added Successfully");

      resetForm();
      getExamSubjects();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Exam Subject");
    }
  };

  // Update Exam Subject
  const handleUpdateExamSubject = async () => {
    try {
      await api.put(
        `/schoolerp/exam-subjects/update/${selectedExamSubId}`,
        formData,
      );

      alert("Exam Subject Updated Successfully");

      resetForm();
      getExamSubjects();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Exam Subject");
    }
  };

  // Delete Exam Subject
  const handleDelete = async (examSubId) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this exam subject?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/exam-subjects/delete/${examSubId}`);

      alert("Exam Subject Deleted Successfully");

      getExamSubjects();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Exam Subject
  const handleEdit = (examSub) => {
    setEditMode(true);

    setSelectedExamSubId(examSub.examSubId);

    setFormData({
      examId: examSub.exam?.examId || "",
      subjectId: examSub.subjects?.subjectId || "",
      examDate: examSub.examDate,
      durationMin: examSub.durationMin,
      maxMarks: examSub.maxMarks,
      passMarks: examSub.passMarks,
      startTime: examSub.startTime,
      roomNo: examSub.roomNo,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedExamSubId(null);

    setFormData({
      examId: "",
      subjectId: "",
      examDate: "",
      durationMin: "",
      maxMarks: "",
      passMarks: "",
      startTime: "",
      roomNo: "",
    });
  };

  // Search Filter
  const filteredExamSubjects = examSubjects.filter(
    (item) =>
      item.subjects?.subjectName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.roomNo?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Exam Subjects Management</h2>

        <span className="badge bg-dark fs-6">
          Total Records: {examSubjects.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Exam Subject" : "Add Exam Subject"}
        </h4>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label>Select Exam</label>

            <select
              className="form-select"
              name="examId"
              value={formData.examId}
              onChange={handleChange}
            >
              <option value="">Select Exam</option>

              {exams.map((exam) => (
                <option key={exam.examId} value={exam.examId}>
                  {exam.examId}
                  {" - "}
                  {exam.examName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Select Subject</label>

            <select
              className="form-select"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>

              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectId}
                  {" - "}
                  {subject.subjectName}
                  {" ("}
                  {subject.subjectCode})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Exam Date</label>

            <input
              type="date"
              className="form-control"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Duration (Minutes)</label>

            <input
              type="number"
              className="form-control"
              placeholder="Ex: 90"
              name="durationMin"
              value={formData.durationMin}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Max Marks</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Max Marks"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Pass Marks</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Pass Marks"
              name="passMarks"
              value={formData.passMarks}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Start Time</label>

            <input
              type="time"
              className="form-control"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Room No</label>

            <select
              className="form-select"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
            >
              <option value="">Select Room</option>

              {[
                ...new Map(classes.map((cls) => [cls.roomNo, cls])).values(),
              ].map((cls) => (
                <option key={cls.classId} value={cls.roomNo}>
                  Room {cls.roomNo}
                  {" - "}
                  {cls.className}
                  {" ("}
                  {cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateExamSubject}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleAddExamSubject}
              >
                Add Exam Subject
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Subject Name or Room..."
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
                <th>Exam ID</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Max Marks</th>
                <th>Pass Marks</th>
                <th>Time</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExamSubjects.map((item) => (
                <tr key={item.examSubId}>
                  <td>{item.examSubId}</td>

                  <td>{item.exam?.examId || "N/A"}</td>

                  <td>{item.subjects?.subjectName || "N/A"}</td>

                  <td>{item.examDate}</td>

                  <td>{item.durationMin} mins</td>

                  <td>{item.maxMarks}</td>

                  <td>{item.passMarks}</td>

                  <td>{item.startTime}</td>

                  <td>{item.roomNo}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.examSubId)}
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
