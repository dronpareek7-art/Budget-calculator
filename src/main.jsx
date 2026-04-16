import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Components/Router.jsx";
import "./pages/index.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ? u : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router
      transactions={transactions}
      setTransactions={setTransactions}
      user={user}
      setUser={setUser}
    />
  );
};

createRoot(document.getElementById("root")).render(<App />);