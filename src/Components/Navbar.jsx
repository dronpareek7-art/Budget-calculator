import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { MdPerson, MdLogin, MdLogout, MdMenu, MdClose } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { GiWallet } from "react-icons/gi";
import "./Navbar.css";

const Navbar = ({ user, setUser, setTransactions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    setTransactions([]);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <GiWallet size={20} /> Budget Tracker
        </Link>
      </div>

      {/* Hamburger */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link
          to="/analytics"
          className={`nav-link ${
            location.pathname === "/analytics" ? "active" : ""
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <SiSimpleanalytics /> Analytics
        </Link>

        <Link
          to="/profile"
          className={`nav-link ${
            location.pathname === "/profile" ? "active" : ""
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <MdPerson /> Profile
        </Link>

        {user ? (
          <button
            className="nav-btn logout"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            <MdLogout /> Logout
          </button>
        ) : (
          <Link to="/" className="nav-btn login">
            <MdLogin /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;