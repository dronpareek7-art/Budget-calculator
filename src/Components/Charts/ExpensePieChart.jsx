import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#ec4899", "#14b8a6", "#f97316",
];

// Custom legend jo mobile pe bhi clean dikhe
const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "8px 16px",
      padding: "8px 0 0 0",
      margin: 0,
      listStyle: "none",
    }}>
      {payload.map((entry, index) => (
        <li key={index} style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#e5e7eb",
        }}>
          <span style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: entry.color,
            flexShrink: 0,
          }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const ExpensePieChart = ({ transactions }) => {
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const found = acc.find((item) => item.name === t.category);
      if (found) {
        found.value += t.TransactionAmount;
      } else {
        acc.push({ name: t.category || "Other", value: t.TransactionAmount });
      }
      return acc;
    }, []);

  if (categoryData.length === 0) {
    return (
      <div className="chart-card">
        <h2>Expense by Category</h2>
        <p style={{ color: "#9ca3af", textAlign: "center", paddingTop: "60px" }}>
          No expense yet
        </p>
      </div>
    );
  }

  // Mobile check — window width ke hisaab se
  const isMobile = typeof window !== "undefined" && window.innerWidth < 500;

  return (
    <div className="chart-card" style={{ width: "100%" }}>
      <h2>Expense by Category</h2>

      {/* Pie chart ka height mobile pe kam */}
      <div style={{ width: "100%", height: isMobile ? 220 : 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 110}
              dataKey="value"
              // Mobile pe label band — overlap hoti hain
              label={isMobile ? false : ({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={!isMobile}
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend — har screen pe neeche, wrap hoti hai */}
      <div style={{ width: "100%", paddingBottom: 8 }}>
        {renderCustomLegend({
          payload: categoryData.map((entry, index) => ({
            value: entry.name,
            color: COLORS[index % COLORS.length],
          })),
        })}
      </div>
    </div>
  );
};

export default ExpensePieChart;