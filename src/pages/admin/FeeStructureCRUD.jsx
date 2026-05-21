import api from "../../routers/api";
import { useEffect, useState } from "react";

export function FeeStructureCRUD() {
  const [feeStructures, setFeeStructures] = useState([]);

  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    classId: "",
    feeType: "",
    amount: "",
    frequency: "MONTHLY",
    dueDay: "",
    academicYear: "",
    isMandatory: true,
    lateFine: 0,
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedFeeStructId, setSelectedFeeStructId] = useState(null);

  // Get All Fee Structures
  const getFeeStructures = async () => {
    try {
      const response = await api.get("/schoolerp/fee-structures/all");

      setFeeStructures(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch fee structures");
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
    getFeeStructures();
    getClasses();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,

      [name]: name === "lateFine" && value === "" ? 0 : updatedValue,
    }));
  };

  // Add Fee Structure
  const handleAddFeeStructure = async () => {
    try {
      await api.post("/schoolerp/fee-structures/add", formData);

      alert("Fee Structure Added Successfully");

      resetForm();
      getFeeStructures();
    } catch (error) {
      console.error(error);
      alert("Failed to Add Fee Structure");
    }
  };

  // Update Fee Structure
  const handleUpdateFeeStructure = async () => {
    try {
      await api.put(
        `/schoolerp/fee-structures/update/${selectedFeeStructId}`,
        formData,
      );

      alert("Fee Structure Updated Successfully");

      resetForm();
      getFeeStructures();
    } catch (error) {
      console.error(error);
      alert("Failed to Update Fee Structure");
    }
  };

  // Delete Fee Structure
  const handleDelete = async (feeStructId) => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this fee structure?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schoolerp/fee-structures/delete/${feeStructId}`);

      alert("Fee Structure Deleted Successfully");

      getFeeStructures();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // Edit Fee Structure
  const handleEdit = (fee) => {
    setEditMode(true);

    setSelectedFeeStructId(fee.feeStructId);

    setFormData({
      classId: fee.classes?.classId || "",
      feeType: fee.feeType,
      amount: fee.amount,
      frequency: fee.frequency,
      dueDay: fee.dueDay,
      academicYear: fee.academicYear,
      isMandatory: fee.isMandatory,
      lateFine: fee.lateFine || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset Form
  const resetForm = () => {
    setEditMode(false);

    setSelectedFeeStructId(null);

    setFormData({
      classId: "",
      feeType: "",
      amount: "",
      frequency: "MONTHLY",
      dueDay: "",
      academicYear: "",
      isMandatory: true,
      lateFine: "",
    });
  };

  // Search Filter
  const filteredFeeStructures = feeStructures.filter(
    (fee) =>
      fee.feeType?.toLowerCase().includes(search.toLowerCase()) ||
      fee.frequency?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">Fee Structure Management</h2>

        <span className="badge bg-dark fs-6">
          Total Records: {feeStructures.length}
        </span>
      </div>

      {/* Form */}
      <div className="card shadow rounded-4 p-4 mb-5">
        <h4 className="text-primary mb-4">
          {editMode ? "Update Fee Structure" : "Add Fee Structure"}
        </h4>

        <div className="row">
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
                  {cls.classId}
                  {" - "}
                  {cls.className}
                  {" ("}
                  {cls.section})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Fee Type</label>

            <input
              type="text"
              className="form-control"
              placeholder="Ex: Tuition Fee"
              name="feeType"
              value={formData.feeType}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Amount</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Frequency</label>

            <select
              className="form-select"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
            >
              <option value="ONE_TIME">ONE_TIME</option>

              <option value="MONTHLY">MONTHLY</option>

              <option value="QUARTERLY">QUARTERLY</option>

              <option value="HALF_YEARLY">HALF_YEARLY</option>

              <option value="YEARLY">YEARLY</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Due Day</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Due Day"
              name="dueDay"
              value={formData.dueDay}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Academic Year</label>

            <input
              type="text"
              className="form-control"
              placeholder="Ex: 2025-2026"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Late Fine</label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Late Fine"
              name="lateFine"
              value={formData.lateFine}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isMandatory"
                checked={formData.isMandatory}
                onChange={handleChange}
              />

              <label className="form-check-label">Mandatory Fee</label>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            {editMode ? (
              <>
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateFeeStructure}
                >
                  Update
                </button>

                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleAddFeeStructure}
              >
                Add Fee Structure
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by Fee Type or Frequency..."
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
                <th>Class ID</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Due Day</th>
                <th>Mandatory</th>
                <th>Late Fine</th>
                <th>Academic Year</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredFeeStructures.map((fee) => (
                <tr key={fee.feeStructId}>
                  <td>{fee.feeStructId}</td>

                  <td>{fee.classes?.classId || "N/A"}</td>

                  <td>{fee.feeType}</td>

                  <td>₹{fee.amount}</td>

                  <td>{fee.frequency}</td>

                  <td>{fee.dueDay}</td>

                  <td>{fee.isMandatory ? "Yes" : "No"}</td>

                  <td>₹{fee.lateFine}</td>

                  <td>{fee.academicYear}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(fee)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(fee.feeStructId)}
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
