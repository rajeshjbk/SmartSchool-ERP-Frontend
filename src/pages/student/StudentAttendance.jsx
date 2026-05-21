import api from "../../routers/api";

import { useEffect, useState } from "react";

export function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");

  const studentId = localStorage.getItem("studentId");

  // Fetch Attendance
  const getAttendance = async () => {
    try {
      const response = await api.get(
        `/schoolerp/attendance/student/${studentId}`,
      );

      setAttendance(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  // Search Filter
  const filteredAttendance = attendance.filter(
    (item) =>
      item.attendanceStatus?.toLowerCase().includes(search.toLowerCase()) ||
      item.remarks?.toLowerCase().includes(search.toLowerCase()) ||
      item.classes?.className?.toLowerCase().includes(search.toLowerCase()),
  );

  // Attendance Summary
  const totalPresent = attendance.filter(
    (a) => a.attendanceStatus === "PRESENT",
  ).length;

  const totalAbsent = attendance.filter(
    (a) => a.attendanceStatus === "ABSENT",
  ).length;

  const totalLeave = attendance.filter(
    (a) => a.attendanceStatus === "LEAVE",
  ).length;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-success text-white p-4 mb-4">
        <h2 className="fw-bold">My Attendance</h2>

        <p className="mb-0">View your attendance records</p>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-success text-white">
            <h3>{totalPresent}</h3>
            <h5>Present</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-danger text-white">
            <h3>{totalAbsent}</h3>
            <h5>Absent</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-warning text-dark">
            <h3>{totalLeave}</h3>
            <h5>Leave</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by status, remarks or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-success">Attendance Records</h4>

            <span className="badge bg-success fs-6">
              Total Records: {attendance.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Marked By</th>
                  <th>Class</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((item) => (
                    <tr key={item.attendanceId}>
                      <td>{item.attendanceId}</td>

                      <td>
                        <span
                          className={`badge ${
                            item.attendanceStatus === "PRESENT"
                              ? "bg-success"
                              : item.attendanceStatus === "ABSENT"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                          }`}
                        >
                          {item.attendanceStatus}
                        </span>
                      </td>

                      <td>{item.remarks || "N/A"}</td>

                      <td>{item.user?.fullName || "N/A"}</td>

                      <td>
                        {item.classes?.className || "N/A"}{" "}
                        {item.classes?.section
                          ? `(${item.classes.section})`
                          : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted py-4">
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
