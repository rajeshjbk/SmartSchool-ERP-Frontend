import { useEffect, useState } from "react";

import api from "../../routers/api";

export function TeacherAttendance() {
  const [attendanceList, setAttendanceList] = useState([]);

  const [search, setSearch] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    attendanceStatus: "PRESENT",
    remarks: "",
    markedBy: localStorage.getItem("userId") || "",
    classId: "",
  });

  // Fetch Attendance
  const getAttendance = async () => {
    try {
      const response = await api.get("/schoolerp/attendance/all");

      setAttendanceList(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
  };
  const getStudents = async () => {
    try {
      const response = await api.get("/schoolerp/students/all");

      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getClasses = async () => {
    try {
      const response = await api.get("/schoolerp/classes/all");

      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAttendance();
    getStudents();
    getClasses();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Attendance
  const handleAddAttendance = async () => {
    try {
      const payload = {
        studentId: Number(formData.studentId),
        attendanceStatus: formData.attendanceStatus,
        remarks: formData.remarks,
        markedBy: Number(localStorage.getItem("userId")),
        classId: Number(formData.classId),
      };

      await api.post("/attendance/mark", payload);

      alert("Attendance Marked Successfully");

      resetForm();
      getAttendance();
    } catch (error) {
      console.error(error);
      alert("Failed to mark attendance");
    }
  };

  // Update Attendance
  const handleUpdateAttendance = async () => {
    try {
      const payload = {
        studentId: Number(formData.studentId),
        attendanceStatus: formData.attendanceStatus,
        remarks: formData.remarks,
        markedBy: Number(localStorage.getItem("userId")),
        classId: Number(formData.classId),
      };

      await api.put(
        `/schoolerp/attendance/update/${selectedAttendanceId}`,
        payload,
      );

      alert("Attendance Updated Successfully");

      resetForm();

      await getAttendance();
    } catch (error) {
      console.error(error);

      console.log(error.response?.data);

      alert("Failed to update attendance");
    }
  };

  // Edit
  const handleEdit = (attendance) => {
    setEditMode(true);

    setSelectedAttendanceId(attendance.attendanceId);

    setFormData({
      studentId: attendance.student?.studentId || "",
      attendanceStatus: attendance.attendanceStatus,
      remarks: attendance.remarks,
      markedBy: attendance.markedBy?.userId || "",
      classId: attendance.classes?.classId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset
  const resetForm = () => {
    setEditMode(false);

    setSelectedAttendanceId(null);

    setFormData({
      studentId: "",
      attendanceStatus: "PRESENT",
      remarks: "",
      markedBy: localStorage.getItem("userId") || "",
      classId: "",
    });
  };

  // Search Filter
  const filteredAttendance = attendanceList.filter((attendance) => {
    const matchesSearch =
      attendance.attendanceStatus
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      attendance.student?.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesClass =
      selectedClass === "" ||
      attendance.classes?.classId?.toString() === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-success">Attendance Management</h2>

          <p className="text-muted mb-0">Mark & manage student attendance</p>
        </div>

        <span className="badge bg-success fs-6 px-3 py-2">
          Total Records: {attendanceList.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 border-0 p-4 mb-4">
        <h4 className="mb-4 text-primary">
          {editMode ? "Update Attendance" : "Mark Attendance"}
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
            <label className="fw-semibold">Attendance Status</label>

            <select
              className="form-select"
              name="attendanceStatus"
              value={formData.attendanceStatus}
              onChange={handleChange}
            >
              <option>PRESENT</option>

              <option>ABSENT</option>

              <option>LEAVE</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Class ID</label>

            <select
              className="form-select"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.classId} - {cls.className} ({cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label className="fw-semibold">Marked By</label>

            <input
              type="number"
              className="form-control"
              disabled
              value={formData.markedBy}
            />
          </div>

          <div className="col-md-12 mb-3">
            <label className="fw-semibold">Remarks</label>

            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2 mt-2">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateAttendance}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddAttendance}>
                Mark Attendance
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <div className="row">
          {/* Search */}
          <div className="col-md-8 mb-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by Student Name or Attendance Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Class Filter */}
          <div className="col-md-4 mb-2">
            <select
              className="form-select form-select-lg"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>

              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} ({cls.section})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Class</th>
                  <th>Marked By</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((attendance) => (
                    <tr key={attendance.attendanceId}>
                      <td>{attendance.attendanceId}</td>

                      <td>{attendance.students?.fullName || "N/A"}</td>

                      <td>
                        <span
                          className={`badge ${
                            attendance.attendanceStatus === "PRESENT"
                              ? "bg-success"
                              : attendance.attendanceStatus === "ABSENT"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                          }`}
                        >
                          {attendance.attendanceStatus}
                        </span>
                      </td>

                      <td>{attendance.remarks}</td>

                      <td>{attendance.classes?.className || "N/A"}</td>

                      <td>{attendance.user?.fullName || "N/A"}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(attendance)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No attendance records found
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
