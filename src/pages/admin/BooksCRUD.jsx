import api from "../../routers/api";

import { useEffect, useState } from "react";

export function BooksCRUD() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    edition: "",
    category: "",
    totalCopies: "",
    availableCopies: "",
    shelfLocation: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedBookId, setSelectedBookId] = useState(null);

  // Get All Books
  const getBooks = async () => {
    try {
      const response = await api.get("/schoolerp/books/all");

      setBooks(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch books");
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Book
  const handleAddBook = async () => {
    try {
      await api.post("/schoolerp/books/add", formData);

      alert("Book Added Successfully");

      resetForm();
      getBooks();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Book");
    }
  };

  // Update Book
  const handleUpdateBook = async () => {
    try {
      await api.put(`/schoolerp/books/update/${selectedBookId}`, formData);

      alert("Book Updated Successfully");

      resetForm();
      getBooks();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Book");
    }
  };

  // Delete Book
  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm("Are you sure to delete this book?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/books/delete/${bookId}`);

      alert("Book Deleted Successfully");

      getBooks();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Book
  const handleEdit = (book) => {
    setEditMode(true);

    setSelectedBookId(book.bookId);

    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      edition: book.edition,
      category: book.category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      shelfLocation: book.shelfLocation,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedBookId(null);

    setFormData({
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      edition: "",
      category: "",
      totalCopies: "",
      availableCopies: "",
      shelfLocation: "",
    });
  };

  // Search Filter
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Books Management</h2>

        <span className="badge bg-dark fs-6">Total Books: {books.length}</span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Book" : "Add Book"}
        </h4>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Book Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Author</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Author Name"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>ISBN</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Publisher</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Edition</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Total Copies</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Total Copies"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Available Copies</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Available Copies"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Shelf Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Shelf Location"
              name="shelfLocation"
              value={formData.shelfLocation}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button className="btn btn-warning" onClick={handleUpdateBook}>
                  Update Book
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={handleAddBook}>
                Add Book
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Title, Author or Category..."
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
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Total</th>
                <th>Available</th>
                <th>Shelf</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.bookId}</td>

                  <td>{book.title}</td>

                  <td>{book.author}</td>

                  <td>{book.isbn}</td>

                  <td>{book.category}</td>

                  <td>{book.totalCopies}</td>

                  <td>{book.availableCopies}</td>

                  <td>{book.shelfLocation}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.bookId)}
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
