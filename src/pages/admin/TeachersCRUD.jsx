import api from "../../routers/api";

import { useEffect, useState } from "react";

export function TeachersCRUD() {
  const [teachers, setTeachers] = useState([]);
  const [teacherUsers, setTeacherUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    designation: "",
    salary: "",
    qualification: "",
    teacherStatus: "ACTIVE",
    userId: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

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

  useEffect(() => {
    getTeachers();
    getTeacherUsers();
  }, []);

  const generateEmployeeId = () => {
    if (teachers.length === 0) return "EMP1";

    const lastTeacher = teachers[teachers.length - 1];

    const lastId = lastTeacher?.employeeId || "EMP0";

    const number = parseInt(lastId.replace("EMP", ""));

    return `EMP${number + 1}`;
  };
  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto Generate Employee ID after selecting teacher user
    if (name === "userId") {
      setFormData((prev) => ({
        ...prev,
        userId: value,
        employeeId: generateEmployeeId(),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get ROLE_TEACHER Users
  const getTeacherUsers = async () => {
    try {
      const response = await api.get("/schoolerp/users/role/ROLE_TEACHER");

      setTeacherUsers(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch teacher users");
    }
  };
  // Add Teacher
  const handleAddTeacher = async () => {
    try {
      await api.post("/schoolerp/teachers/add", formData);

      alert("Teacher Added Successfully");

      resetForm();
      getTeachers();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Teacher");
    }
  };

  // Update Teacher
  const handleUpdateTeacher = async () => {
    try {
      await api.put(
        `/schoolerp/teachers/update/${selectedTeacherId}`,
        formData,
      );

      alert("Teacher Updated Successfully");

      resetForm();
      getTeachers();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Teacher");
    }
  };

  // Delete Teacher
  const handleDelete = async (teacherId) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this teacher?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/teachers/delete/${teacherId}`);

      alert("Teacher Deleted Successfully");

      getTeachers();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Teacher
  const handleEdit = (teacher) => {
    setEditMode(true);

    setSelectedTeacherId(teacher.teacherId);

    setFormData({
      employeeId: teacher.employeeId,
      department: teacher.department,
      designation: teacher.designation,
      salary: teacher.salary,
      qualification: teacher.qualification,
      teacherStatus: teacher.teacherStatus,
      userId: teacher.user?.userId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedTeacherId(null);

    setFormData({
      employeeId: "",
      department: "",
      designation: "",
      salary: "",
      qualification: "",
      teacherStatus: "ACTIVE",
      userId: "",
    });
  };

  // Search Filter
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(search.toLowerCase()),
  );
  const departmentOptions = [
    "Science",
    "Mathematics",
    "English",
    "Hindi",
    "Social Science",
    "Computer Science",
    "Sports",
    "Arts",
    "Commerce",
  ];

  const designationOptions = [
    "Teacher",
    "Senior Teacher",
    "Assistant Teacher",
    "HOD",
    "Vice Principal",
    "Principal",
  ];

  const qualificationOptions = [
    "B.ED",
    "M.ED",
    "B.SC",
    "M.SC",
    "B.A",
    "M.A",
    "B.TECH",
    "M.TECH",
    "PHD",
  ];
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Teachers Management</h2>

        <span className="badge bg-dark fs-6">
          Total Teachers: {teachers.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Teacher" : "Add Teacher"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Employee ID</label>

            <input
              type="text"
              className="form-control"
              name="employeeId"
              value={formData.employeeId}
              readOnly
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Department</label>

            <select
              className="form-select"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>

              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Designation</label>

            <select
              className="form-select"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>

              {designationOptions.map((desig) => (
                <option key={desig} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Salary</label>

            <select
              className="form-select"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            >
              <option value="">Select Salary</option>

              {Array.from({ length: (100000 - 5000) / 5000 + 1 }, (_, i) => {
                const salary = (i + 1) * 5000;

                return (
                  <option key={salary} value={salary}>
                    ₹{salary}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Qualification</label>

            <select
              className="form-select"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            >
              <option value="">Select Qualification</option>

              {qualificationOptions.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Teacher User</label>

            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select Teacher User</option>

              {teacherUsers.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userId} - {user.fullName} ({user.userName})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Status</label>

            <select
              className="form-select"
              name="teacherStatus"
              value={formData.teacherStatus}
              onChange={handleChange}
            >
              <option>ACTIVE</option>

              <option>INACTIVE</option>

              <option>ON_LEAVE</option>

              <option>RESIGNED</option>

              <option>TERMINATED</option>

              <option>RETIRED</option>
            </select>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateTeacher}
                >
                  Update Teacher
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddTeacher}>
                Add Teacher
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Employee ID or Department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="card shadow rounded-4 p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Qualification</th>
                <th>Status</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.teacherId}>
                  <td>{teacher.teacherId}</td>

                  <td>{teacher.employeeId}</td>

                  <td>{teacher.department}</td>

                  <td>{teacher.designation}</td>

                  <td>₹{teacher.salary}</td>

                  <td>{teacher.qualification}</td>

                  <td>
                    <span className="badge bg-success">
                      {teacher.teacherStatus}
                    </span>
                  </td>

                  <td>{teacher.user?.userId || "N/A"}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(teacher)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(teacher.teacherId)}
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
