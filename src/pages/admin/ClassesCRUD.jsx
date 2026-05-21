import api from "../../routers/api";
import { useEffect, useState } from "react";

export function ClassesCRUD() {
  const [classes, setClasses] = useState([]);

  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    className: "",
    section: "",
    academicYear: "",
    roomNo: "",
    capacity: "",
    teacherId: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedClassId, setSelectedClassId] = useState(null);

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
  // Get Registered Teachers
  const getTeachers = async () => {
    try {
      const response = await api.get("/schoolerp/teachers/all");

      setTeachers(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch teachers");
    }
  };
  useEffect(() => {
    getClasses();
    getTeachers();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Class
  const handleAddClass = async () => {
    try {
      await api.post("/schoolerp/classes/add", formData);

      alert("Class Added Successfully");

      resetForm();
      getClasses();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Class");
    }
  };

  // Update Class
  const handleUpdateClass = async () => {
    try {
      await api.put(`/schoolerp/classes/update/${selectedClassId}`, formData);

      alert("Class Updated Successfully");

      resetForm();
      getClasses();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Class");
    }
  };

  // Delete Class
  const handleDelete = async (classId) => {
    const confirmDelete = window.confirm("Are you sure to delete this class?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/classes/delete/${classId}`);

      alert("Class Deleted Successfully");

      getClasses();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Class
  const handleEdit = (singleClass) => {
    setEditMode(true);

    setSelectedClassId(singleClass.classId);

    setFormData({
      className: singleClass.className,
      section: singleClass.section,
      academicYear: singleClass.academicYear,
      roomNo: singleClass.roomNo,
      capacity: singleClass.capacity,
      teacherId: singleClass.teacher?.teacherId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedClassId(null);

    setFormData({
      className: "",
      section: "",
      academicYear: "",
      roomNo: "",
      capacity: "",
      teacherId: "",
    });
  };

  // Search Filter
  const filteredClasses = classes.filter(
    (singleClass) =>
      singleClass.className?.toLowerCase().includes(search.toLowerCase()) ||
      singleClass.section?.toLowerCase().includes(search.toLowerCase()),
  );
  const classOptions = [
    "Nursery",
    "LKG",
    "UKG",
    "One-I",
    "Two-II",
    "Three-III",
    "Four-IV",
    "Five-V",
    "Six-VI",
    "Seven-VII",
    "Eight-VIII",
    "Nine-IX",
    "Ten-X",
    "Eleven-XI",
    "Twelve-XII",
  ];

  const sectionOptions = ["A", "B", "C"];

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Classes Management</h2>

        <span className="badge bg-dark fs-6">
          Total Classes: {classes.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Class" : "Add Class"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Class Name</label>

            <select
              className="form-select"
              name="className"
              value={formData.className}
              onChange={handleChange}
            >
              <option value="">Select Class</option>

              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Section</label>

            <select
              className="form-select"
              name="section"
              value={formData.section}
              onChange={handleChange}
            >
              <option value="">Select Section</option>

              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Academic Year</label>

            <input
              type="text"
              className="form-control"
              placeholder="Ex: 2025-2026"
              name="academicYear"
              value={formData.academicYear}
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

          <div className="col-md-4 mb-3">
            <label>Capacity</label>

            <select
              className="form-select"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            >
              <option value="">Select Capacity</option>

              {Array.from({ length: 81 }, (_, i) => i + 20).map((capacity) => (
                <option key={capacity} value={capacity}>
                  {capacity}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Class Teacher</label>

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
                  {" ("}
                  {teacher.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button className="btn btn-warning" onClick={handleUpdateClass}>
                  Update Class
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddClass}>
                Add Class
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Class Name or Section..."
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
                <th>Class Name</th>
                <th>Section</th>
                <th>Academic Year</th>
                <th>Room No</th>
                <th>Capacity</th>
                <th>Teacher ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredClasses.map((singleClass) => (
                <tr key={singleClass.classId}>
                  <td>{singleClass.classId}</td>

                  <td>{singleClass.className}</td>

                  <td>{singleClass.section}</td>

                  <td>{singleClass.academicYear}</td>

                  <td>{singleClass.roomNo}</td>

                  <td>{singleClass.capacity}</td>

                  <td>{singleClass.teacher?.teacherId || "N/A"}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(singleClass)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(singleClass.classId)}
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
