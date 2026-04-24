import React from "react";
import { useState } from "react";
import ExpensePieChart from "../Components/Charts/ExpensePieChart";
import IncomeBarChart from "../Components/Charts/IncomeBarChart";

const Analytics = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const getMonth = (date) => {
  return new Date(date).toLocaleString("default", { month: "short" });
};
const months = [
  "All", "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];
const filteredTransactions =
  selectedMonth === "All"
    ? transactions
    : transactions.filter(
        (t) => getMonth(t.date) === selectedMonth
      );

  // const totalIncome = transactions.reduce(
  //   (acc, t) => (t.type === "income" ? acc + t.TransactionAmount : acc), 0
  // );
  // const totalExpense = transactions.reduce(
  //   (acc, t) => (t.type === "expense" ? acc + t.TransactionAmount : acc), 0
  // );
  const totalIncome = filteredTransactions
  .filter((t) => t.type === "income")
  .reduce((acc, t) => acc + t.TransactionAmount, 0);

const totalExpense = filteredTransactions
  .filter((t) => t.type === "expense")
  .reduce((acc, t) => acc + t.TransactionAmount, 0);

const barData = [
  { name: "Income", value: totalIncome },
  { name: "Expense", value: totalExpense }
];

  // const barData = [
  //   { name: "Income", value: totalIncome },
  //   { name: "Expense", value: totalExpense },
  // ];

  return (
    <div className="Container">
      <h1>Analytics</h1>
      <p>See Your Expense and Income Breakdown</p>
      <div className="month-filter">
  {months.map((m) => (
    <button
      key={m}
      className={selectedMonth === m ? "active" : ""}
      onClick={() => setSelectedMonth(m)}
    >
      {m}
    </button>
  ))}
</div>
      {/* <ExpensePieChart transactions={transactions} />
      <IncomeBarChart data={barData} /> */}
      <ExpensePieChart transactions={filteredTransactions} />

<IncomeBarChart data={barData} />
    </div>
  );
};

export default Analytics;