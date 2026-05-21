import api from "../../routers/api";

import { useEffect, useState } from "react";

export function StudentFees() {
  const [feeStructures, setFeeStructures] = useState([]);

  const [feeTransactions, setFeeTransactions] = useState([]);

  const [search, setSearch] = useState("");

  const userId = localStorage.getItem("userId");
  // Fetch Fee Structure
  const getFeeStructures = async () => {
    try {
      const response = await api.get(
        `/schoolerp/fee-structures/student/${userId}`,
      );

      setFeeStructures(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch fee structure");
    }
  };

  // Fetch Fee Transactions
  const getFeeTransactions = async () => {
    try {
      const response = await api.get(
        `/schoolerp/fee-transactions/student/${userId}`,
      );

      setFeeTransactions(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch fee transactions");
    }
  };

  useEffect(() => {
    getFeeStructures();
    getFeeTransactions();
  }, []);

  // Search
  const filteredTransactions = feeTransactions.filter(
    (item) =>
      item.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      item.paymentMode?.toLowerCase().includes(search.toLowerCase()) ||
      item.feeTransactionStatus?.toLowerCase().includes(search.toLowerCase()),
  );

  // Summary
  const totalPaid = feeTransactions.reduce(
    (sum, fee) => sum + (fee.amountPaid || 0),
    0,
  );

  const totalDue = feeTransactions.reduce(
    (sum, fee) => sum + (fee.amountDue || 0),
    0,
  );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="card shadow-lg border-0 rounded-4 bg-success text-white p-4 mb-4">
        <h2 className="fw-bold">Fee Management</h2>

        <p className="mb-0">View fee structure and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-primary text-white">
            <h3>₹{totalPaid.toFixed(2)}</h3>
            <h5>Total Paid</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-danger text-white">
            <h3>₹{totalDue.toFixed(2)}</h3>
            <h5>Amount Due</h5>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 rounded-4 text-center p-4 bg-warning text-dark">
            <h3>{feeTransactions.length}</h3>
            <h5>Transactions</h5>
          </div>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="card shadow-lg border-0 rounded-4 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-success">Fee Structure</h4>

            <span className="badge bg-success fs-6">
              Total Fees: {feeStructures.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-success">
                <tr>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                  <th>Due Day</th>
                  <th>Late Fine</th>
                  <th>Mandatory</th>
                </tr>
              </thead>

              <tbody>
                {feeStructures.length > 0 ? (
                  feeStructures.map((fee) => (
                    <tr key={fee.feeStructId}>
                      <td>{fee.feeType}</td>

                      <td>₹{fee.amount}</td>

                      <td>{fee.frequency}</td>

                      <td>{fee.dueDay}</td>

                      <td>₹{fee.lateFine}</td>

                      <td>
                        {fee.isMandatory ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-danger">No</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-muted py-4">
                      No fee structure found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow border-0 rounded-4 p-3 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search transaction, payment mode or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Transactions */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="text-primary">Payment History</h4>

            <span className="badge bg-primary fs-6">
              Total Payments: {feeTransactions.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Transaction ID</th>
                  <th>Receipt No</th>
                  <th>Due Amount</th>
                  <th>Paid Amount</th>
                  <th>Late Fine</th>
                  <th>Payment Mode</th>
                  <th>Due Date</th>
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

                      <td>
                        <span
                          className={`badge ${
                            payment.feeTransactionStatus === "SUCCESS"
                              ? "bg-success"
                              : payment.feeTransactionStatus === "FAILED"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                          }`}
                        >
                          {payment.feeTransactionStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-muted py-4">
                      No fee transactions found
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
