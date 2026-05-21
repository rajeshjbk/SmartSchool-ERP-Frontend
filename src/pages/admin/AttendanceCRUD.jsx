import { useEffect, useState } from "react";
import api from "../../routers/api";

export function AttendanceCRUD() {
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    attendanceStatus: "PRESENT",
    remarks: "",
    markedBy: "",
    classId: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);

  // Get All Attendance
  const getAttendance = async () => {
    try {
      const response = await api.get("/schoolerp/attendance/all");

      setAttendance(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    getAttendance();
    getStudents();
    getTeachers();
    getClasses();
  }, []);

  // Get Students
  const getStudents = async () => {
    try {
      const response = await api.get("/schoolerp/students/all");

      setStudents(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    }
  };

  // Get Teachers
  const getTeachers = async () => {
    try {
      const response = await api.get("/schoolerp/teachers/all");

      setTeachers(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch teachers");
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
  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Attendance
  const handleAddAttendance = async () => {
    try {
      await api.post("/schoolerp/attendance/mark", formData);

      alert("Attendance Added Successfully");

      resetForm();
      getAttendance();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Attendance");
    }
  };

  // Update Attendance
  const handleUpdateAttendance = async () => {
    try {
      await api.put(
        `/schoolerp/attendance/update/${selectedAttendanceId}`,
        formData,
      );

      alert("Attendance Updated Successfully");

      resetForm();
      getAttendance();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Attendance");
    }
  };

  // Delete Attendance
  const handleDelete = async (attendanceId) => {
    const confirmDelete = window.confirm("Are you sure to delete attendance?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/attendance/delete/${attendanceId}`);

      alert("Attendance Deleted Successfully");

      getAttendance();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Attendance
  const handleEdit = (item) => {
    setEditMode(true);

    setSelectedAttendanceId(item.attendanceId);

    setFormData({
      studentId: item.students?.studentId || "",
      attendanceStatus: item.attendanceStatus,
      remarks: item.remarks,
      markedBy: item.user?.userId || "",
      classId: item.classes?.classId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedAttendanceId(null);

    setFormData({
      studentId: "",
      attendanceStatus: "PRESENT",
      remarks: "",
      markedBy: "",
      classId: "",
    });
  };

  // Search Filter
  const filteredAttendance = attendance.filter(
    (item) =>
      item.students?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.attendanceStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Attendance Management</h2>

        <span className="badge bg-dark fs-6">
          Total Records: {attendance.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Attendance" : "Add Attendance"}
        </h4>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label>Student</label>

            <select
              className="form-select"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId}
                  {" - "}
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Attendance Status</label>

            <select
              className="form-select"
              name="attendanceStatus"
              value={formData.attendanceStatus}
              onChange={handleChange}
            >
              <option value="PRESENT">PRESENT</option>

              <option value="ABSENT">ABSENT</option>

              <option value="LEAVE">LEAVE</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Marked By</label>

            <select
              className="form-select"
              name="markedBy"
              value={formData.markedBy}
              onChange={handleChange}
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.user?.userId}>
                  {teacher.teacherId}
                  {" - "}
                  {teacher.user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Class</label>

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

          <div className="col-md-12 mb-3">
            <label>Remarks</label>

            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateAttendance}
                >
                  Update Attendance
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddAttendance}>
                Add Attendance
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Student Name or Status..."
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
                <th>Student Name</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Marked By</th>
                <th>Class ID</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map((item) => (
                <tr key={item.attendanceId}>
                  <td>{item.attendanceId}</td>

                  <td>{item.students?.fullName || "N/A"}</td>

                  <td>
                    <span
                      className={`badge ${
                        item.attendanceStatus === "PRESENT"
                          ? "bg-success"
                          : item.attendanceStatus === "ABSENT"
                            ? "bg-danger"
                            : "bg-warning"
                      }`}
                    >
                      {item.attendanceStatus}
                    </span>
                  </td>

                  <td>{item.remarks}</td>

                  <td>{item.user?.userId || "N/A"}</td>

                  <td>{item.classes?.classId || "N/A"}</td>

                  <td>{item.date}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.attendanceId)}
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
