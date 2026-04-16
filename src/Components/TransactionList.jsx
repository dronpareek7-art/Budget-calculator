import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

const TransactionList = ({ filterTransaction, setFilter, Filter, DeleteTrans }) => {
  return (
    <div className="Transaction_history">
      <h1>Transaction History</h1>

      <div className="Buttons">
        {["All", "INR", "USD"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${Filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "INR" ? "₹ INR" : f === "USD" ? "$ USD" : "All"}
          </button>
        ))}
      </div>

      {filterTransaction.length === 0 ? (
        <div className="txn-empty">
          <p>No transactions yet.</p>
          <p>Add one to get started!</p>
        </div>
      ) : (
        filterTransaction.map((obj) => (
          <div key={obj.id} className="txn-row">
            <span className={`txn-dot ${obj.type}`} />

            <div className="txn-info">
              <div className="txn-title">{obj.Title}</div>
              <div className="txn-meta">
                {obj.category && <span>{obj.category}</span>}
                {obj.category && <span> · </span>}
                <span>{obj.currencyType}</span>
                
              </div>
              
            </div>

            <span className={`txn-amount ${obj.type}`}>
              {obj.type === "income" ? "+" : "−"}
              <MdCurrencyRupee style={{ verticalAlign: "middle" }} />
              {obj.TransactionAmount.toFixed(2)}

            </span>

            <ImCancelCircle
              onClick={() => DeleteTrans(obj.id)}
              className="Deletebtn"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;