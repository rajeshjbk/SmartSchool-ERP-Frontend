import { useEffect, useState } from "react";
import api from "../../routers/api";
export function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const teacherId = localStorage.getItem("teacherId");

  // Fetch Assigned Classes
  const getClasses = async () => {
    try {
      setLoading(true);

      if (!teacherId) {
        alert("Teacher ID not found");
        return;
      }

      const response = await api.get(
        `/schoolerp/classes/teacher/${teacherId}`,
      );

     setClasses(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Fetch Classes Error:", error);

      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
      } else if (error.response?.status === 404) {
        alert("No classes assigned.");
      } else {
        alert("Failed to fetch classes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  // Search Filter
  const filteredClasses = classes.filter((cls) => {
    const searchText = search.toLowerCase();

    return (
      cls?.className?.toLowerCase().includes(searchText) ||
      cls?.section?.toLowerCase().includes(searchText) ||
      cls?.academicYear?.toLowerCase().includes(searchText) ||
      cls?.roomNo?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-info">My Classes</h2>

          <p className="text-muted mb-0">View assigned classes</p>
        </div>

        <span className="badge bg-info text-dark fs-6 px-3 py-2">
          Total Classes: {classes.length}
        </span>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Class, Section, Academic Year or Room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-info">
                <tr>
                  <th>ID</th>
                  <th>Class Name</th>
                  <th>Section</th>
                  <th>Academic Year</th>
                  <th>Room No</th>
                  <th>Capacity</th>
                  <th>Class Teacher</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-4">
                      Loading classes...
                    </td>
                  </tr>
                ) : filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <tr key={cls.classId}>
                      <td>{cls.classId}</td>

                      <td className="fw-semibold">{cls.className}</td>

                      <td>
                        <span className="badge bg-primary">{cls.section}</span>
                      </td>

                      <td>{cls.academicYear}</td>

                      <td>{cls.roomNo}</td>

                      <td>{cls.capacity}</td>

                      <td>{localStorage.getItem("fullName") || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No classes found
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
