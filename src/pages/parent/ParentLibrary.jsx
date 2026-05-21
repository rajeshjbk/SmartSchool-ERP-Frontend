import api from "../../routers/api";

import { useEffect, useState } from "react";

export function ParentLibrary() {
  const [bookIssues, setBookIssues] = useState([]);

  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const parentId = localStorage.getItem("userId");

  // Fetch Available Books
  const getBooks = async () => {
    try {
      const response = await api.get("/schoolerp/books/all");

      setBooks(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch books");
    }
  };

  // Fetch Child Issued Books
  const getBookIssues = async () => {
    try {
      const response = await api.get(
        `/schoolerp/book-issues/parent/${parentId}`,
      );

      setBookIssues(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch issued books");
    }
  };

  useEffect(() => {
    getBooks();
    getBookIssues();
  }, []);

  // Search Books
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-primary text-white p-4 mb-4">
        <h2 className="fw-bold">Library Details</h2>

        <p className="mb-0">
          View available books and your child’s issued books
        </p>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search books by title, author, category or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Available Books */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-primary">Available Books</h4>

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
                  <th>Publisher</th>
                  <th>Category</th>
                  <th>Available</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.bookId}>
                      <td>{book.bookId}</td>

                      <td className="fw-semibold">{book.title}</td>

                      <td>{book.author}</td>

                      <td>{book.isbn}</td>

                      <td>{book.publisher}</td>

                      <td>
                        <span className="badge bg-info">{book.category}</span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            book.availableCopies > 0
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {book.availableCopies}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Child Issued Books */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-success">Child Issued Books</h4>

            <span className="badge bg-success fs-6">
              Total Issued: {bookIssues.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>ID</th>
                  <th>Book Title</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookIssues.length > 0 ? (
                  bookIssues.map((issue) => (
                    <tr key={issue.bookIssueId}>
                      <td>{issue.bookIssueId}</td>

                      <td>{issue.book?.title || "N/A"}</td>

                      <td>{issue.issueDate}</td>

                      <td>{issue.dueDate}</td>

                      <td>{issue.returnDate || "Not Returned"}</td>

                      <td>₹{issue.fineAmount || 0}</td>

                      <td>
                        <span className="badge bg-info">
                          {issue.bookStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      No issued books found
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
