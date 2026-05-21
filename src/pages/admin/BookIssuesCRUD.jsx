import { useEffect, useState } from "react";
import api from "../../routers/api";

export function BookIssuesCRUD() {
  const [bookIssues, setBookIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    bookId: "",
    studentId: "",
    issuedBy: "",
    dueDate: "",
    returnDate: "",
    fineAmount: "",
    finePaid: false,
    bookStatus: "ISSUED",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedBookIssueId, setSelectedBookIssueId] = useState(null);

  // Get All Book Issues
  const getBookIssues = async () => {
    try {
      const response = await api.get("/schoolerp/book-issues/all");

      setBookIssues(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch book issues");
    }
  };

  // Get Books
  const getBooks = async () => {
    try {
      const response = await api.get("/schoolerp/books/all");

      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Get Students
  const getStudents = async () => {
    try {
      const response = await api.get("/schoolerp/students/all");

      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Get Teachers (Issued By)
  const getTeachers = async () => {
    try {
      const response = await api.get("/schoolerp/teachers/all");

      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBookIssues();
    getBooks();
    getStudents();
    getTeachers();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add Book Issue
  const handleAddBookIssue = async () => {
    try {
      await api.post("/schoolerp/book-issues/issue", formData);

      alert("Book Issue Added Successfully");

      resetForm();
      getBookIssues();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Book Issue");
    }
  };

  // Update Book Issue
  const handleUpdateBookIssue = async () => {
    try {
      await api.put(
        `/schoolerp/book-issues/update/${selectedBookIssueId}`,
        formData,
      );

      alert("Book Issue Updated Successfully");

      resetForm();
      getBookIssues();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Book Issue");
    }
  };

  // Delete Book Issue
  const handleDelete = async (bookIssueId) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this book issue?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/book-issues/delete/${bookIssueId}`);

      alert("Book Issue Deleted Successfully");

      getBookIssues();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Book Issue
  const handleEdit = (issue) => {
    setEditMode(true);

    setSelectedBookIssueId(issue.bookIssuesId);

    setFormData({
      bookId: issue.book?.bookId || "",
      studentId: issue.student?.studentId || "",
      issuedBy: issue.issuedBy?.teacherId || "",
      dueDate: issue.dueDate,
      returnDate: issue.returnDate,
      fineAmount: issue.fineAmount,
      finePaid: issue.finePaid,
      bookStatus: issue.bookStatus,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedBookIssueId(null);

    setFormData({
      bookId: "",
      studentId: "",
      issuedBy: "",
      dueDate: "",
      returnDate: "",
      fineAmount: "",
      finePaid: false,
      bookStatus: "ISSUED",
    });
  };

  // Search Filter
  const filteredBookIssues = bookIssues.filter(
    (issue) =>
      issue.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      issue.book?.title?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Book Issues Management</h2>

        <span className="badge bg-dark fs-6">
          Total Records: {bookIssues.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Book Issue" : "Add Book Issue"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Book ID</label>

            <select
              className="form-select"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
            >
              <option value="">Select Book</option>

              {books.map((book) => (
                <option key={book.bookId} value={book.bookId}>
                  {book.bookId} - {book.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Student ID</label>

            <select
              className="form-select"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId} - {student.user?.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label>Issued By</label>

            <select
              className="form-select"
              name="issuedBy"
              value={formData.issuedBy}
              onChange={handleChange}
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher.teacherId} value={teacher.teacherId}>
                  {teacher.teacherId} - {teacher.user?.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Due Date</label>

            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Return Date</label>

            <input
              type="date"
              className="form-control"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Fine Amount</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Fine Amount"
              name="fineAmount"
              value={formData.fineAmount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Book Status</label>

            <select
              className="form-select"
              name="bookStatus"
              value={formData.bookStatus}
              onChange={handleChange}
            >
              <option value="ISSUED">ISSUED</option>

              <option value="RETURNED">RETURNED</option>

              <option value="LOST">LOST</option>

              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>

          <div className="col-md-12 mb-3">
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="finePaid"
                checked={formData.finePaid}
                onChange={handleChange}
              />

              <label className="form-check-label">Fine Paid</label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateBookIssue}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddBookIssue}>
                Add Book Issue
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Student or Book Title..."
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
                <th>Book</th>
                <th>Student</th>
                <th>Issued Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Fine</th>
                <th>Fine Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookIssues.length > 0 ? (
                filteredBookIssues.map((issue) => (
                  <tr key={issue.bookIssuesId}>
                    <td>{issue.bookIssuesId}</td>

                    <td>{issue.book?.title || "N/A"}</td>

                    <td>{issue.student?.fullName || "N/A"}</td>

                    <td>{issue.issueDate}</td>

                    <td>{issue.dueDate}</td>

                    <td>{issue.returnDate || "N/A"}</td>

                    <td>₹{issue.fineAmount ?? 0}</td>

                    <td>{issue.finePaid ? "Yes" : "No"}</td>

                    <td>{issue.bookStatus}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(issue)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(issue.bookIssuesId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
