import api from "../../routers/api";

import { useEffect, useState } from "react";

export function StudentNotices() {
  const [notices, setNotices] = useState([]);

  const [search, setSearch] = useState("");

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

  useEffect(() => {
    getNotices();
  }, []);

  // Filter Only Student Notices
  const studentNotices = notices.filter(
    (notice) => notice.audience === "STUDENTS" || notice.audience === "ALL",
  );

  // Search Filter
  const filteredNotices = studentNotices.filter(
    (notice) =>
      notice.title?.toLowerCase().includes(search.toLowerCase()) ||
      notice.content?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-primary text-white p-4 mb-4">
        <h2 className="fw-bold">School Notices</h2>

        <p className="mb-0">View important school announcements</p>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Notices */}
      <div className="row">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice.noticeId} className="col-md-6 mb-4">
              <div
                className={`card shadow border-0 rounded-4 h-100 ${
                  notice.isUrgent ? "border border-danger border-3" : ""
                }`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 className="fw-bold text-primary">{notice.title}</h4>

                    {notice.isUrgent && (
                      <span className="badge bg-danger">URGENT</span>
                    )}
                  </div>

                  <p className="text-muted mb-3">{notice.content}</p>

                  <div className="mb-2">
                    <strong>Audience:</strong>{" "}
                    <span className="badge bg-info">{notice.audience}</span>
                  </div>

                  <div className="mb-2">
                    <strong>Expiry Date:</strong> {notice.expiryDate || "N/A"}
                  </div>

                  <div className="mb-2">
                    <strong>Attachment:</strong>{" "}
                    {notice.attachment ? (
                      <a
                        href={notice.attachment}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>

                  <div>
                    <strong>Created By:</strong>{" "}
                    {notice.createdBy?.fullName || "Admin"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card shadow border-0 rounded-4 text-center p-5">
              <h4 className="text-muted">No notices found</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
