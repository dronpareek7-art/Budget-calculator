import React from "react";
import { useState , useEffect } from "react";
import { MdCurrencyRupee, MdAccountBalance, MdTrendingUp, MdTrendingDown , MdRefresh } from "react-icons/md";

const Header = ({ totalBalance, totalIncome, totalExpense, UsdRate, onRefreshRate}) => {


  const [lastUpdated, setLastUpdated] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [spinning, setSpinning] = useState(false);
   useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const diff = Math.floor((Date.now() - lastUpdated) / 1000);
        setSecondsAgo(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

    const handleRefresh = async () => {
    if (cooldown) return;

    setSpinning(true);
    setCooldown(true);

    await onRefreshRate();

    setLastUpdated(Date.now());
    setSecondsAgo(0);
    setSpinning(false);

    setTimeout(() => {
      setCooldown(false);
    }, 60000);
  };
  const formatAgo = (secs) => {
    if (secs === null) return null;
    if (secs < 60) return `Updated ${secs}s ago`;
    return `Updated ${Math.floor(secs / 60)}m ago`;
  };


  return (
    <div className="Header">
      <div className="header-meta">
        <h2>Balance Overview</h2>
        {/* <span className="usd-rate">1 USD = ₹{UsdRate ? UsdRate.toFixed(2) : "—"}</span> */}

        <div className="usd-row">
          <span className="usd-rate">
            1 USD = ₹{UsdRate ? UsdRate.toFixed(2) : "—"}
          </span>

          <button
            className={`refresh-btn ${cooldown ? "disabled" : ""}`}
            onClick={handleRefresh}
          >
            <MdRefresh className={spinning ? "spin" : ""} size={18} />
          </button>

          {secondsAgo !== null && (
            <span className="updated-text">{formatAgo(secondsAgo)}</span>
          )}
        </div>
      </div>

      <div className="stat-card balance">
        <span className="stat-label">Total Balance</span>
        <span className="stat-value">
          <MdCurrencyRupee size={18} />
          {totalBalance.toFixed(2)}
        </span>
        <MdAccountBalance className="stat-icon" />
      </div>

      <div className="stat-card income">
        <span className="stat-label">Total Income</span>
        <span className="stat-value">
          <MdCurrencyRupee size={18} />
          {totalIncome.toFixed(2)}
        </span>
        <MdTrendingUp className="stat-icon" />
      </div>

      <div className="stat-card expense">
        <span className="stat-label">Total Expenses</span>
        <span className="stat-value">
          <MdCurrencyRupee size={18} />
          {totalExpense.toFixed(2)}
        </span>
        <MdTrendingDown className="stat-icon" />
      </div>
    </div>
  );
};

export default Header;