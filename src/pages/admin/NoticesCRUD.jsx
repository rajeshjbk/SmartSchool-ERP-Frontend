import api from "../../routers/api";

import { useEffect, useState } from "react";

export function NoticesCRUD() {
  const [notices, setNotices] = useState([]);

  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "STUDENTS",
    classId: "",
    createdById: localStorage.getItem("userId"),
    expiryDate: "",
    attachment: "",
    isUrgent: false,
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  // Get All Notices
  const getNotices = async () => {
    try {
      const response = await api.get("/schoolerp/notices/all");

      setNotices(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch notices");
    }
  };
  const getClasses = async () => {
    try {
      const response = await api.get("/schoolerp/classes/all");

      setClasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getNotices();
    getClasses();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add Notice
  const handleAddNotice = async () => {
    try {
      const payload = {
        ...formData,
        createdById: Number(localStorage.getItem("userId")),
      };

      await api.post("/schoolerp/notices/add", payload);

      alert("Notice Added Successfully");

      resetForm();
      getNotices();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Notice");
    }
  };

  // Update Notice
  const handleUpdateNotice = async () => {
    try {
      const payload = {
        ...formData,
        createdById: Number(localStorage.getItem("userId")),
      };

      await api.put(`/schoolerp/notices/update/${selectedNoticeId}`, payload);

      alert("Notice Updated Successfully");

      resetForm();
      getNotices();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Notice");
    }
  };

  // Delete Notice
  const handleDelete = async (noticeId) => {
    const confirmDelete = window.confirm("Are you sure to delete this notice?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/notices/delete/${noticeId}`);

      alert("Notice Deleted Successfully");

      getNotices();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Notice
  const handleEdit = (notice) => {
    setEditMode(true);

    setSelectedNoticeId(notice.noticeId);

    setFormData({
      title: notice.title,
      content: notice.content,
      audience: notice.audience,
      classId: notice.classes?.classId || "",
      createdById: localStorage.getItem("userId"),
      expiryDate: notice.expiryDate,
      attachment: notice.attachment,
      isUrgent: notice.isUrgent,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedNoticeId(null);

    setFormData({
      title: "",
      content: "",
      audience: "STUDENTS",
      classId: "",
      createdBy: "",
      expiryDate: "",
      attachment: "",
      isUrgent: false,
    });
  };

  // Search Filter
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title?.toLowerCase().includes(search.toLowerCase()) ||
      notice.audience?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Notices Management</h2>

        <span className="badge bg-dark fs-6">
          Total Notices: {notices.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Notice" : "Add Notice"}
        </h4>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Title</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Notice Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Audience</label>

            <select
              className="form-select"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
            >
              <option>STUDENTS</option>
              <option>TEACHERS</option>
              <option>PARENTS</option>
              <option>STAFF</option>
              <option>ADMIN</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Class ID</label>

            <select
              className="form-select"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.classId} - {cls.className} ({cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Content</label>

            <textarea
              rows="4"
              className="form-control"
              placeholder="Enter Notice Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Created By</label>

            <input
              type="text"
              className="form-control"
              value={formData.createdBy || localStorage.getItem("userId")}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Expiry Date</label>

            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Attachment URL</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Attachment URL"
              name="attachment"
              value={formData.attachment}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />

              <label className="form-check-label">Urgent Notice</label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateNotice}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddNotice}>
                Add Notice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Title or Audience..."
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
                <th>Title</th>
                <th>Audience</th>
                <th>Class</th>
                <th>Expiry</th>
                <th>Urgent</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotices.map((notice) => (
                <tr key={notice.noticeId}>
                  <td>{notice.noticeId}</td>

                  <td>{notice.title}</td>

                  <td>{notice.audience}</td>

                  <td>{notice.classes?.classId || "N/A"}</td>

                  <td>{notice.expiryDate}</td>

                  <td>{notice.isUrgent ? "Yes" : "No"}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(notice)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(notice.noticeId)}
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
