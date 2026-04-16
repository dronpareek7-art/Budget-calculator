import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../Components/Header";
import AddTransaction from "../Components/AddTransaction";
import TransactionList from "../Components/TransactionList";
import "./index.css";

const Calculator = ({ transactions, setTransactions, user, setUser }) => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [UsdRate, setUsdRate] = useState(0);
  const [Filter, setFilter] = useState("All");
  const [category, setCategory] = useState("");

  // ✅ onAuthStateChanged HATA DIYA — already main.jsx mein hai

  useEffect(() => {
    CurrConversion();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id, // ✅ Firestore string ID
        ...doc.data(),
      }));
      setTransactions(data);
    };

    fetchData();
  }, [user]);

  async function CurrConversion() {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const result = await response.json();
    setUsdRate(result.rates.INR);
  }

  async function AddIncome() {
    if (!user) {
      alert("Please login first 🔐");
      return;
    }

    let ConvertedAmount = Number(amount);
    if (currency === "USD") {
      ConvertedAmount = Number(amount) * UsdRate;
    }
    ConvertedAmount = Math.round(ConvertedAmount * 100) / 100;

    const obj = {
      Title: description,
      currencyType: currency,
      type: incometype,
      TransactionAmount: ConvertedAmount,
      category: category,
      userId: user.uid,
    };

    // ✅ Firestore ka auto-generated ID use karo
    const docRef = await addDoc(collection(db, "transactions"), obj);
    setTransactions([...transactions, { id: docRef.id, ...obj }]);

    setIncomeType("");
    setCurrency("");
    setAmount("");
    setDescription("");
    setCategory("");
  }

  // ✅ Firestore se bhi delete karo
  async function DeleteTrans(TransToDelete) {
    await deleteDoc(doc(db, "transactions", TransToDelete));
    setTransactions(transactions.filter((obj) => obj.id !== TransToDelete));
  }

  const totalIncome = transactions.reduce(
    (acc, obj) => (obj.type === "income" ? acc + obj.TransactionAmount : acc), 0
  );
  const totalExpense = transactions.reduce(
    (acc, obj) => (obj.type === "expense" ? acc + obj.TransactionAmount : acc), 0
  );
  const totalBalance = totalIncome - totalExpense;

  const filterTransaction =
    Filter === "All"
      ? transactions
      : transactions.filter((obj) => obj.currencyType === Filter);

  return (
    <div className="Container">
      <h1>Budget Tracker</h1>
      <p>Track your income and expenses in multiple currencies</p>

      <Header
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        UsdRate={UsdRate}
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
        />
        <TransactionList
          filterTransaction={filterTransaction}
          setFilter={setFilter}
          DeleteTrans={DeleteTrans}
        />
      </div>
    </div>
  );
};

export default Calculator;