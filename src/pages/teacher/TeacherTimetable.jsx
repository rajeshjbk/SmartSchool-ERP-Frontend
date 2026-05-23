import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);

  const [search, setSearch] = useState("");

  const teacherId = localStorage.getItem("teacherId");

  // Fetch Timetable
  const getTimetable = async () => {
    try {
      const response = await api.get(
        `/schoolerp/timetable/teacher/${teacherId}`,
      );

      setTimetable(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch timetable");
    }
  };

  useEffect(() => {
    getTimetable();
  }, []);

  // Search Filter
  const filteredTimetable = timetable.filter(
    (item) =>
      item.dayOfWeek?.toLowerCase().includes(search.toLowerCase()) ||
      item.subject?.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      item.roomNo?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-warning">My Timetable</h2>

          <p className="text-muted mb-0">View your teaching schedule</p>
        </div>

        <span className="badge bg-warning text-dark fs-6 px-3 py-2">
          Total Periods: {timetable.length}
        </span>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Day, Subject or Room No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Timetable Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-warning">
                <tr>
                  <th>ID</th>
                  <th>Day</th>
                  <th>Period</th>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Room</th>
                </tr>
              </thead>

              <tbody>
                {filteredTimetable.length > 0 ? (
                  filteredTimetable.map((item) => (
                    <tr key={item.timeTableId}>
                      <td>{item.timeTableId}</td>

                      <td>
                        <span className="badge bg-primary">
                          {item.dayOfWeek}
                        </span>
                      </td>

                      <td>{item.periodOfTime}</td>

                      <td>{item.subject?.subjectName || "N/A"}</td>

                      <td>
                        {item.classes
                          ?.map((cls) => `${cls.className}-${cls.section}`)
                          .join(", ") || "N/A"}
                      </td>

                      <td>{item.startTime}</td>

                      <td>{item.endTime}</td>

                      <td>{item.roomNo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-muted py-4">
                      No timetable found
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
