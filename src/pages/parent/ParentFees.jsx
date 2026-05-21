import api from "../../routers/api";

import { useEffect, useState } from "react";

export function ParentFees() {
  const [feeTransactions, setFeeTransactions] = useState([]);

  const [search, setSearch] = useState("");

  const parentId = localStorage.getItem("userId");

  // Fetch Child Fee Transactions
  const getFeeTransactions = async () => {
    try {
      const response = await api.get(
        `/schoolerp/fee-transactions/parent/${parentId}`,
      );

      setFeeTransactions(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch fee details");
    }
  };

  useEffect(() => {
    getFeeTransactions();
  }, []);

  // Search Filter
  const filteredTransactions = feeTransactions.filter(
    (item) =>
      item.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      item.paymentMode?.toLowerCase().includes(search.toLowerCase()) ||
      item.feeTransactionStatus?.toLowerCase().includes(search.toLowerCase()) ||
      item.academicYear?.toLowerCase().includes(search.toLowerCase()),
  );

  // Statistics
  const totalPaid = feeTransactions.reduce(
    (sum, fee) => sum + Number(fee.amountPaid || 0),
    0,
  );

  const totalDue = feeTransactions.reduce(
    (sum, fee) => sum + Number(fee.amountDue || 0),
    0,
  );

  const totalLateFine = feeTransactions.reduce(
    (sum, fee) => sum + Number(fee.lateFine || 0),
    0,
  );

  const pendingAmount = totalDue - totalPaid;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-success text-white p-4 mb-4">
        <h2 className="fw-bold">Fee Details</h2>

        <p className="mb-0">View your child's payment history and fee status</p>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 bg-success text-white text-center p-4">
            <h2>₹{totalPaid.toFixed(2)}</h2>
            <h5>Total Paid</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 bg-danger text-white text-center p-4">
            <h2>₹{pendingAmount.toFixed(2)}</h2>
            <h5>Pending Amount</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 bg-warning text-dark text-center p-4">
            <h2>₹{totalLateFine.toFixed(2)}</h2>
            <h5>Late Fine</h5>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by transaction ID, payment mode, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Fee Table */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-success">Payment Records</h4>

            <span className="badge bg-success fs-6">
              Total Transactions: {feeTransactions.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>Transaction ID</th>
                  <th>Receipt No</th>
                  <th>Due Amount</th>
                  <th>Paid Amount</th>
                  <th>Late Fine</th>
                  <th>Payment Mode</th>
                  <th>Due Date</th>
                  <th>Academic Year</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((payment) => (
                    <tr key={payment.transactionId}>
                      <td>{payment.transactionId}</td>

                      <td>{payment.recieptNo}</td>

                      <td>₹{payment.amountDue}</td>

                      <td>₹{payment.amountPaid}</td>

                      <td>₹{payment.lateFine}</td>

                      <td>{payment.paymentMode}</td>

                      <td>{payment.dueDate}</td>

                      <td>{payment.academicYear}</td>

                      <td>
                        <span
                          className={`badge ${
                            payment.feeTransactionStatus === "SUCCESS"
                              ? "bg-success"
                              : payment.feeTransactionStatus === "FAILED"
                                ? "bg-danger"
                                : payment.feeTransactionStatus === "PENDING"
                                  ? "bg-warning text-dark"
                                  : "bg-info"
                          }`}
                        >
                          {payment.feeTransactionStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-muted py-4">
                      No fee records found
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
