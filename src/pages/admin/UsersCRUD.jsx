import axios from "axios";
import { useEffect, useState } from "react";
import api from "../../routers/api";

export function UsersCRUD() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
    fullName: "",
    email: "",
    phone: "",
    active: true,
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch All Users
  const getUsers = async () => {
    try {
      const response = await api.get("/schoolerp/users/all");

      setUsers(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add User
  const handleAddUser = async () => {
    try {
      await api.post("/schoolerp/users/add", formData);

      alert("User Added Successfully");

      resetForm();
      getUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to Add User");
    }
  };

  // Update User
  const handleUpdateUser = async () => {
    try {
      await api.put(`/schoolerp/users/update/${selectedUserId}`, formData);

      alert("User Updated Successfully");

      resetForm();
      getUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to Update User");
    }
  };

  // Delete User
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure to delete?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/users/delete/${userId}`);

      alert("User Deleted");

      getUsers();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setEditMode(true);

    setSelectedUserId(user.userId);

    setFormData({
      userName: user.userName,
      password: "",
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      active: user.active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedUserId(null);

    setFormData({
      userName: "",
      password: "",
      role: "",
      fullName: "",
      email: "",
      phone: "",
      active: true,
    });
  };

  // Search Filter
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Users Management</h2>

        <span className="badge bg-dark fs-6">Total Users: {users.length}</span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="mb-4 text-primary">
          {editMode ? "Update User" : "Add User"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Username</label>

            <input
              type="text"
              name="userName"
              className="form-control"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Role</label>

            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ROLE_ADMIN">ADMIN</option>

              <option value="ROLE_TEACHER">TEACHER</option>

              <option value="ROLE_STUDENT">STUDENT</option>

              <option value="ROLE_PARENT">PARENT</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Email</label>

            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-12 mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />

              <label className="form-check-label">Active User</label>
            </div>
          </div>

          <div className="d-flex gap-2">
            {editMode ? (
              <>
                <button className="btn btn-warning" onClick={handleUpdateUser}>
                  Update User
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddUser}>
                Add User
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Full Name..."
        className="form-control mb-4"
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
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>

                  <td>{user.userName}</td>

                  <td>{user.fullName}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{user.role}</td>

                  <td>
                    {user.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.userId)}
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
