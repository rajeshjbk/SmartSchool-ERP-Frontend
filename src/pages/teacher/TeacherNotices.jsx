import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherNotices() {
  const [notices, setNotices] = useState([]);

  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "STUDENTS",
    classId: "",
    createdBy: localStorage.getItem("userId") || "",
    expiryDate: "",
    attachment: "",
    isUrgent: false,
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  // Fetch Notices
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
      alert("Failed to fetch classes");
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
      await api.post("/schoolerp/notices/add", formData);

      alert("Notice Added Successfully");

      resetForm();
      getNotices();
    } catch (error) {
      console.error(error);
      alert("Failed to add notice");
    }
  };

  // Update Notice
  const handleUpdateNotice = async () => {
    try {
      await api.put(`/schoolerp/notices/update/${selectedNoticeId}`, formData);

      alert("Notice Updated Successfully");

      resetForm();
      getNotices();
    } catch (error) {
      console.error(error);
      alert("Failed to update notice");
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
      createdBy: notice.createdBy?.userId || "",
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
      createdBy: localStorage.getItem("userId") || "",
      expiryDate: "",
      attachment: "",
      isUrgent: false,
    });
  };

  // Search
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title?.toLowerCase().includes(search.toLowerCase()) ||
      notice.audience?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-danger">Notices Management</h2>

          <p className="text-muted mb-0">Create & manage notices</p>
        </div>

        <span className="badge bg-danger fs-6 px-3 py-2">
          Total Notices: {notices.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 border-0 p-4 mb-4">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Notice" : "Create Notice"}
        </h4>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="fw-semibold">Title</label>

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
            <label className="fw-semibold">Audience</label>

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
            <label className="fw-semibold">Class ID</label>

            <select
              className="form-select"
              value={formData.classId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  classId: e.target.value,
                })
              }
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.classId} - {cls.className} ({cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-8 mb-3">
            <label className="fw-semibold">Content</label>

            <textarea
              rows="4"
              className="form-control"
              placeholder="Enter Notice Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">Expiry Date</label>

            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-8 mb-3">
            <label className="fw-semibold">Attachment</label>

            <input
              type="text"
              className="form-control"
              placeholder="Attachment URL"
              name="attachment"
              value={formData.attachment}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />

              <label className="form-check-label fw-semibold">
                Urgent Notice
              </label>
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
              <button className="btn btn-danger" onClick={handleAddNotice}>
                Create Notice
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
          placeholder="Search by Title or Audience..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-danger">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Audience</th>
                  <th>Class Id</th>
                  <th>Created By</th>
                  <th>Publish Date</th>
                  <th>Expiry</th>
                  <th>Urgent</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice) => (
                    <tr key={notice.noticeId}>
                      <td>{notice.noticeId}</td>

                      <td>{notice.title}</td>

                      {/* Notice Content */}
                      <td
                        style={{
                          maxWidth: "250px",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {notice.content}
                      </td>

                      <td>{notice.audience}</td>

                      <td>{notice.classes?.classId || "N/A"}</td>

                      <td>{notice.createdBy?.fullName || "N/A"}</td>

                      <td>{notice.publishDate}</td>

                      <td>{notice.expiryDate}</td>

                      <td>
                        <span
                          className={`badge ${
                            notice.isUrgent ? "bg-danger" : "bg-secondary"
                          }`}
                        >
                          {notice.isUrgent ? "Yes" : "No"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(notice)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted">
                      No Notices Found
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
