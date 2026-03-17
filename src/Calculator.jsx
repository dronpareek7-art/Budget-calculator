import React, { useEffect, useState } from "react";

const Calculator = () => {
  const [incomeType, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [USDprice, setUSDprice] = useState(0);
  const [lastUpdate, setLastupdate] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    convertcurrency();
  }, []);
  async function convertcurrency() {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await response.json();
    setUSDprice(data.rates.INR);
    console.log(data);
    setLastupdate(data.time_last_update_utc);
  }
  function AddIncome() {
    let convertedAmount = Number(amount);
    if (currency === "USD") {
      convertedAmount = Number(amount) * USDprice;
    }

    const obj = {
      id: Date.now(),
      title: description,
      currencyType: currency,
      type: incomeType,
      transactionamount: convertedAmount,
    };
    setTransaction([...transaction, obj]);
    setIncomeType("");
    setCurrency("");
    setAmount("");
    setDescription("");
  }
  const totalIncome = transaction.reduce((acc, obj) => {
    if (obj.type === "income") {
      return acc + obj.transactionamount;
    }
    return acc;
  }, 0);

  const totalExpense = transaction.reduce((acc, obj) => {
    if (obj.type === "expense") {
      return acc + obj.transactionamount;
    }
    return acc;
  }, 0);

  const totalBalance = totalIncome - totalExpense;

  const Transctionfilter =
    filter === "all"
      ? transaction
      : transaction.filter((obj) => obj.currencyType === filter);

  return (
    <div className="container">
      <div className="header">
        <h1>Budget Tracker</h1>
        <p>Track your income and expenses in multiple currencies</p>
      </div>
      <div className="balance-overview">
        <h2>Balance Overview (All amounts in INR)</h2>
        <p>
          {" "}
          <b>1 USD = ₹ {USDprice.toFixed(2)} , </b>
          <span> last updated : {new Date(lastUpdate).toDateString()}</span>
        </p>
        <div className="total-balance">
          <h4>Total Balance</h4>
          <p>₹ {totalBalance.toFixed(2)}</p>
        </div>

        <div className="both-total">
          <div>
            <h4>Total Income</h4>
            <p className="income">₹ {totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <h4>Total Expenses</h4>
            <p className="expense">₹ {totalExpense.toFixed(2)}</p>
          </div>
        </div>
        <p>Transactions length</p>
      </div>
      <div className="transaction-wrapper">
        <div className="add-transaction">
          <h2>Add Trancation</h2>
          <label htmlFor="">Types:</label>
          <select
            className="transaction-types"
            onChange={(e) => setIncomeType(e.target.value)}
            value={incomeType}
          >
            <option value="">Select transaction type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <label htmlFor="">Currency:</label>
          <select
            className="currency-types"
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
          >
            <option value="">Select Currency</option>
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>

          <div className="amount">
            <label htmlFor="">Amount(₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="description">
            <label htmlFor="">Description :</label>
            <input
              type="text"
              placeholder="Enter Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button onClick={() => AddIncome()}> Add Income (INR)</button>
        </div>

        <div className="history">
          <h2>Trancation History</h2>
          <div className="buttons">
            <button onClick={() => setFilter("USD")}>$USD</button>
            <button onClick={() => setFilter("INR")}>₹ INR</button>
            <button onClick={() => setFilter("all")}>All</button>
          </div>
          {Transctionfilter.map((obj) => {
            return (
              <div key={obj.id}>
                <span>{obj.title}</span>
                <span>{obj.currencyType}</span>

                <span
                  style={{
                    color: obj.type === "income" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {obj.type === "income" ? "+" : "-"}
                  {obj.transactionamount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
