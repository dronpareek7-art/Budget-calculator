import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "../Components/Header";
import AddTransaction from "../Components/AddTransaction";
import TransactionList from "../Components/TransactionList";
import "./index.css";

const Calculator = ({ transactions, setTransactions, user }) => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [UsdRate, setUsdRate] = useState(0);
  const [Filter, setFilter] = useState("All");
  const [category, setCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const fetchedForUser = useRef(null);

  useEffect(() => {
    CurrConversion();
  }, []);

  useEffect(() => {
    if (!user || fetchedForUser.current === user.uid) return;
    fetchedForUser.current = user.uid;

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [user]);

  async function CurrConversion() {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      setUsdRate(data.rates.INR);
    } catch {
      setUsdRate(84);
    }
  }

  async function AddIncome(selectedMonth) {
    if (!user) {
      alert("Please login first");
      return;
    }
    if (!incometype) {
      alert("Transaction type select karo");
      return;
    }
    if (!currency) {
      alert("Currency select karo");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Valid amount enter karo");
      return;
    }
    if (!description.trim()) {
      alert("Description enter karo");
      return;
    }
    if (!category) {
      alert("Category select karo");
      return;
    }

    setIsAdding(true);

    let converted = Number(amount);
    if (currency === "USD") converted = Number(amount) * UsdRate;
    converted = Math.round(converted * 100) / 100;
    const fullDate = selectedMonth
      ? new Date(`${selectedMonth}-01`).toISOString()
      : new Date().toISOString();

    const obj = {
      Title: description.trim(),
      currencyType: currency,
      type: incometype,
      TransactionAmount: converted,
      category: category,
      userId: user.uid,
      createdAt: Date.now(),

      date: fullDate,
    };

    const tempId = "temp_" + Date.now();

    try {
      setTransactions((prev) => [...prev, { id: tempId, ...obj }]);

      setIncomeType("");
      setCurrency("");
      setAmount("");
      setDescription("");
      setCategory("");

      const docRef = await addDoc(collection(db, "transactions"), obj);

      setTransactions((prev) =>
        prev.map((t) => (t.id === tempId ? { ...t, id: docRef.id } : t)),
      );
    } catch (err) {
      console.error("Add error:", err);
      alert("Save nahi hua: " + err.message);
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
    } finally {
      setIsAdding(false);
    }
  }

  async function DeleteTrans(id) {
    if (id.startsWith("temp_")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  const totalIncome = transactions.reduce(
    (acc, t) => (t.type === "income" ? acc + t.TransactionAmount : acc),
    0,
  );
  const totalExpense = transactions.reduce(
    (acc, t) => (t.type === "expense" ? acc + t.TransactionAmount : acc),
    0,
  );
  const totalBalance = totalIncome - totalExpense;

  const filterTransaction =
    Filter === "All"
      ? transactions
      : transactions.filter((t) => t.currencyType === Filter);

  return (
    <div className="Container">
      <div className="page-header">
        <h1 className="page-title">Budget Tracker</h1>
        <p className="page-subtitle">
          Track your income & expenses across currencies
        </p>
      </div>

      <Header
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        UsdRate={UsdRate}
        onRefreshRate={CurrConversion}
      />

      <div className="Transaction_box">
        <AddTransaction
          incometype={incometype}
          setIncomeType={setIncomeType}
          currency={currency}
          setCurrency={setCurrency}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          AddIncome={AddIncome}
          user={user}
          isAdding={isAdding}
        />
        <TransactionList
          filterTransaction={filterTransaction}
          setFilter={setFilter}
          Filter={Filter}
          DeleteTrans={DeleteTrans}
        />
      </div>
    </div>
  );
};

export default Calculator;
