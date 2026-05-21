import api from "../../routers/api";
import { useEffect, useState } from "react";

export function LeaveApplicationsCRUD() {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    leaveType: "SICK_LEAVE",
    fromDate: "",
    toDate: "",
    totalDays: "",
    reason: "",
    leaveStatus: "APPLIED",
    userId: "",
    approvedById: "",
    rejectionNote: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  // ================= GET ALL LEAVES =================
  const getLeaveApplications = async () => {
    try {
      const response = await api.get("/schoolerp/leave-applications/all");

      setLeaveApplications(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch leave applications");
    }
  };

  // ================= GET USERS =================
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
    getLeaveApplications();
    getUsers();
  }, []);

  // ================= AUTO CALCULATE DAYS =================
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);

      const difference = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

      setFormData((prev) => ({
        ...prev,
        totalDays: difference > 0 ? difference : "",
      }));
    }
  }, [formData.fromDate, formData.toDate]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= ADD LEAVE =================
  const handleAddLeave = async () => {
    try {
      await api.post("/schoolerp/leave-applications/add", formData);

      alert("Leave Application Added Successfully");

      resetForm();
      getLeaveApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Leave Application");
    }
  };

  // ================= UPDATE LEAVE =================
  const handleUpdateLeave = async () => {
    try {
      await api.put(
        `/schoolerp/leave-applications/update/${selectedLeaveId}`,
        formData,
      );

      alert("Leave Updated Successfully");

      resetForm();
      getLeaveApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Leave");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (leaveId) => {
    const confirmDelete = window.confirm("Are you sure to delete this leave?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/leave-applications/delete/${leaveId}`);

      alert("Leave Deleted Successfully");

      getLeaveApplications();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (leave) => {
    setEditMode(true);

    setSelectedLeaveId(leave.leaveId);

    setFormData({
      leaveType: leave.leaveType || "SICK_LEAVE",
      fromDate: leave.fromDate || "",
      toDate: leave.toDate || "",
      totalDays: leave.totalDays || "",
      reason: leave.reason || "",
      leaveStatus: leave.leaveStatus || "APPLIED",
      userId: leave.user?.userId || "",
      approvedById: leave.approvedById?.userId || "",
      rejectionNote: leave.rejectionNote || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= RESET =================
  const resetForm = () => {
    setEditMode(false);

    setSelectedLeaveId(null);

    setFormData({
      leaveType: "SICK_LEAVE",
      fromDate: "",
      toDate: "",
      totalDays: "",
      reason: "",
      leaveStatus: "APPLIED",
      userId: "",
      approvedById: "",
      rejectionNote: "",
    });
  };

  // ================= SEARCH =================
  const filteredLeaves = leaveApplications.filter(
    (leave) =>
      leave.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
      leave.leaveStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Leave Applications Management</h2>

        <span className="badge bg-dark fs-6">
          Total Records: {leaveApplications.length}
        </span>
      </div>

      {/* FORM */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Leave" : "Add Leave"}
        </h4>

        <div className="row">
          {/* Leave Type */}
          <div className="col-md-4 mb-3">
            <label>Leave Type</label>

            <select
              className="form-select"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
            >
              <option value="SICK_LEAVE">SICK_LEAVE</option>
              <option value="CASUAL_LEAVE">CASUAL_LEAVE</option>
              <option value="EMERGENCY_LEAVE">EMERGENCY_LEAVE</option>
              <option value="MEDICAL_LEAVE">MEDICAL_LEAVE</option>
              <option value="HALF_DAY_LEAVE">HALF_DAY_LEAVE</option>
              <option value="STUDY_LEAVE">STUDY_LEAVE</option>
              <option value="MATERNITY_LEAVE">MATERNITY_LEAVE</option>
              <option value="FAMILY_FUNCTION_LEAVE">
                FAMILY_FUNCTION_LEAVE
              </option>
              <option value="BEREAVEMENT_LEAVE">BEREAVEMENT_LEAVE</option>
              <option value="VACATION_LEAVE">VACATION_LEAVE</option>
              <option value="SPECIAL_LEAVE">SPECIAL_LEAVE</option>
              <option value="SPORTS_LEAVE">SPORTS_LEAVE</option>
            </select>
          </div>

          {/* From Date */}
          <div className="col-md-4 mb-3">
            <label>From Date</label>

            <input
              type="date"
              className="form-control"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
          </div>

          {/* To Date */}
          <div className="col-md-4 mb-3">
            <label>To Date</label>

            <input
              type="date"
              className="form-control"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
            />
          </div>

          {/* Total Days */}
          <div className="col-md-4 mb-3">
            <label>Total Days</label>

            <input
              type="number"
              className="form-control"
              value={formData.totalDays}
              readOnly
            />
          </div>

          {/* Leave Status */}
          <div className="col-md-4 mb-3">
            <label>Leave Status</label>

            <select
              className="form-select"
              name="leaveStatus"
              value={formData.leaveStatus}
              onChange={handleChange}
            >
              <option value="APPLIED">APPLIED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          {/* User Dropdown */}
          <div className="col-md-4 mb-3">
            <label>User</label>

            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select User</option>

              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userId} - {user.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Approved By */}
          <div className="col-md-4 mb-3">
            <label>Approved By</label>

            <select
              className="form-select"
              name="approvedById"
              value={formData.approvedById}
              onChange={handleChange}
            >
              <option value="">Select Approver</option>

              {users
                .filter(
                  (user) =>
                    user.role === "ROLE_ADMIN" || user.role === "ROLE_TEACHER",
                )
                .map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.userId} - {user.fullName}
                  </option>
                ))}
            </select>
          </div>

          {/* Reason */}
          <div className="col-md-8 mb-3">
            <label>Reason</label>

            <textarea
              rows="3"
              className="form-control"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          {/* Rejection Note */}
          <div className="col-md-12 mb-3">
            <label>Rejection Note</label>

            <textarea
              rows="2"
              className="form-control"
              name="rejectionNote"
              value={formData.rejectionNote}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button className="btn btn-warning" onClick={handleUpdateLeave}>
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddLeave}>
                Add Leave
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Leave Type or Status..."
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
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
                <th>User</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave.leaveId}>
                  <td>{leave.leaveId}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.fromDate}</td>
                  <td>{leave.toDate}</td>
                  <td>{leave.totalDays}</td>
                  <td>{leave.leaveStatus}</td>

                  <td>{leave.user?.fullName || "N/A"}</td>

                  <td>{leave.approvedById?.fullName || "N/A"}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(leave)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(leave.leaveId)}
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
