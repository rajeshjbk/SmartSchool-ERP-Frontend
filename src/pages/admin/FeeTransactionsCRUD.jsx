import api from "../../routers/api";
import { useEffect, useState } from "react";

export function FeeTransactionsCRUD() {
  const [transactions, setTransactions] = useState([]);

  const [students, setStudents] = useState([]);

  const [feeStructures, setFeeStructures] = useState([]);

  const [search, setSearch] = useState("");

  const username = localStorage.getItem("username") || "Admin";

  // Generate 14 Digit Transaction ID
  const generateTransactionId = () => {
    return Math.floor(
      10000000000000 + Math.random() * 90000000000000,
    ).toString();
  };

  const [formData, setFormData] = useState({
    studentId: "",
    feeStructId: "",
    amountDue: "",
    lateFine: 0,
    amountPaid: "",
    dueDate: "",
    paymentMode: "CASH",
    feeTransactionStatus: "INITIATED",

    transactionId: generateTransactionId(),

    recieptNo: "",

    collectedBy: username,

    academicYear: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // Get Transactions
  const getTransactions = async () => {
    try {
      const response = await api.get("/schoolerp/fee-transactions/all");

      setTransactions(response.data);
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

  // Get Fee Structures
  const getFeeStructures = async () => {
    try {
      const response = await api.get("/schoolerp/fee-structures/all");

      setFeeStructures(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTransactions();
    getStudents();
    getFeeStructures();
  }, []);

  // Handle Change
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Student selection
    if (name === "studentId") {
      const selectedStudent = students.find(
        (student) => student.studentId == value,
      );

      if (selectedStudent?.classes?.classId) {
        const selectedFee = feeStructures.find(
          (fee) => fee.classes?.classId === selectedStudent.classes.classId,
        );

        setFormData((prev) => ({
          ...prev,

          studentId: value,

          feeStructId: selectedFee?.feeStructId || "",

          amountDue: selectedFee?.amount || 0,

          lateFine: selectedFee?.lateFine || 0,

          amountPaid: selectedFee?.amount || 0,

          academicYear: selectedFee?.academicYear || "",
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Transaction
  const handleAddTransaction = async () => {
    try {
      await api.post("/schoolerp/fee-transactions/add", formData);

      alert("Transaction Added Successfully");

      resetForm();
      getTransactions();
    } catch (error) {
      console.error(error);

      alert("Failed to Add Transaction");
    }
  };

  // Update Transaction
  const handleUpdateTransaction = async () => {
    try {
      await api.put(
        `/schoolerp/fee-transactions/update/${selectedTransactionId}`,
        formData,
      );

      alert("Transaction Updated Successfully");

      resetForm();
      getTransactions();
    } catch (error) {
      console.error(error);

      alert("Failed to Update Transaction");
    }
  };

  // Edit
  const handleEdit = (transaction) => {
    setEditMode(true);

    setSelectedTransactionId(transaction.feeTransactionsId);

    setFormData({
      studentId: transaction.student?.studentId || "",

      feeStructId: transaction.feeStructures?.feeStructId || "",

      amountDue: transaction.amountDue,

      lateFine: transaction.lateFine,

      amountPaid: transaction.amountPaid,

      dueDate: transaction.dueDate,

      paymentMode: transaction.paymentMode,

      feeTransactionStatus: transaction.feeTransactionStatus,

      transactionId: transaction.transactionId,

      recieptNo: transaction.recieptNo,

      collectedBy: transaction.collectedBy,

      academicYear: transaction.academicYear,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset
  const resetForm = () => {
    setEditMode(false);

    setSelectedTransactionId(null);

    setFormData({
      studentId: "",
      feeStructId: "",
      amountDue: "",
      lateFine: 0,
      amountPaid: "",
      dueDate: "",
      paymentMode: "CASH",

      feeTransactionStatus: "INITIATED",

      transactionId: generateTransactionId(),

      recieptNo: "",

      collectedBy: username,

      academicYear: "",
    });
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.student?.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.transactionId?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      <h2 className="text-danger fw-bold mb-4">Fee Transactions Management</h2>

      <div className="card shadow rounded-4 p-4">
        <div className="row">
          {/* Student */}
          <div className="col-md-3 mb-3">
            <label>Student</label>

            <select
              className="form-select"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId} - {student.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Structure */}
          <div className="col-md-3 mb-3">
            <label>Fee Structure</label>

            <select
              className="form-select"
              value={formData.feeStructId}
              disabled
            >
              <option value="">Select Fee Structure</option>

              {feeStructures.map((fee) => (
                <option key={fee.feeStructId} value={fee.feeStructId}>
                  {fee.feeType} - {fee.classes?.className}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction ID */}
          <div className="col-md-3 mb-3">
            <label>Transaction ID</label>

            <input
              type="text"
              className="form-control"
              value={formData.transactionId}
              readOnly
            />
          </div>

          {/* Collected By */}
          <div className="col-md-3 mb-3">
            <label>Collected By</label>

            <input
              type="text"
              className="form-control"
              value={formData.collectedBy}
              readOnly
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-3 mb-3">
            <label>Amount Due</label>
            <input
              type="number"
              className="form-control"
              name="amountDue"
              value={formData.amountDue}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Late Fine</label>
            <input
              type="number"
              className="form-control"
              name="lateFine"
              value={formData.lateFine}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Amount Paid</label>
            <input
              type="number"
              className="form-control"
              name="amountPaid"
              value={formData.amountPaid}
              readOnly
            />
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
            <label>Payment Mode</label>
            <select
              className="form-select"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
            >
              <option>CASH</option>
              <option>UPI</option>
              <option>NET_BANKING</option>
              <option>DEBIT_CARD</option>
              <option>CREDIT_CARD</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Status</label>
            <select
              className="form-select"
              name="feeTransactionStatus"
              value={formData.feeTransactionStatus}
              onChange={handleChange}
            >
              <option>INITIATED</option>
              <option>PENDING</option>
              <option>SUCCESS</option>
              <option>FAILED</option>
              <option>CANCELLED</option>
              <option>REFUNDED</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Receipt No</label>
            <input
              type="text"
              className="form-control"
              value={formData.recieptNo}
              readOnly
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Academic Year</label>
            <input
              type="text"
              className="form-control"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="2026-2027"
            />
          </div>
        </div>

        <div className="mt-3">
          {editMode ? (
            <>
              <button
                className="btn btn-warning me-2"
                onClick={handleUpdateTransaction}
              >
                Update Transaction
              </button>

              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-success" onClick={handleAddTransaction}>
              Add Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
