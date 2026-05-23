import api from "../../routers/api";

import { useEffect, useState } from "react";

export function ParentAttendance() {
  const [attendance, setAttendance] = useState([]);

  const [search, setSearch] = useState("");

  const parentId = localStorage.getItem("userId");

  // Fetch Attendance
  const getAttendance = async () => {
    try {
      const response = await api.get(
        `/schoolerp/attendance/parent/${parentId}`,
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
      item.subject?.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      item.attendanceStatus?.toLowerCase().includes(search.toLowerCase()) ||
      item.date?.toLowerCase().includes(search.toLowerCase()),
  );

  // Statistics
  const totalClasses = attendance.length;

  const presentCount = attendance.filter(
    (a) => a.attendanceStatus === "PRESENT",
  ).length;

  const absentCount = attendance.filter(
    (a) => a.attendanceStatus === "ABSENT",
  ).length;

  const attendancePercentage =
    totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-success text-white p-4 mb-4">
        <h2 className="fw-bold">Child Attendance</h2>

        <p className="mb-0">Monitor your child’s attendance performance</p>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-primary text-white text-center p-4">
            <h2>{totalClasses}</h2>
            <h5>Total Classes</h5>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-success text-white text-center p-4">
            <h2>{presentCount}</h2>
            <h5>Present</h5>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-danger text-white text-center p-4">
            <h2>{absentCount}</h2>
            <h5>Absent</h5>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0 rounded-4 bg-warning text-dark text-center p-4">
            <h2>{attendancePercentage}%</h2>
            <h5>Attendance %</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by subject, status or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
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
                  <th>Student</th>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((item) => (
                    <tr key={item.attendanceId}>
                      <td>{item.attendanceId}</td>

                      <td>{item.students?.fullName || "N/A"}</td>

                      <td>{item.date}</td>

                      <td>
                        {item?.classes?.subjects?.length > 0
                          ? item?.classes?.subjects[0].subjectName
                          : "N/A"}
                      </td>

                      <td>{item.user?.fullName || "N/A"}</td>

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
