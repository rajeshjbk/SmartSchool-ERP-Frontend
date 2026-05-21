import api from "../../routers/api";

import { useEffect, useState } from "react";

export function ParentLeave() {
  const [leaveList, setLeaveList] = useState([]);

  const [search, setSearch] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [children, setChildren] = useState([]);

  const parentId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    leaveType: "SICK_LEAVE",
    fromDate: "",
    toDate: "",
    totalDays: "",
    reason: "",
    leaveStatus: "PENDING",
    userId: "",
    approvedBy: "",
    rejectionNote: "",
  });

  // Fetch Child Leave Records
  const getLeaves = async () => {
    try {
      const response = await api.get(
        `/schoolerp/leave-applications/parent/${parentId}`,
      );

      setLeaveList(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch leave applications");
    }
  };

  // Fetch Child Details
  const getChildren = async () => {
    try {
      const response = await api.get(`/schoolerp/students/parent/${parentId}`);

      const childData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setChildren(childData);

      // auto select first child
      if (childData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          userId: childData[0]?.user?.userId || "",
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLeaves();
    getChildren();
  }, []);

  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);

      const difference = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

      setFormData((prev) => ({
        ...prev,
        totalDays: difference > 0 ? difference : 0,
      }));
    }
  }, [formData.fromDate, formData.toDate]);
  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Apply Leave
  const handleApplyLeave = async () => {
    try {
      const leaveData = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        totalDays: formData.totalDays,
        reason: formData.reason,
        userId: Number(formData.userId),
        approvedById: null,
        rejectionNote: "",
      };

      await api.post("/schoolerp/leave-applications/apply", leaveData);

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
      const updatedData = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        totalDays: formData.totalDays,
        reason: formData.reason,
        userId: Number(formData.userId),
        approvedById: null,
        rejectionNote: "",
      };

      await api.put(
        `/schoolerp/leave-applications/update/${selectedLeaveId}`,
        updatedData,
      );

      alert("Leave Updated Successfully");

      resetForm();
      getLeaves();
    } catch (error) {
      console.error(error);
      alert("Failed to update leave");
    }
  };

  // Edit Leave
  const handleEdit = (leave) => {
    setEditMode(true);

    setSelectedLeaveId(leave.leaveId);

    setFormData({
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      leaveStatus: leave.leaveStatus,
      userId: leave.user?.userId || "",
      approvedBy: leave.approvedBy?.userId || "",
      rejectionNote: leave.rejectionNote || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedLeaveId(null);

    setFormData({
      leaveType: "SICK_LEAVE",
      fromDate: "",
      toDate: "",
      totalDays: "",
      reason: "",
      leaveStatus: "PENDING",
      userId: formData.userId,
      approvedBy: "",
      rejectionNote: "",
    });
  };

  // Search Filter
  const filteredLeaves = leaveList.filter(
    (leave) =>
      leave.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
      leave.leaveStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-success text-white p-4 mb-4">
        <h2 className="fw-bold">Child Leave Management</h2>

        <p className="mb-0">Apply and track your child's leave requests</p>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 border-0 p-4 mb-4">
        <h4 className="text-success mb-4">
          {editMode ? "Update Leave" : "Apply Leave"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">Select Child</label>

            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select Child</option>

              {children.map((child) => (
                <option key={child.studentId} value={child.user?.userId}>
                  {child.fullName}
                </option>
              ))}
            </select>
          </div>
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
              name="totalDays"
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

          {editMode && formData.rejectionNote && (
            <div className="col-md-12 mb-3">
              <label className="fw-semibold text-danger">Rejection Note</label>

              <textarea
                rows="2"
                className="form-control bg-light"
                readOnly
                value={formData.rejectionNote}
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
              <button className="btn btn-success" onClick={handleApplyLeave}>
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
          placeholder="Search by leave type or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Leave Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-success">Leave Records</h4>

            <span className="badge bg-success fs-6">
              Total Leaves: {leaveList.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
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
                        {(leave.leaveStatus === "APPLIED" ||
                          leave.leaveStatus === "PENDING") && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(leave)}
                          >
                            Edit
                          </button>
                        )}
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
