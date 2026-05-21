import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TimetableCRUD() {
  const [timetables, setTimetables] = useState([]);

  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);

  const [subjects, setSubjects] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    classIds: [],
    teacherId: "",
    dayOfWeek: "",
    periodOfTime: "",
    startTime: "",
    endTime: "",
    roomNo: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedTimeTableId, setSelectedTimeTableId] = useState(null);

  // Get All Timetable
  const getTimetables = async () => {
    try {
      const response = await api.get("/schoolerp/timetable/all");

      setTimetables(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch timetable");
    }
  };

  useEffect(() => {
    getTimetables();

    getClasses();
    getSubjects();
    getTeachers();
  }, []);

  const getClasses = async () => {
    try {
      const response = await api.get("/schoolerp/classes/all");

      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getSubjects = async () => {
    try {
      const response = await api.get("/schoolerp/subjects/all");

      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTeachers = async () => {
    try {
      const response = await api.get("/schoolerp/teachers/all");

      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Change
  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Class Checkbox Selection
  const handleClassCheckbox = (classId) => {
    setFormData((prev) => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId],
    }));
  };

  // Handle Class IDs
  const handleClassIdsChange = (e) => {
    const value = e.target.value;

    setClassIdsInput(value);

    const ids = value
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    setFormData({
      ...formData,
      classIds: ids,
    });
  };

  // Add Timetable
  const handleAddTimetable = async () => {
    try {
      await api.post("/schoolerp/timetable/add", formData);

      alert("Timetable Added Successfully");

      resetForm();
      getTimetables();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Timetable");
    }
  };

  // Update Timetable
  const handleUpdateTimetable = async () => {
    try {
      await api.put(
        `/schoolerp/timetable/update/${selectedTimeTableId}`,
        formData,
      );

      alert("Timetable Updated Successfully");

      resetForm();
      getTimetables();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Timetable");
    }
  };

  // Delete Timetable
  const handleDelete = async (timeTableId) => {
    const confirmDelete = window.confirm("Are you sure to delete timetable?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/timetable/delete/${timeTableId}`);

      alert("Timetable Deleted Successfully");

      getTimetables();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Timetable
  const handleEdit = (timetable) => {
    setEditMode(true);

    setSelectedTimeTableId(timetable.timeTableId);

    const ids = timetable.classes?.map((cls) => cls.classId) || [];

    setClassIdsInput(ids.join(", "));

    setFormData({
      classIds: ids,
      subjectId: timetable.subject?.subjectId || "",
      teacherId: timetable.teachers?.teacherId || "",
      dayOfWeek: timetable.dayOfWeek,
      periodOfTime: timetable.periodOfTime,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      roomNo: timetable.roomNo,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedTimeTableId(null);

    setClassIdsInput("");

    setFormData({
      classIds: [],
      subjectId: "",
      teacherId: "",
      dayOfWeek: "MONDAY",
      periodOfTime: "",
      startTime: "",
      endTime: "",
      roomNo: "",
    });
  };

  // Search Filter
  const filteredTimetables = timetables.filter(
    (item) =>
      item.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
      item.dayOfWeek?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Timetable Management</h2>

        <span className="badge bg-dark fs-6">
          Total Timetables: {timetables.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Timetable" : "Add Timetable"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Class ID</label>

            <select
              className="form-select"
              value={formData.classIds[0] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  classIds: e.target.value ? [Number(e.target.value)] : [],
                }))
              }
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.classId} - {cls.className}
                  {" - "}({cls.section})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label>Subject ID</label>

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
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Teacher ID</label>

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
                  {teacher.user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Day</label>

            <select
              className="form-select"
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
            >
              <option>MONDAY</option>
              <option>TUESDAY</option>
              <option>WEDNESDAY</option>
              <option>THURSDAY</option>
              <option>FRIDAY</option>
              <option>SATURDAY</option>
              <option>SUNDAY</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Period No</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Period Number"
              name="periodOfTime"
              value={formData.periodOfTime}
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
            <label>End Time</label>

            <input
              type="time"
              className="form-control"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Room No</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Room Number"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateTimetable}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddTimetable}>
                Add Timetable
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Day or Room..."
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
                <th>Classes</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Day</th>
                <th>Period</th>
                <th>Start</th>
                <th>End</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTimetables.map((item) => (
                <tr key={item.timeTableId}>
                  <td>{item.timeTableId}</td>

                  <td>
                    {item.classes?.map((c) => c.classId).join(", ") || "N/A"}
                  </td>

                  <td>{item.subject?.subjectName || "N/A"}</td>

                  <td>{item.teachers?.teacherId || "N/A"}</td>

                  <td>{item.dayOfWeek}</td>

                  <td>{item.periodOfTime}</td>

                  <td>{item.startTime}</td>

                  <td>{item.endTime}</td>

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
                      onClick={() => handleDelete(item.timeTableId)}
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
