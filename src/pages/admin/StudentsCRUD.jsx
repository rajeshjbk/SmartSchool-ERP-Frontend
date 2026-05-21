import api from "../../routers/api";
import { useEffect, useState } from "react";

export function StudentsCRUD() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [studentUsers, setStudentUsers] = useState([]);

  const [parentUsers, setParentUsers] = useState([]);

  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    parentId: "",
    admissionNo: "",
    fullName: "",
    dob: "",
    gender: "MALE",
    classId: "",
    academicYear: "",
    studentStatus: "ACTIVE",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Get All Students
  const getStudents = async () => {
    try {
      const response = await api.get("/schoolerp/students/all");

      setStudents(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    }
  };

  useEffect(() => {
    getStudents();
    getStudentUsers();
    getParentUsers();
    getClasses();
  }, []);

  // Generate Admission Number Automatically
  const generateAdmissionNo = () => {
    if (students.length === 0) return "A1001";

    const lastAdmission = students[students.length - 1]?.admissionNo;

    if (!lastAdmission) return "A1001";

    const number = parseInt(lastAdmission.replace("A", ""));

    return `A${number + 1}`;
  };

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto fill when Student selected
    if (name === "userId") {
      const selectedUser = studentUsers.find(
        (user) => String(user.userId) === value,
      );

      setFormData((prev) => ({
        ...prev,
        userId: value,

        // Auto Full Name
        fullName: selectedUser?.fullName || "",

        // Auto Parent
        parentId: selectedUser?.parent?.userId || "",

        // Auto Admission No
        admissionNo: generateAdmissionNo(),
      }));

      return;
    }

    // Auto Academic Year from selected class
    if (name === "classId") {
      const selectedClass = classes.find(
        (cls) => String(cls.classId) === value,
      );

      setFormData((prev) => ({
        ...prev,
        classId: value,
        academicYear: selectedClass?.academicYear || "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Student
  const handleAddStudent = async () => {
    try {
      await api.post("/schoolerp/students/add", formData);

      alert("Student Added Successfully");

      resetForm();
      getStudents();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Student");
    }
  };
  // Get ROLE_STUDENT Users
  const getStudentUsers = async () => {
    try {
      const response = await api.get("/schoolerp/users/role/ROLE_STUDENT");

      setStudentUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Get ROLE_PARENT Users
  const getParentUsers = async () => {
    try {
      const response = await api.get("/schoolerp/users/role/ROLE_PARENT");

      setParentUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Get Classes
  const getClasses = async () => {
    try {
      const response = await api.get("/schoolerp/classes/all");

      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Update Student
  const handleUpdateStudent = async () => {
    try {
      await api.put(
        `/schoolerp/students/update/${selectedStudentId}`,
        formData,
      );

      alert("Student Updated Successfully");

      resetForm();
      getStudents();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Student");
    }
  };

  // Delete Student
  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this student?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/students/delete/${studentId}`);

      alert("Student Deleted Successfully");

      getStudents();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Student
  const handleEdit = (student) => {
    setEditMode(true);

    setSelectedStudentId(student.studentId);

    setFormData({
      userId: student.user?.userId || "",
      parentId: student.users?.userId || "",
      admissionNo: student.admissionNo,
      fullName: student.fullName,
      dob: student.dob,
      gender: student.gender,
      classId: student.classes?.classId || "",
      academicYear: student.academicYear,
      studentStatus: student.studentStatus,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedStudentId(null);

    setFormData({
      userId: "",
      parentId: "",
      admissionNo: "",
      fullName: "",
      dob: "",
      gender: "MALE",
      classId: "",
      academicYear: "",
      studentStatus: "ACTIVE",
    });
  };

  // Search Filter
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      student.admissionNo?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Students Management</h2>

        <span className="badge bg-dark fs-6">
          Total Students: {students.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Student" : "Add Student"}
        </h4>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label>Student User</label>

            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select Student</option>

              {studentUsers.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userId} - {user.userName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Parent</label>

            <select
              className="form-select"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
            >
              <option value="">Select Parent</option>

              {parentUsers.map((parent) => (
                <option key={parent.userId} value={parent.userId}>
                  {parent.userId} - {parent.userName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Admission No</label>

            <input
              type="text"
              className="form-control"
              name="admissionNo"
              value={formData.admissionNo}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Full Name</label>

            <input
              type="text"
              className="form-control"
              name="fullName"
              value={formData.fullName}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Date of Birth</label>

            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Gender</label>

            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>MALE</option>

              <option>FEMALE</option>

              <option>OTHER</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Select Class</label>

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
                  {cls.className} ({cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Academic Year</label>

            <input
              type="text"
              className="form-control"
              placeholder="2025-2026"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Student Status</label>

            <select
              className="form-select"
              name="studentStatus"
              value={formData.studentStatus}
              onChange={handleChange}
            >
              <option>ACTIVE</option>

              <option>INACTIVE</option>

              <option>SUSPENDED</option>

              <option>GRADUATED</option>

              <option>DROPPED</option>
            </select>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateStudent}
                >
                  Update Student
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddStudent}>
                Add Student
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Name or Admission No..."
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
                <th>Admission No</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Class ID</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentId}</td>

                  <td>{student.admissionNo}</td>

                  <td>{student.fullName}</td>

                  <td>{student.dob}</td>

                  <td>{student.gender}</td>

                  <td>{student.classes?.classId || "N/A"}</td>

                  <td>{student.academicYear}</td>

                  <td>
                    <span className="badge bg-success">
                      {student.studentStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.studentId)}
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
