import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherLeave() {
  const [leaveList, setLeaveList] = useState([]);

  const [search, setSearch] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const [formData, setFormData] = useState({
    leaveType: "SICK_LEAVE",
    fromDate: "",
    toDate: "",
    totalDays: "",
    reason: "",
    leaveStatus: "APPLIED",
    userId: localStorage.getItem("userId") || "",
    approvedBy: "",
    rejectionNote: "",
  });

  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);

      // Calculate difference in days
      const diffTime = to - from;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      setFormData((prev) => ({
        ...prev,
        totalDays: diffDays > 0 ? diffDays : 0,
      }));
    }
  }, [formData.fromDate, formData.toDate]);

  const userId = localStorage.getItem("userId");

  // Fetch Teacher Leaves
  const getLeaves = async () => {
    try {
      const response = await api.get(
        `/schoolerp/leave-applications/user/${userId}`
      );

      setLeaveList(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch leave applications");
    }
  };

  useEffect(() => {
    getLeaves();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add Leave
  const handleAddLeave = async () => {
    try {
      await api.post(
        "/schoolerp/leave-applications/apply",
        formData
      );

      alert("Leave Applied Successfully");

      resetForm();
      getLeaves();
    } catch (error) {
      console.error(error);
      alert("Failed to apply leave");
    }
  };

  // Update Leave
  const handleUpdateLeave = async () => {
    try {
      await api.put(
        `/schoolerp/leave-applications/update/${selectedLeaveId}`,
        formData
      );

      alert("Leave Updated Successfully");

      resetForm();
      getLeaves();
    } catch (error) {
      console.error(error);
      alert("Failed to update leave");
    }
  };

  // Edit
  const handleEdit = (leave) => {
    setEditMode(true);

    setSelectedLeaveId(leave.leaveApplicationId);

    setFormData({
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      leaveStatus: leave.leaveStatus,
      userId: leave.user?.userId || "",
      approvedBy: leave.approvedBy?.userId || "",
      rejectionNote: leave.rejectionNote,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset
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
      userId: localStorage.getItem("userId") || "",
      approvedBy: "",
      rejectionNote: "",
    });
  };

  // Search
  const filteredLeaves = leaveList.filter(
    (leave) =>
      leave.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
      leave.leaveStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-success">Leave Management</h2>

          <p className="text-muted mb-0">Apply and track leave requests</p>
        </div>

        <span className="badge bg-success fs-6 px-3 py-2">
          Total Leaves: {leaveList.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 border-0 p-4 mb-4">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Leave" : "Apply Leave"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">Leave Type</label>

            <select
              className="form-select"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
            >
              <option>SICK_LEAVE</option>
              <option>CASUAL_LEAVE</option>
              <option>EMERGENCY_LEAVE</option>
              <option>MEDICAL_LEAVE</option>
              <option>HALF_DAY_LEAVE</option>
              <option>FAMILY_FUNCTION_LEAVE</option>
              <option>BEREAVEMENT_LEAVE</option>
              <option>STUDY_LEAVE</option>
              <option>MATERNITY_LEAVE</option>
              <option>SPORTS_LEAVE</option>
              <option>VACATION_LEAVE</option>
              <option>SPECIAL_LEAVE</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">From Date</label>

            <input
              type="date"
              className="form-control"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">To Date</label>

            <input
              type="date"
              className="form-control"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">Total Days</label>

            <input
              type="number"
              className="form-control"
              value={formData.totalDays}
              readOnly
            />
          </div>

          <div className="col-md-8 mb-3">
            <label className="fw-semibold">Reason</label>

            <textarea
              rows="3"
              className="form-control"
              placeholder="Enter leave reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          {editMode && (
            <div className="col-md-12 mb-3">
              <label className="fw-semibold">Rejection Note</label>

              <textarea
                rows="2"
                className="form-control"
                value={formData.rejectionNote}
                readOnly
              />
            </div>
          )}

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
                Apply Leave
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by Leave Type or Status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.leaveId}>
                      <td>{leave.leaveId}</td>

                      <td>{leave.leaveType}</td>

                      <td>{leave.fromDate}</td>

                      <td>{leave.toDate}</td>

                      <td>{leave.totalDays}</td>

                      <td>
                        <span
                          className={`badge ${
                            leave.leaveStatus === "APPROVED"
                              ? "bg-success"
                              : leave.leaveStatus === "REJECTED"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                          }`}
                        >
                          {leave.leaveStatus}
                        </span>
                      </td>

                      <td>{leave.reason}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(leave)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-muted py-4">
                      No leave records found
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
