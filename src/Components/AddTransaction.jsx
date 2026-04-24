import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import CategorySelector from "./CategorySelector";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";
const AddTransaction = ({
  incometype,
  setIncomeType,
  currency,
  setCurrency,
  amount,
  setAmount,
  description,
  setDescription,
  category,
  setCategory,
  AddIncome,  
  user,
  isAdding,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  return (
    <div className="Add_transaction">
      <h1>Add Transaction</h1>
      <div className="form-group">
        <label>Month</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${incometype === "income" ? "active-income" : ""}`}
            onClick={() => setIncomeType("income")}
          >
            + Income
          </button>
          <button
            type="button"
            className={`type-btn ${incometype === "expense" ? "active-expense" : ""}`}
            onClick={() => setIncomeType("expense")}
          >
            − Expense
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="">Select currency</option>
          <option value="INR">₹ INR — Indian Rupee </option>
          <option value="USD">$ USD — US Dollar</option>
        </select>
        <FaChevronDown className="dropdown-icon" />
      </div>

      <div className="form-group">
        <label>
          Amount <MdCurrencyRupee style={{ verticalAlign: "middle" }} />
        </label>
        <input
          type="number"
          placeholder="0.00"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          placeholder="e.g. Groceries, Salary..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {incometype && currency && amount && (
        <CategorySelector category={category} setCategory={setCategory} />
      )}

      <button
        className="AddExpense"
        onClick={() => AddIncome(selectedMonth)}
        disabled={!user || isAdding}
      >
        {isAdding ? "Saving..." : "Add Transaction"}
      </button>
    </div>
  );
};

export default AddTransaction;
