import api from "../../routers/api";

import { useEffect, useState } from "react";

export function SubjectsCRUD() {
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    subjectType: "CORE",
    creditHrs: "",
    isElective: false,
    classId: "",
    teacherId: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

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
    getSubjects();
    getClasses();
    getTeachers();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add Subject
  const handleAddSubject = async () => {
    try {
      await api.post("/schoolerp/subjects/add", formData);

      alert("Subject Added Successfully");

      resetForm();
      getSubjects();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Subject");
    }
  };

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

  // Get All Teachers
  const getTeachers = async () => {
    try {
      const response = await api.get("/schoolerp/teachers/all");

      setTeachers(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch teachers");
    }
  };

  // Update Subject
  const handleUpdateSubject = async () => {
    try {
      await api.put(
        `/schoolerp/subjects/update/${selectedSubjectId}`,
        formData,
      );

      alert("Subject Updated Successfully");

      resetForm();
      getSubjects();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Subject");
    }
  };

  // Delete Subject
  const handleDelete = async (subjectId) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this subject?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/subjects/delete/${subjectId}`);

      alert("Subject Deleted Successfully");

      getSubjects();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Subject
  const handleEdit = (subject) => {
    setEditMode(true);

    setSelectedSubjectId(subject.subjectId);

    setFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      subjectType: subject.subjectType,
      creditHrs: subject.creditHrs,
      isElective: subject.isElective,
      classId: subject.classes?.classId || "",
      teacherId: subject.teacher?.teacherId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedSubjectId(null);

    setFormData({
      subjectName: "",
      subjectCode: "",
      subjectType: "CORE",
      creditHrs: "",
      isElective: false,
      classId: "",
      teacherId: "",
    });
  };

  // Search Filter
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      subject.subjectCode?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Subjects Management</h2>

        <span className="badge bg-dark fs-6">
          Total Subjects: {subjects.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Subject" : "Add Subject"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Subject Name</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Subject Name"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Subject Code</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Subject Code"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Subject Type</label>

            <select
              className="form-select"
              name="subjectType"
              value={formData.subjectType}
              onChange={handleChange}
            >
              <option value="CORE">CORE</option>

              <option value="ELECTIVE">ELECTIVE</option>

              <option value="PRACTICAL">PRACTICAL</option>

              <option value="THEORY">THEORY</option>

              <option value="LANGUAGE">LANGUAGE</option>

              <option value="VOCATIONAL">VOCATIONAL</option>

              <option value="CO_CURRICULAR">CO_CURRICULAR</option>

              <option value="EXTRA_CURRICULAR">EXTRA_CURRICULAR</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Credit Hours</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Credit Hours"
              name="creditHrs"
              value={formData.creditHrs}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
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

          <div className="col-md-3 mb-3">
            <label>Select Teacher</label>

            <select
              className="form-select"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.teacherId}
                  {" - "}
                  {teacher.fullName}
                  {" ("}
                  {teacher.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isElective"
                checked={formData.isElective}
                onChange={handleChange}
              />

              <label className="form-check-label">Elective Subject</label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateSubject}
                >
                  Update Subject
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddSubject}>
                Add Subject
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Subject Name or Subject Code..."
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
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Credits</th>
                <th>Elective</th>
                <th>Class ID</th>
                <th>Teacher ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.subjectId}>
                  <td>{subject.subjectId}</td>

                  <td>{subject.subjectName}</td>

                  <td>{subject.subjectCode}</td>

                  <td>{subject.subjectType}</td>

                  <td>{subject.creditHrs}</td>

                  <td>{subject.isElective ? "Yes" : "No"}</td>

                  <td>{subject.classes?.classId || "N/A"}</td>

                  <td>{subject.teacher?.teacherId || "N/A"}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(subject)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(subject.subjectId)}
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
