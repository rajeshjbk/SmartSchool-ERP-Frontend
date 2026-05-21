import api from "../../routers/api";
import { useEffect, useState } from "react";

export function TeacherLibrary() {
  const [books, setBooks] = useState([]);

  const [bookIssues, setBookIssues] = useState([]);

  const [search, setSearch] = useState("");

  // Fetch Books
  const getBooks = async () => {
    try {
      const response = await api.get("/schoolerp/books/all");

      setBooks(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch books");
    }
  };

  // Fetch Book Issues
  const getBookIssues = async () => {
    try {
      const response = await api.get("/schoolerp/book-issues/all");

      setBookIssues(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch book issues");
    }
  };

  useEffect(() => {
    getBooks();
    getBookIssues();
  }, []);

  // Filter Books
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Library</h2>

        <p className="text-muted">View books and issued books</p>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Books Table */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-primary">Books Details</h4>

            <span className="badge bg-primary fs-6">
              Total Books: {books.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Shelf</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={`${book.bookId}-${index}`}>
                    <td>{book.bookId}</td>

                    <td>{book.title}</td>

                    <td>{book.author}</td>

                    <td>{book.isbn}</td>

                    <td>{book.category}</td>

                    <td>{book.totalCopies}</td>

                    <td>{book.availableCopies}</td>

                    <td>{book.shelfLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Book Issues Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-success">Book Issues</h4>

            <span className="badge bg-success fs-6">
              Total Issues: {bookIssues.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookIssues.map((issue, index) => (
                  <tr key={`${issue.bookIssuesId}-${index}`}>
                    <td>{issue.bookIssuesId}</td>

                    <td>{issue.book?.title || "N/A"}</td>

                    <td>{issue.student?.fullName || "N/A"}</td>

                    <td>{issue.dueDate}</td>

                    <td>{issue.returnDate || "Not Returned"}</td>

                    <td>₹ {issue.fineAmount || 0}</td>

                    <td>
                      <span className="badge bg-info">{issue.bookStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
