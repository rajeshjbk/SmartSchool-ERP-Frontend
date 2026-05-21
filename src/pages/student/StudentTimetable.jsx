import api from "../../routers/api";
import { useEffect, useState } from "react";

export function StudentTimetable() {
  const [timetable, setTimetable] = useState([]);

  const [search, setSearch] = useState("");

  const userId = localStorage.getItem("userId");

  // Fetch Timetable
  const getTimetable = async () => {
    try {
      const response = await api.get(`/schoolerp/timetable/student/${userId}`);

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
      item.subject?.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      item.teacher?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.dayOfWeek?.toLowerCase().includes(search.toLowerCase()) ||
      item.roomNo?.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by Day
  const groupedTimetable = filteredTimetable.reduce((acc, item) => {
    const day = item.dayOfWeek;

    if (!acc[day]) {
      acc[day] = [];
    }

    acc[day].push(item);

    return acc;
  }, {});

  const daysOrder = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-warning text-dark p-4 mb-4">
        <h2 className="fw-bold">My Timetable</h2>

        <p className="mb-0">View your weekly class schedule</p>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by subject, teacher, room or day..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Timetable */}
      {daysOrder.map(
        (day) =>
          groupedTimetable[day] && (
            <div key={day} className="card shadow-lg border-0 rounded-4 mb-4">
              <div className="card-header bg-warning text-dark fw-bold fs-5">
                {day}
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover text-center align-middle mb-0">
                    <thead className="table-warning">
                      <tr>
                        <th>Period</th>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Room</th>
                      </tr>
                    </thead>

                    <tbody>
                      {groupedTimetable[day]
                        .sort((a, b) => a.periodOfTime - b.periodOfTime)
                        .map((item, index) => (
                          <tr key={` ${item.timetableId}- ${index}`}>
                            <td>{item.periodOfTime}</td>

                            <td>{item.subject?.subjectName || "N/A"}</td>

                            <td>{item.teachers?.user?.fullName || "N/A"}</td>

                            <td>
                              {new Date(
                                `1970-01-01T${item.startTime}`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>

                            <td>
                              {new Date(
                                `1970-01-01T${item.endTime}`,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>

                            <td>{item.roomNo || "N/A"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ),
      )}

      {/* Empty State */}
      {filteredTimetable.length === 0 && (
        <div className="card shadow border-0 rounded-4 text-center p-5">
          <h4 className="text-muted">No timetable found</h4>
        </div>
      )}
    </div>
  );
}
